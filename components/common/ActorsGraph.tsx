export interface ActorsGraphActorType {
  slug: string;
  label: string;
  color?: string;
}

export interface ActorsGraphActor {
  _id: string;
  name: string;
  /** First entry of the Actor's own `type` array — see queries.ts. */
  type?: ActorsGraphActorType;
}

export interface ActorsGraphProps {
  title: string;
  content?: string;
  backgroundColor?: string;
  actors: ActorsGraphActor[];
}

// --- Geometry: same square-viewBox approach as InitiativesGraph.tsx, so
// the ring scales to the container's width without ever distorting into
// an ellipse. ---
const SIZE = 400;
const CENTER = SIZE / 2;
const RING_RADIUS = 150;
const HUB_OUTER_RADIUS = 62;
const HUB_INNER_RADIUS = 38;
const NODE_SIZE = 20;
// A square rotated 45° has a tip-to-tip diagonal of size*sqrt(2), so at the
// same NODE_SIZE a diamond reads visibly larger than the circle/pentagon —
// shrunk 15% to match them.
const DIAMOND_NODE_SIZE = NODE_SIZE * 0.85;
const LABEL_GAP = 10;
const LABEL_WIDTH = 108;
const LABEL_HEIGHT = 48;
const DEFAULT_NODE_COLOR = "#9DC3E6";

// Shape-per-type is this block's own concern, not a field on the shared
// `actorType` document (which the Footer also reads) — keyed on the type's
// stable slug, with a deterministic fallback for any type this doesn't
// know about yet.
const SHAPE_BY_TYPE_SLUG: Record<string, "pentagon" | "diamond" | "circle"> = {
  government: "pentagon",
  "civil-society": "diamond",
  "international-organizations": "circle",
  "international-orgs": "circle",
};
const FALLBACK_SHAPES = ["circle", "diamond", "pentagon"] as const;

function shapeForType(slug: string | undefined, fallbackIndex: number) {
  if (slug && SHAPE_BY_TYPE_SLUG[slug]) return SHAPE_BY_TYPE_SLUG[slug];
  return FALLBACK_SHAPES[fallbackIndex % FALLBACK_SHAPES.length];
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// See InitiativesGraph.tsx's identical helper — Math.cos/Math.sin can
// differ in their last bit between server and browser JS engines, which
// (unrounded) is enough to break SSR/hydration byte-matching.
function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polar(r: number, angleDeg: number) {
  const rad = toRad(angleDeg);
  return { x: round(CENTER + r * Math.cos(rad)), y: round(CENTER + r * Math.sin(rad)) };
}

function pentagonPoints(size: number) {
  const r = size / 2;
  return Array.from({ length: 5 }, (_, i) => {
    const rad = toRad(-90 + i * 72);
    return `${round(r * Math.cos(rad))},${round(r * Math.sin(rad))}`;
  }).join(" ");
}

function NodeShape({
  shape,
  color,
}: {
  shape: "pentagon" | "diamond" | "circle";
  color: string;
}) {
  const stroke = "rgba(0, 0, 0, 0.65)";
  if (shape === "circle") {
    return <circle r={NODE_SIZE / 2} fill={color} stroke={stroke} strokeWidth={1} />;
  }
  if (shape === "diamond") {
    return (
      <rect
        x={-DIAMOND_NODE_SIZE / 2}
        y={-DIAMOND_NODE_SIZE / 2}
        width={DIAMOND_NODE_SIZE}
        height={DIAMOND_NODE_SIZE}
        fill={color}
        stroke={stroke}
        strokeWidth={1}
        transform="rotate(45)"
      />
    );
  }
  return <polygon points={pentagonPoints(NODE_SIZE)} fill={color} stroke={stroke} strokeWidth={1} />;
}

export function ActorsGraph({ title, content, backgroundColor, actors }: ActorsGraphProps) {
  // Legend: the distinct Actor types actually present among the curated
  // actors, not every type in the system — matches the reference design,
  // where the legend only ever lists types that appear in the graph.
  const legend = Array.from(
    new Map(
      actors
        .map((actor) => actor.type)
        .filter((type): type is ActorsGraphActorType => Boolean(type))
        .map((type) => [type.slug, type]),
    ).values(),
  );

  const positioned = actors.map((actor, index) => {
    const angleDeg = -90 + (index / actors.length) * 360;
    const point = polar(RING_RADIUS, angleDeg);
    const labelPoint = polar(RING_RADIUS + LABEL_GAP, angleDeg);
    const shape = shapeForType(actor.type?.slug, index);
    const color = actor.type?.color ?? DEFAULT_NODE_COLOR;
    const rad = toRad(angleDeg);
    // Right half of the ring: label grows rightward from the node. Left
    // half: grows leftward. Near-vertical (top/bottom): centered under/
    // above the node.
    const cos = round(Math.cos(rad));
    const align: "left" | "right" | "center" = cos > 0.15 ? "left" : cos < -0.15 ? "right" : "center";
    // Side nodes (left/right) vertically center the label on the node.
    // Top/bottom nodes stack the label fully above/below instead — without
    // this, a center-aligned label at the very top or bottom of the ring
    // (vertically centered on labelPoint, same as the side case) overlaps
    // back into its own node.
    const sin = round(Math.sin(rad));
    const verticalAlign: "top" | "bottom" | "middle" =
      sin < -0.15 ? "top" : sin > 0.15 ? "bottom" : "middle";
    return { actor, point, labelPoint, shape, color, align, verticalAlign };
  });

  return (
    <section className="my-8 grid w-full border-y lg:my-20 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-8 border-b px-6 py-12 lg:border-b-0 lg:border-r">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full max-w-125 overflow-visible"
          role="img"
          aria-label={title}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeDasharray="4 5"
            className="text-foreground/40"
          />
          <circle cx={CENTER} cy={CENTER} r={HUB_OUTER_RADIUS} fill="none" stroke="currentColor" strokeWidth={1} className="text-foreground/40" />
          {/* Fallback backdrop in case the logo image fails to load or has
              transparent padding — same site logo mark used in the navbar. */}
          <image
            href="/logo.svg"
            x={CENTER - HUB_INNER_RADIUS}
            y={CENTER - HUB_INNER_RADIUS}
            width={HUB_INNER_RADIUS * 2}
            height={HUB_INNER_RADIUS * 2}
          />

          {positioned.map(({ actor, point, labelPoint, shape, color, align, verticalAlign }) => (
            <g key={actor._id}>
              <g transform={`translate(${point.x}, ${point.y})`}>
                <NodeShape shape={shape} color={color} />
              </g>
              <foreignObject
                x={
                  align === "left"
                    ? labelPoint.x
                    : align === "right"
                      ? labelPoint.x - LABEL_WIDTH
                      : labelPoint.x - LABEL_WIDTH / 2
                }
                y={
                  verticalAlign === "top"
                    ? labelPoint.y - LABEL_HEIGHT
                    : verticalAlign === "bottom"
                      ? labelPoint.y
                      : labelPoint.y - LABEL_HEIGHT / 2
                }
                width={LABEL_WIDTH}
                height={LABEL_HEIGHT}
              >
                {/* foreignObject content box-flows from its own top by
                    default — a short (1-line) label at a "top" node left a
                    visible gap down to the node, since the text sat at the
                    top of the box instead of hugging the node at the
                    bottom. Flex + justify-content anchors it to whichever
                    edge is actually next to the node. */}
                <div
                  className="flex h-full flex-col text-[9px] leading-tight text-foreground"
                  style={{
                    textAlign: align,
                    justifyContent:
                      verticalAlign === "top"
                        ? "flex-end"
                        : verticalAlign === "bottom"
                          ? "flex-start"
                          : "center",
                  }}
                >
                  {actor.name}
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>

        {/* A floating pill below the graph, not a full-width row attached
            to the block's own bottom edge — matches the Figma reference,
            where the legend reads as its own small element under the
            diagram rather than a continuation of the section. */}
        {legend.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 rounded-full border px-6 py-3 text-sm">
            {legend.map((type) => (
              <span key={type.slug} className="flex items-center gap-2">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                {type.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Figma shows two horizontal rules inside this column — one right
          under the title, one above the content — with the title pinned to
          the top of its own bordered box rather than the whole column just
          centering title+content together. The title box stretches to the
          column's full height (default CSS Grid stretch, matching the
          graph column's height) only at `lg`; below that there's no
          side-by-side sibling to stretch to, so it naturally hugs its own
          content instead — intentional, forcing the same tall empty gap
          on a narrow mobile screen would look broken, not matched to the
          reference. */}
      <div
        style={backgroundColor ? { backgroundColor } : undefined}
        className="flex flex-col"
      >
        <div className="flex flex-col justify-start border-y px-6 py-12 lg:flex-1 lg:px-11">
          <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] lg:text-[56px] lg:leading-18">
            {title}
          </h2>
        </div>
        {content && (
          <p className="whitespace-pre-line px-6 py-12 text-[18px] leading-8 lg:px-11">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}
