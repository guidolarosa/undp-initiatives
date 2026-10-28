"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import type { ExplorerFocusArea, ExplorerInitiative } from "@/components/common/InitiativesExplorerTypes";
import { cn } from "@/lib/utils";

export interface InitiativesGraphProps {
  focusAreas: ExplorerFocusArea[];
  initiatives: ExplorerInitiative[];
  /** Initiative-dot selection/zoom — omit both to disable dot interaction entirely. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Focus-area-arc selection — omit both to disable arc interaction entirely. */
  selectedFocusAreaId?: string | null;
  onSelectFocusArea?: (id: string) => void;
  focusAreasLabel: string;
  interventionsLabel: string;
}

// --- Geometry: a square viewBox, independent of the container's actual
// (possibly non-square) rendered box — the SVG's default
// preserveAspectRatio="xMidYMid meet" letterboxes/centers it without ever
// distorting a circle into an ellipse, so this never needs to know the
// container's real pixel size. ---
const SIZE = 400;
const CENTER = SIZE / 2;
const ARC_RADIUS = 178;
const ARC_STROKE = 4;
const RING_RADIUS = 118;
const DOT_RADIUS = 6;
const DOT_HIT_RADIUS = 15;
const ARC_GAP_DEG = 9;
const ZOOM_SCALE = 2.1;
const LABEL_GAP = 6;
// A bottom-half label's path is traced in reverse (see labelArcPath) so its
// text reads upright — but that flip also puts the text on the *inner* side
// of the path instead of the outer side, pulling it visually closer to the
// colored arc than a top-half label at the same radius. This extra radius
// compensates so both halves end up with the same visible gap.
const LABEL_GAP_BOTTOM_EXTRA = 14;
// Radii + angular spans for the two curved "Focus Areas" / "Interventions"
// legend labels, centered on due north like the reference image.
const FOCUS_AREAS_LABEL_RADIUS = RING_RADIUS + (ARC_RADIUS - RING_RADIUS) * 0.55;
const FOCUS_AREAS_LABEL_SPAN = 55;
const INTERVENTIONS_LABEL_RADIUS = RING_RADIUS - 16;
const INTERVENTIONS_LABEL_SPAN = 75;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// Math.cos/Math.sin can differ in their last bit or two between the server
// and browser JS engines for the exact same input, which — unrounded — was
// enough to make SSR'd path/position strings mismatch on hydration. Three
// decimal places is far more precision than this is visually rendered at,
// and makes server and client output byte-identical.
function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polar(r: number, angleDeg: number) {
  const rad = toRad(angleDeg);
  return { x: round(CENTER + r * Math.cos(rad)), y: round(CENTER + r * Math.sin(rad)) };
}

/** Angle convention: 0 = east, 90 = south, 180 = west, -90 = north (standard SVG y-down). */
function arcPath(r: number, fromDeg: number, toDeg: number, sweep: 0 | 1 = 1) {
  const start = polar(r, fromDeg);
  const end = polar(r, toDeg);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`;
}

function isBottomHalf(fromDeg: number, toDeg: number) {
  const mid = ((fromDeg + toDeg) / 2) % 360;
  return mid > 0 && mid < 180;
}

/**
 * Same physical arc (same curve, same bulge direction) as `arcPath(r, fromDeg,
 * toDeg)`, but — when its midpoint sits in the bottom half of the circle —
 * traced in the opposite direction, so text-on-path reads upright instead of
 * upside down. Swapping the two endpoints alone would flip to the *other*
 * curve connecting them (mirrored bulge); flipping the sweep flag along with
 * it is what keeps it the same curve, just traced the other way.
 */
function labelArcPath(r: number, fromDeg: number, toDeg: number) {
  return isBottomHalf(fromDeg, toDeg) ? arcPath(r, toDeg, fromDeg, 0) : arcPath(r, fromDeg, toDeg, 1);
}

/** An arc of the given angular width, centered on due north (-90deg). */
function topArcPath(r: number, spanDeg: number) {
  return arcPath(r, -90 - spanDeg / 2, -90 + spanDeg / 2);
}

/** A smooth curved "ribbon" from a point near the dashed ring out to a point on the outer arc. */
function ribbonPath(fromR: number, fromDeg: number, toR: number, toDeg: number) {
  const start = polar(fromR, fromDeg);
  const end = polar(toR, toDeg);
  const c1 = polar(fromR + (toR - fromR) * 0.35, fromDeg);
  const c2 = polar(toR - (toR - fromR) * 0.25, toDeg);
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`;
}

interface PositionedFocusArea extends ExplorerFocusArea {
  startDeg: number;
  endDeg: number;
  midDeg: number;
}

interface PositionedInitiative {
  initiative: ExplorerInitiative;
  angleDeg: number;
  x: number;
  y: number;
}

export function InitiativesGraph({
  focusAreas,
  initiatives,
  selectedId = null,
  onSelect,
  selectedFocusAreaId = null,
  onSelectFocusArea,
  focusAreasLabel,
  interventionsLabel,
}: InitiativesGraphProps) {
  const dotsInteractive = Boolean(onSelect);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const groupRef = useRef<SVGGElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const arcSpan = (360 - ARC_GAP_DEG * focusAreas.length) / Math.max(focusAreas.length, 1);
  const positionedFocusAreas: PositionedFocusArea[] = focusAreas.map((focusArea, index) => {
    const startDeg = -90 + index * (arcSpan + ARC_GAP_DEG);
    const endDeg = startDeg + arcSpan;
    return { ...focusArea, startDeg, endDeg, midDeg: (startDeg + endDeg) / 2 };
  });
  const focusAreaById = new Map(positionedFocusAreas.map((fa) => [fa._id, fa]));

  const positioned: PositionedInitiative[] = [];
  for (const focusArea of positionedFocusAreas) {
    const group = initiatives.filter((item) => item.primaryFocusArea?._id === focusArea._id);
    group.forEach((initiative, i) => {
      const t = (i + 0.5) / group.length;
      const angleDeg = focusArea.startDeg + t * (focusArea.endDeg - focusArea.startDeg);
      const { x, y } = polar(RING_RADIUS, angleDeg);
      positioned.push({ initiative, angleDeg, x, y });
    });
  }
  const positionedById = new Map(positioned.map((p) => [p.initiative._id, p]));

  const activeId = hoveredId ?? selectedId;
  const activePoint = activeId ? positionedById.get(activeId) : undefined;

  useLayoutEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    const selectedPoint = selectedId ? positionedById.get(selectedId) : undefined;

    tweenRef.current?.kill();
    tweenRef.current = selectedPoint
      ? gsap.to(el, {
          x: CENTER - ZOOM_SCALE * selectedPoint.x,
          y: CENTER - ZOOM_SCALE * selectedPoint.y,
          scale: ZOOM_SCALE,
          transformOrigin: "0px 0px",
          duration: 0.7,
          ease: "power2.inOut",
        })
      : gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: "0px 0px",
          duration: 0.7,
          ease: "power2.inOut",
        });

    return () => {
      tweenRef.current?.kill();
    };
    // positionedById is rebuilt every render from props — keying on selectedId
    // (plus the data it's derived from) is what actually matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, focusAreas, initiatives]);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full overflow-visible">
      <g ref={groupRef}>
        {/* Dashed inner ring + its two legend labels */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 5"
          className="text-foreground/70"
        />
        <path
          id="focus-areas-legend-arc"
          d={topArcPath(FOCUS_AREAS_LABEL_RADIUS, FOCUS_AREAS_LABEL_SPAN)}
          fill="none"
          className="invisible"
        />
        <text className="fill-muted-foreground text-[10px]">
          <textPath href="#focus-areas-legend-arc" startOffset="50%" textAnchor="middle">
            {focusAreasLabel}
          </textPath>
        </text>
        <path
          id="interventions-legend-arc"
          d={topArcPath(INTERVENTIONS_LABEL_RADIUS, INTERVENTIONS_LABEL_SPAN)}
          fill="none"
          className="invisible"
        />
        <text className="fill-muted-foreground text-[10px]">
          <textPath href="#interventions-legend-arc" startOffset="50%" textAnchor="middle">
            {interventionsLabel}
          </textPath>
        </text>

        {/* Outer Focus Area arcs + curved labels */}
        {positionedFocusAreas.map((focusArea, index) => {
          const isSelectedArea = focusArea._id === selectedFocusAreaId;
          const labelGap =
            LABEL_GAP +
            (isBottomHalf(focusArea.startDeg, focusArea.endDeg) ? LABEL_GAP_BOTTOM_EXTRA : 0);
          return (
            <g key={focusArea._id}>
              <path
                d={arcPath(ARC_RADIUS, focusArea.startDeg, focusArea.endDeg)}
                fill="none"
                stroke={focusArea.color}
                strokeWidth={isSelectedArea ? ARC_STROKE + 3 : ARC_STROKE}
                strokeLinecap="butt"
                onClick={onSelectFocusArea ? () => onSelectFocusArea(focusArea._id) : undefined}
                className={cn(
                  "transition-[stroke-width] duration-200",
                  onSelectFocusArea && "cursor-pointer",
                )}
              />
              <path
                id={`focus-area-label-${index}`}
                d={labelArcPath(ARC_RADIUS + ARC_STROKE + labelGap, focusArea.startDeg, focusArea.endDeg)}
                fill="none"
                className="invisible"
              />
              <text
                onClick={onSelectFocusArea ? () => onSelectFocusArea(focusArea._id) : undefined}
                className={cn(
                  "fill-foreground text-[10px] font-medium",
                  onSelectFocusArea && "cursor-pointer",
                )}
              >
                <textPath href={`#focus-area-label-${index}`} startOffset="50%" textAnchor="middle">
                  {focusArea.name}
                </textPath>
              </text>
            </g>
          );
        })}

        {/* Secondary-focus ribbons for whichever dot is active (hovered or selected) */}
        {activePoint &&
          activePoint.initiative.focusAreas
            .filter((fa) => fa._id !== activePoint.initiative.primaryFocusArea?._id)
            .map((secondary) => {
              const target = focusAreaById.get(secondary._id);
              if (!target) return null;
              const gradientId = `ribbon-${activePoint.initiative._id}-${secondary._id}`;
              return (
                <g key={secondary._id}>
                  <defs>
                    <linearGradient
                      id={gradientId}
                      gradientUnits="userSpaceOnUse"
                      x1={activePoint.x}
                      y1={activePoint.y}
                      x2={polar(ARC_RADIUS, target.midDeg).x}
                      y2={polar(ARC_RADIUS, target.midDeg).y}
                    >
                      <stop offset="0%" stopColor={activePoint.initiative.primaryFocusArea?.color} />
                      <stop offset="100%" stopColor={target.color} />
                    </linearGradient>
                  </defs>
                  <path
                    d={ribbonPath(RING_RADIUS, activePoint.angleDeg, ARC_RADIUS, target.midDeg)}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={5}
                    strokeLinecap="round"
                    opacity={0.75}
                  />
                </g>
              );
            })}

        {/* Primary-focus connector, same treatment, only while active */}
        {activePoint && activePoint.initiative.primaryFocusArea && (
          <path
            d={ribbonPath(
              RING_RADIUS,
              activePoint.angleDeg,
              ARC_RADIUS,
              activePoint.angleDeg,
            )}
            fill="none"
            stroke={activePoint.initiative.primaryFocusArea.color}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.75}
          />
        )}

        {/* Initiative dots */}
        {positioned.map(({ initiative, x, y }) => {
          const isActive = activeId === initiative._id;
          const isSelected = selectedId === initiative._id;
          return (
            <g
              key={initiative._id}
              className={cn(dotsInteractive && "cursor-pointer")}
              onMouseEnter={dotsInteractive ? () => setHoveredId(initiative._id) : undefined}
              onMouseLeave={
                dotsInteractive
                  ? () => setHoveredId((current) => (current === initiative._id ? null : current))
                  : undefined
              }
              onClick={dotsInteractive ? () => onSelect?.(initiative._id) : undefined}
            >
              <circle cx={x} cy={y} r={DOT_HIT_RADIUS} fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={DOT_RADIUS}
                fill={initiative.primaryFocusArea?.color}
                stroke={isSelected ? "white" : "none"}
                strokeWidth={isSelected ? 2 : 0}
                className="transition-[r] duration-150"
                style={{ r: isActive ? DOT_RADIUS + 2 : DOT_RADIUS }}
              />
              {isActive && (
                <g style={{ transform: `translate(${x}px, ${y - DOT_RADIUS - 10}px)` }}>
                  <rect
                    x={-Math.max(36, initiative.name.length * 3.3)}
                    y={-22}
                    width={Math.max(72, initiative.name.length * 6.6)}
                    height={22}
                    rx={11}
                    className="fill-foreground"
                  />
                  <text
                    textAnchor="middle"
                    y={-7}
                    className="fill-background text-[11px] font-medium"
                  >
                    {initiative.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
