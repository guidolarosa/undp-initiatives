"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

import { PortableText } from "@/components/common/PortableText";
import { cn } from "@/lib/utils";

gsap.registerPlugin(Flip);

export interface FocusAreaDetailItem {
  _key: string;
  name: string;
  backgroundColor?: string;
  insight?: PortableTextBlock[];
  opportunity?: PortableTextBlock[];
  actions?: PortableTextBlock[];
}

export interface FocusAreasDetailProps {
  title: string;
  content?: string;
  focusAreas: FocusAreaDetailItem[];
  /** Read-more modal's body background — falls back to the app's Off White if unset. */
  modalBackgroundColor?: string;
}

const DEFAULT_MODAL_BODY_COLOR = "#f2ede9";

type CardField = "insight" | "opportunity" | "actions";

const CARD_META: { field: CardField; label: string; index: number; gridArea: string }[] = [
  { field: "insight", label: "Insight", index: 1, gridArea: "lg:col-start-1 lg:row-start-1" },
  { field: "opportunity", label: "Opportunity", index: 2, gridArea: "lg:col-start-2 lg:row-start-1" },
  { field: "actions", label: "Actions", index: 3, gridArea: "lg:col-start-1 lg:row-start-2" },
];

/**
 * Each focus area's own look — kept stable and keyed to its index in the
 * full list, so (e.g.) a diamond always looks like a rotated diamond no
 * matter which position slot it's currently placed in. `labelTilt` is
 * independent of `shapeRotate` — every label reads at roughly the same
 * gentle angle in the reference regardless of the shape underneath it (the
 * diamond's label is nowhere near as rotated as the diamond itself).
 */
const SHAPE_LOOK = [
  { shape: "circle", shapeRotate: 0, labelTilt: -20 },
  { shape: "circle", shapeRotate: 0, labelTilt: -16 },
  { shape: "diamond", shapeRotate: 45, labelTilt: -20 },
  { shape: "circle", shapeRotate: 0, labelTilt: -20 },
  { shape: "square", shapeRotate: 0, labelTilt: 0 },
] as const;

/**
 * The resting grid — "two on top, one large diamond overlapping in the
 * center, two on the bottom" — pixel-matched to the design reference. Used
 * as-is when nothing is selected. Extra focus areas repeat the pattern in a
 * new row stacked below (see `getSlot`).
 */
const SLOTS = [
  { top: 0, left: 0, size: 43, z: 10 },
  { top: 1, left: 57, size: 43, z: 10 },
  { top: 35, left: 34, size: 32, z: 30 },
  { top: 58, left: 0, size: 42, z: 10 },
  { top: 64, left: 61, size: 35, z: 10 },
] as const;

// When one focus area is selected, the rest reflow into these 4 of the 5
// resting slots — always skipping index 1 (top right), which the spotlight
// below takes over.
const REMAINING_ORDER = [0, 2, 3, 4];

// Where the selected shape animates to — takes over the top-right corner,
// enlarged, per the design's dotted arrow toward the card grid.
const SPOTLIGHT = { top: 0, left: 55, size: 45, z: 100 };

function getSlot(index: number) {
  const slot = SLOTS[index % SLOTS.length];
  const row = Math.floor(index / SLOTS.length);
  return { ...slot, top: slot.top + row * 100 };
}

function getRemainingSlot(reflowIndex: number) {
  const slotIndex = REMAINING_ORDER[reflowIndex % REMAINING_ORDER.length];
  const row = Math.floor(reflowIndex / REMAINING_ORDER.length);
  const slot = SLOTS[slotIndex];
  return { ...slot, top: slot.top + row * 100 };
}

function getShapeLook(index: number) {
  return SHAPE_LOOK[index % SHAPE_LOOK.length];
}

function shapeClassName(shape: (typeof SHAPE_LOOK)[number]["shape"]) {
  return shape === "circle" ? "rounded-full" : "rounded-2xl";
}

export function FocusAreasDetail({
  title,
  content,
  focusAreas,
  modalBackgroundColor,
}: FocusAreasDetailProps) {
  // Nothing is selected until the user clicks one — the resting state is the
  // plain, undisturbed grid (matching the design), not a pre-selected item.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [modalField, setModalField] = useState<CardField | null>(null);

  const clusterRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const flipTweenRef = useRef<gsap.core.Timeline | null>(null);

  // Switching focus areas invalidates whatever card the modal was showing,
  // so both are set together wherever selection changes (see `selectFocusArea`).
  // The GSAP Flip state is captured *before* the position/size change (i.e.
  // before setSelectedKey re-renders with new top/left/width/height), then
  // animated from in the layout effect below, once the new layout has
  // actually been committed to the DOM.
  const selectFocusArea = (key: string) => {
    if (clusterRef.current) {
      flipStateRef.current = Flip.getState(
        clusterRef.current.querySelectorAll<HTMLElement>("[data-shape]"),
      );
    }
    setSelectedKey(key);
    setModalField(null);
  };

  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state) return;
    flipStateRef.current = null;
    flipTweenRef.current?.kill();
    flipTweenRef.current = Flip.from(state, {
      duration: 0.6,
      ease: "power2.inOut",
      scale: true,
    });
    return () => {
      flipTweenRef.current?.kill();
    };
  }, [selectedKey]);

  useEffect(() => {
    if (!modalField) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalField(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalField]);

  const selected = selectedKey
    ? focusAreas.find((item) => item._key === selectedKey)
    : undefined;

  let reflowIndex = 0;
  const positioned = focusAreas.map((item, index) => {
    const isSelected = item._key === selected?._key;
    const slot = !selected
      ? getSlot(index)
      : isSelected
        ? SPOTLIGHT
        : getRemainingSlot(reflowIndex++);
    return { item, isSelected, look: getShapeLook(index), slot };
  });

  const clusterRows = Math.ceil(focusAreas.length / SLOTS.length);
  const modalMeta = modalField
    ? CARD_META.find((card) => card.field === modalField)
    : undefined;
  const modalValue = selected && modalField ? selected[modalField] : undefined;

  return (
    <div className="my-12 border-y lg:my-29.75 lg:mb-15">
      <section className="pt-8">
        <div className="border-t py-18">
          <div className="mx-auto max-w-280 grid gap-6 px-6 lg:grid-cols-2 lg:gap-12">
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] lg:text-[56px] lg:leading-18">
              {title}
            </h2>
            {content && (
              <p className="self-end whitespace-pre-line text-[18px] leading-8">
                {content}
              </p>
            )}
          </div>

          <div className="mx-auto mt-8 grid max-w-280 items-start gap-6 px-6 lg:mt-16 lg:grid-cols-2 lg:gap-10">
            {/* Focus area shape cluster */}
            <div
              ref={clusterRef}
              className="relative w-full"
              style={{ paddingBottom: `${clusterRows * 100}%` }}
            >
              {positioned.map(({ item, isSelected, look, slot }) => (
                // Outer wrapper: GSAP Flip owns this element's position/size
                // animation entirely (captured before the click, re-measured
                // after React re-renders with the new slot) — no competing
                // CSS transition here. The inner button's own shape rotation
                // never changes on selection, only which slot the wrapper
                // sits in.
                <div
                  key={item._key}
                  data-shape={item._key}
                  className="absolute"
                  style={{
                    top: `${slot.top}%`,
                    left: `${slot.left}%`,
                    width: `${slot.size}%`,
                    height: `${slot.size}%`,
                    zIndex: slot.z,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => selectFocusArea(item._key)}
                    aria-pressed={isSelected}
                    style={
                      {
                        transform: `rotate(${look.shapeRotate}deg)`,
                        backgroundColor: item.backgroundColor,
                      } as CSSProperties
                    }
                    className={cn(
                      "flex h-full w-full items-center justify-center p-6 text-center transition-shadow duration-300",
                      shapeClassName(look.shape),
                      isSelected
                        ? "cursor-default shadow-lg"
                        : "cursor-pointer hover:brightness-95",
                    )}
                  >
                    <span
                      style={{ transform: `rotate(${look.labelTilt}deg)` }}
                      className="line-clamp-3 inline-block text-sm font-semibold text-foreground"
                    >
                      {item.name}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Insight / Opportunity / Actions cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:grid-rows-2">
              {!selected && (
                <p className="col-span-2 self-start text-sm text-muted-foreground">
                  Select a focus area to see its Insight, Opportunity, and Actions.
                </p>
              )}
              {selected &&
                CARD_META.map(({ field, label, index, gridArea }) => {
                  const value = selected[field];
                  if (!value || value.length === 0) return null;
                  return (
                    <FocusCard
                      key={field}
                      className={gridArea}
                      label={label}
                      index={index}
                      value={value}
                      color={selected.backgroundColor}
                      onReadMore={() => setModalField(field)}
                    />
                  );
                })}
              {selected &&
                !selected.insight?.length &&
                !selected.opportunity?.length &&
                !selected.actions?.length && (
                  <p className="col-span-2 text-sm text-muted-foreground">
                    No details yet for this focus area.
                  </p>
                )}
            </div>
          </div>
        </div>
      </section>

      {modalMeta && modalValue && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white/40 px-6 backdrop-blur-sm"
          onClick={() => setModalField(null)}
        >
          <div
            className="relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={
                selected?.backgroundColor
                  ? { backgroundColor: selected.backgroundColor }
                  : undefined
              }
              className="relative shrink-0 p-8 pb-4"
            >
              <button
                type="button"
                onClick={() => setModalField(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-black/10"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="pb-4 pr-8 text-lg font-semibold">
                {modalMeta.index}. {modalMeta.label}
              </h3>
            </div>
            <div
              style={{ backgroundColor: modalBackgroundColor ?? DEFAULT_MODAL_BODY_COLOR }}
              className="overflow-y-auto p-8 pt-4 *:text-base"
            >
              <PortableText value={modalValue} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FocusCard({
  className,
  label,
  index,
  value,
  color,
  onReadMore,
}: {
  className?: string;
  label: string;
  index: number;
  value: PortableTextBlock[];
  color?: string;
  onReadMore: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      style={color ? { backgroundColor: color } : undefined}
      className={cn(
        "flex flex-col rounded-2xl border border-black/10",
        className,
      )}
    >
      <h3 className="border-b border-black/10 px-6 py-2 text-lg font-semibold">
        {index}. {label}
      </h3>
      <div className="flex flex-1 flex-col px-6 pb-3">
        <div ref={contentRef} className="line-clamp-[8] *:text-sm *:leading-4">
          <PortableText value={value} />
        </div>
        {overflowing && (
          <button
            type="button"
            onClick={onReadMore}
            className="mt-3 mb-3 self-start text-sm font-medium underline underline-offset-2"
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );
}
