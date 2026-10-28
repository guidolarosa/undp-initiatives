"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { gsap } from "gsap";

import { InitiativesGraph } from "@/components/common/InitiativesGraph";
import type { ExplorerInitiative } from "@/components/common/InitiativesExplorerTypes";
import { PortableText } from "@/components/common/PortableText";

export interface FocusAreaBreakdownInitiative {
  _id: string;
  name: string;
  status: "funded" | "looking-for-partners";
}

export interface FocusAreaBreakdownResult {
  _key: string;
  value: string;
  label: string;
}

export interface FocusAreaBreakdownArea {
  _id: string;
  name: string;
  color?: string;
  initiatives: FocusAreaBreakdownInitiative[];
  earlyResults: FocusAreaBreakdownResult[];
  gap?: PortableTextBlock[];
  potentialPartnership?: PortableTextBlock[];
}

/** UI chrome strings — see lib/dictionaries/*.json: focusAreasBreakdown. */
export interface FocusAreasBreakdownDict {
  focusAreasLabel: string;
  interventionsLabel: string;
  /** Contains the literal placeholder "{focusArea}", replaced with the selected area's name. */
  initiativesForLabel: string;
  fundedLabel: string;
  lookingForPartnersLabel: string;
  earlyResultsLabel: string;
  gapLabel: string;
  potentialPartnershipLabel: string;
  emptyInitiatives: string;
}

export interface FocusAreasBreakdownProps {
  title: string;
  description?: string;
  breakdown?: string;
  graphTitle: string;
  focusAreas: FocusAreaBreakdownArea[];
  dict: FocusAreasBreakdownDict;
}

const PANEL_FADE_OUT = 0.2;
const PANEL_FADE_IN = 0.25;
const PANEL_COLOR_DURATION = 0.4;

function StatusBadge({
  status,
  dict,
}: {
  status: FocusAreaBreakdownInitiative["status"];
  dict: FocusAreasBreakdownDict;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]">
      <span aria-hidden="true">{status === "funded" ? "●" : "◐"}</span>
      {status === "funded" ? dict.fundedLabel : dict.lookingForPartnersLabel}
    </span>
  );
}

function InitiativeMiniCard({
  initiative,
  dict,
}: {
  initiative: FocusAreaBreakdownInitiative;
  dict: FocusAreasBreakdownDict;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-background/70 p-4">
      <div className="border-b border-black/10 pb-2">
        <StatusBadge status={initiative.status} dict={dict} />
      </div>
      <span className="text-sm font-medium">{initiative.name}</span>
    </div>
  );
}

function ResultCard({ result }: { result: FocusAreaBreakdownResult }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-black/10 p-4">
      <span className="text-3xl font-bold leading-tight">{result.value}</span>
      <span className="text-sm">{result.label}</span>
    </div>
  );
}

export function FocusAreasBreakdown({
  title,
  description,
  breakdown,
  graphTitle,
  focusAreas,
  dict,
}: FocusAreasBreakdownProps) {
  const firstId = focusAreas[0]?._id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(firstId);
  const [displayedId, setDisplayedId] = useState<string | null>(firstId);

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const selected =
    focusAreas.find((area) => area._id === selectedId) ?? focusAreas[0];
  const displayed =
    focusAreas.find((area) => area._id === displayedId) ?? focusAreas[0];

  // Flattened for the graph's dot positioning — each Intervention only needs
  // to carry its owning Focus Area back as `primaryFocusArea`, which the
  // graph groups dots by. No hover/click behavior is wired to these dots
  // here (onSelect/selectedId are omitted below), only the arcs are
  // interactive in this block.
  const flatInitiatives = useMemo<ExplorerInitiative[]>(
    () =>
      focusAreas.flatMap((area) =>
        area.initiatives.map((initiative) => ({
          _id: initiative._id,
          name: initiative.name,
          primaryFocusArea: {
            _id: area._id,
            name: area.name,
            color: area.color,
          },
          focusAreas: [],
          secondaryActors: [],
          activities: [],
        })),
      ),
    [focusAreas],
  );

  const graphFocusAreas = useMemo(
    () =>
      focusAreas.map((area) => ({
        _id: area._id,
        name: area.name,
        color: area.color,
      })),
    [focusAreas],
  );

  // The panel's background color and its content's opacity are both owned
  // by GSAP, not React — once mounted, re-renders never touch either
  // directly, so this tween is never fought by a competing style update
  // (see InitiativesGraph's zoom effect for the same pattern).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;

    if (!panel.style.backgroundColor) {
      panel.style.backgroundColor = displayed?.color ?? "";
    }
    // Mount-only: sets the panel's starting color once. Every later color
    // change is owned by the transition effect below, not this one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (selectedId === displayedId) return;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) {
      setDisplayedId(selectedId);
      return;
    }

    timelineRef.current?.kill();
    const timeline = gsap.timeline();
    timeline.to(content, {
      opacity: 0,
      duration: PANEL_FADE_OUT,
      ease: "power1.in",
    });
    timeline.call(() => setDisplayedId(selectedId));
    timeline.to(
      panel,
      {
        backgroundColor: selected?.color,
        duration: PANEL_COLOR_DURATION,
        ease: "power1.inOut",
      },
      "<",
    );
    timeline.to(content, {
      opacity: 1,
      duration: PANEL_FADE_IN,
      ease: "power1.out",
    });
    timelineRef.current = timeline;

    return () => {
      timelineRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  if (!displayed) return null;

  const initiativesForTitle = dict.initiativesForLabel.replace(
    "{focusArea}",
    displayed.name,
  );

  return (
    <section className="mx-auto border-t">
      <div className="py-14">
        <div className="mx-auto max-w-280 grid gap-12 md:grid-cols-2">
          <h2 className="text-[40px] font-semibold leading-11 tracking-[-0.02em]">
            {title}
          </h2>
          {description && (
            <p className="self-end text-foreground/80">{description}</p>
          )}
        </div>
      </div>
      {breakdown && (
        <div className="border-y py-8">
          <div className="mx-auto max-w-280">
            <p className="text-foreground/80">{breakdown}</p>
          </div>
        </div>
      )}
      <div className="grid items-start gap-10 py-14 md:grid-cols-2 max-w-280 mx-auto">
        <div>
          <h3 className="mb-8 text-2xl font-semibold leading-tight tracking-[-0.01em] max-w-100">
            {graphTitle}
          </h3>
          <InitiativesGraph
            focusAreas={graphFocusAreas}
            initiatives={flatInitiatives}
            selectedFocusAreaId={selectedId}
            onSelectFocusArea={setSelectedId}
            focusAreasLabel={dict.focusAreasLabel}
            interventionsLabel={dict.interventionsLabel}
          />
        </div>

        <div ref={panelRef} className="rounded-3xl p-8">
          <div ref={contentRef} className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="border-b border-black/10 pb-3 text-lg font-semibold">
                {initiativesForTitle}
              </h3>
              {displayed.initiatives.length === 0 ? (
                <p className="text-sm">{dict.emptyInitiatives}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {displayed.initiatives.map((initiative) => (
                    <InitiativeMiniCard
                      key={initiative._id}
                      initiative={initiative}
                      dict={dict}
                    />
                  ))}
                </div>
              )}
            </div>

            {displayed.earlyResults.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="border-b border-black/10 pb-3 text-lg font-semibold">
                  {dict.earlyResultsLabel}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {displayed.earlyResults.map((result) => (
                    <ResultCard key={result._key} result={result} />
                  ))}
                </div>
              </div>
            )}

            {displayed.gap && displayed.gap.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="border-b border-black/10 pb-3 text-lg font-semibold">
                  {dict.gapLabel}
                </h3>
                <PortableText value={displayed.gap} />
              </div>
            )}

            {displayed.potentialPartnership &&
              displayed.potentialPartnership.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="border-b border-black/10 pb-3 text-lg font-semibold">
                    {dict.potentialPartnershipLabel}
                  </h3>
                  <PortableText value={displayed.potentialPartnership} />
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
