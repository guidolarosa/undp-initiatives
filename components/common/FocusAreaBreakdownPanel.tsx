import type { RefObject } from "react";
import type { PortableTextBlock } from "@portabletext/react";

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

export interface FocusAreaBreakdownPanelProps {
  area: FocusAreaBreakdownArea;
  dict: FocusAreasBreakdownDict;
  /** DOM owner for the panel's background-color crossfade — see FocusAreasBreakdown's GSAP effect. */
  panelRef: RefObject<HTMLDivElement | null>;
  /** DOM owner for the content fade-out/in half of that same crossfade. */
  contentRef: RefObject<HTMLDivElement | null>;
}

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
    <div className="flex flex-col gap-2 rounded-2xl bg-white min-h-24">
      <div className="border-b border-black p-2">
        <StatusBadge status={initiative.status} dict={dict} />
      </div>
      <span className="text-sm font-medium px-4 py-1">{initiative.name}</span>
    </div>
  );
}

function ResultCard({ result }: { result: FocusAreaBreakdownResult }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-black">
      <div className="border-t border-black mt-3" />
      <div className="px-4 flex flex-col py-2">
        <span className="text-3xl font-bold leading-tight">{result.value}</span>
        <span className="text-sm">{result.label}</span>
      </div>
    </div>
  );
}

export function FocusAreaBreakdownPanel({
  area,
  dict,
  panelRef,
  contentRef,
}: FocusAreaBreakdownPanelProps) {
  const initiativesForTitle = dict.initiativesForLabel.replace("{focusArea}", area.name);

  return (
    <div ref={panelRef} className="rounded-3xl py-4">
      <div ref={contentRef} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="border-b border-black pb-3 px-4 text-lg font-semibold">
            {initiativesForTitle}
          </h3>
          {area.initiatives.length === 0 ? (
            <p className="text-sm">{dict.emptyInitiatives}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4">
              {area.initiatives.map((initiative) => (
                <InitiativeMiniCard key={initiative._id} initiative={initiative} dict={dict} />
              ))}
            </div>
          )}
        </div>

        {area.earlyResults.length > 0 && (
          <div className="flex flex-col gap-4">
            <h3 className="border-b border-black pb-3 px-4 text-lg font-semibold">
              {dict.earlyResultsLabel}
            </h3>
            <div className="grid grid-cols-3 gap-3 px-4">
              {area.earlyResults.map((result) => (
                <ResultCard key={result._key} result={result} />
              ))}
            </div>
          </div>
        )}

        {area.gap && area.gap.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="border-b border-black pb-3 px-4 text-lg font-semibold">
              {dict.gapLabel}
            </h3>
            <div className="px-4 *:text-sm">
              <PortableText value={area.gap} />
            </div>
          </div>
        )}

        {area.potentialPartnership && area.potentialPartnership.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="border-b border-black pb-3 px-4 text-lg font-semibold">
              {dict.potentialPartnershipLabel}
            </h3>
            <div className="px-4 *:text-sm">
              <PortableText value={area.potentialPartnership} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
