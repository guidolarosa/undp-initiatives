"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { X } from "lucide-react";

import { PortableText } from "@/components/common/PortableText";
import { cn } from "@/lib/utils";

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
}

type CardField = "insight" | "opportunity" | "actions";

const CARD_META: { field: CardField; label: string; index: number; gridArea: string }[] = [
  { field: "insight", label: "Insight", index: 1, gridArea: "col-start-1 row-start-1" },
  { field: "opportunity", label: "Opportunity", index: 2, gridArea: "col-start-2 row-start-1" },
  { field: "actions", label: "Actions", index: 3, gridArea: "col-start-1 row-start-2" },
];

/**
 * A fixed "two on top, one large diamond overlapping in the center, two on
 * the bottom" grid — pixel-matched to the design reference, and **never
 * recomputed on selection**: every focus area always sits at the same
 * top/left/size/rotation. Extra focus areas repeat the pattern in a new row
 * stacked below (see `getSlot`).
 *
 * `labelTilt` is independent of `shapeRotate` — every label reads at roughly
 * the same gentle angle in the reference regardless of the shape underneath
 * it (the diamond's label is nowhere near as rotated as the diamond itself).
 */
const SLOTS = [
  { shape: "circle", top: 0, left: 0, size: 43, shapeRotate: 0, labelTilt: -20, z: 10 },
  { shape: "circle", top: 1, left: 57, size: 43, shapeRotate: 0, labelTilt: -16, z: 10 },
  { shape: "diamond", top: 35, left: 34, size: 32, shapeRotate: 45, labelTilt: -20, z: 30 },
  { shape: "circle", top: 58, left: 0, size: 42, shapeRotate: 0, labelTilt: -20, z: 10 },
  { shape: "square", top: 64, left: 61, size: 35, shapeRotate: 0, labelTilt: 0, z: 10 },
] as const;

function getSlot(index: number) {
  const slot = SLOTS[index % SLOTS.length];
  const row = Math.floor(index / SLOTS.length);
  return { ...slot, top: slot.top + row * 100 };
}

function shapeClassName(shape: (typeof SLOTS)[number]["shape"]) {
  return shape === "circle" ? "rounded-full" : "rounded-2xl";
}

export function FocusAreasDetail({ title, content, focusAreas }: FocusAreasDetailProps) {
  // Nothing is selected until the user clicks one — the resting state is the
  // plain, undisturbed grid (matching the design), not a pre-selected item.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [modalField, setModalField] = useState<CardField | null>(null);

  // Switching focus areas invalidates whatever card the modal was showing,
  // so both are set together wherever selection changes (see `selectFocusArea`).
  const selectFocusArea = (key: string) => {
    setSelectedKey(key);
    setModalField(null);
  };

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

  const positioned = focusAreas.map((item, index) => ({
    item,
    isSelected: item._key === selected?._key,
    slot: getSlot(index),
  }));

  const clusterRows = Math.ceil(focusAreas.length / SLOTS.length);
  const modalMeta = modalField
    ? CARD_META.find((card) => card.field === modalField)
    : undefined;
  const modalValue = selected && modalField ? selected[modalField] : undefined;

  return (
    <div className="my-29.75 border-y mb-30">
      <section className="pt-8">
        <div className="border-t py-18">
          <div className="mx-auto max-w-280 grid gap-12 md:grid-cols-2">
            <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
              {title}
            </h2>
            {content && (
              <p className="self-end whitespace-pre-line text-[18px] leading-8">
                {content}
              </p>
            )}
          </div>

          <div className="mx-auto mt-16 grid max-w-280 items-start gap-10 md:grid-cols-2">
            {/* Focus area shape cluster */}
            <div
              className="relative w-full"
              style={{ paddingBottom: `${clusterRows * 100}%` }}
            >
              {positioned.map(({ item, isSelected, slot }) => (
                // Outer wrapper: the shape's position never changes on
                // selection — only this wrapper's own transform (a plain
                // screen-space translate + scale) animates, so a selected
                // shape pops toward the top right without ever moving,
                // resizing, or reflowing any other shape.
                <div
                  key={item._key}
                  className="absolute transition-transform duration-500 ease-out"
                  style={{
                    top: `${slot.top}%`,
                    left: `${slot.left}%`,
                    width: `${slot.size}%`,
                    height: `${slot.size}%`,
                    transform: isSelected
                      ? "translate(12%, -12%) scale(1.15)"
                      : undefined,
                    zIndex: isSelected ? 100 : slot.z,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => selectFocusArea(item._key)}
                    aria-pressed={isSelected}
                    style={
                      {
                        transform: `rotate(${slot.shapeRotate}deg)`,
                        backgroundColor: item.backgroundColor,
                      } as CSSProperties
                    }
                    className={cn(
                      "flex h-full w-full items-center justify-center p-6 text-center transition-shadow duration-300",
                      shapeClassName(slot.shape),
                      isSelected
                        ? "cursor-default shadow-lg ring-4 ring-white/80"
                        : "cursor-pointer hover:brightness-95",
                    )}
                  >
                    <span
                      style={{ transform: `rotate(${slot.labelTilt}deg)` }}
                      className="line-clamp-3 inline-block text-sm font-semibold text-foreground"
                    >
                      {item.name}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Insight / Opportunity / Actions cards */}
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 px-6 backdrop-blur-sm"
          onClick={() => setModalField(null)}
        >
          <div
            style={
              selected?.backgroundColor
                ? { backgroundColor: selected.backgroundColor }
                : undefined
            }
            className="relative max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-2xl p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalField(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-black/10"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="border-b border-black/10 pb-4 pr-8 text-lg font-semibold">
              {modalMeta.index}. {modalMeta.label}
            </h3>
            <div className="mt-4 *:text-base">
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
      <div className="flex flex-1 flex-col px-6 pb-0">
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
