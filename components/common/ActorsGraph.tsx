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
const LABEL_GAP = 16;
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
        x={-NODE_SIZE / 2}
        y={-NODE_SIZE / 2}
        width={NODE_SIZE}
        height={NODE_SIZE}
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
      <div className="flex items-center justify-center border-b px-6 py-12 lg:border-b-0 lg:border-r">
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
          <circle cx={CENTER} cy={CENTER} r={HUB_INNER_RADIUS} className="fill-foreground" />
          {/* A plain diamond glyph, not the site's own /logo.svg — that
              asset bakes in its own dark circular backdrop and a raster
              pattern, not a clean shape to recolor/reuse standalone here. */}
          <rect
            x={CENTER - HUB_INNER_RADIUS * 0.3}
            y={CENTER - HUB_INNER_RADIUS * 0.3}
            width={HUB_INNER_RADIUS * 0.6}
            height={HUB_INNER_RADIUS * 0.6}
            className="fill-background"
            transform={`rotate(45 ${CENTER} ${CENTER})`}
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
                <div
                  className="text-[9px] leading-tight text-foreground"
                  style={{ textAlign: align }}
                >
                  {actor.name}
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>

      <div
        style={backgroundColor ? { backgroundColor } : undefined}
        className="flex flex-col justify-center gap-6 px-6 py-12 lg:px-11"
      >
        <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] lg:text-[56px] lg:leading-18">
          {title}
        </h2>
        {content && (
          <p className="whitespace-pre-line text-[18px] leading-8">{content}</p>
        )}
      </div>

      {legend.length > 0 && (
        <div className="col-span-full flex flex-wrap items-center justify-center gap-6 border-t px-6 py-4 text-sm">
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
    </section>
  );
}
