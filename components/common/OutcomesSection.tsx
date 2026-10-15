"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCardStagger } from "@/components/common/useCardStagger";

export interface OutcomesSectionFocusArea {
  _id: string;
  name: string;
  color?: string;
}

export interface OutcomeCardData {
  _id: string;
  /** Pre-formatted (locale-aware thousands separators) by the block wrapper. */
  value: string;
  text: string;
  /**
   * The card's color comes from here (`focusArea.color`) — not an
   * independently settable field on Outcome. See lib/sanity/queries.ts:
   * OutcomeCard.focusArea for how it's derived.
   */
  focusArea?: {
    _id: string;
    color?: string;
  };
}

export interface OutcomesSectionProps {
  title: string;
  content?: string;
  focusAreaOptions: OutcomesSectionFocusArea[];
  outcomes: OutcomeCardData[];
  /** UI chrome strings — see lib/dictionaries/*.json: outcomesSection. */
  dict: {
    focusAreasLabel: string;
    allFocusAreas: string;
    emptyFiltered: string;
  };
}

const ALL_FOCUS_AREAS = "all";

function OutcomeStatCard({ outcome }: { outcome: OutcomeCardData }) {
  return (
    <div
      style={
        outcome.focusArea?.color
          ? { backgroundColor: outcome.focusArea.color }
          : undefined
      }
      className="flex flex-col gap-1 rounded-3xl py-4 h-fit min-h-34"
    >
      <span className="text-2xl font-bold leading-tight pt-4 pb-2 border-t px-4">{outcome.value}</span>
      <span className="text-sm px-4">{outcome.text}</span>
    </div>
  );
}

export function OutcomesSection({
  title,
  content,
  focusAreaOptions,
  outcomes,
  dict,
}: OutcomesSectionProps) {
  const [focusAreaFilter, setFocusAreaFilter] = useState<string | undefined>(
    undefined,
  );

  const filtered =
    !focusAreaFilter || focusAreaFilter === ALL_FOCUS_AREAS
      ? outcomes
      : outcomes.filter(
          (outcome) => outcome.focusArea?._id === focusAreaFilter,
        );

  // Same stagger-on-filter-change treatment as InitiativesExplorer's card grid.
  const gridRef = useCardStagger(focusAreaFilter);

  return (
    <section className="mx-auto border-t py-18 mt-16">
      <div className="border-t py-18 border-b">
        <div className="max-w-280 mx-auto grid grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <h2 className="w-fit pb-1 text-[32px] font-semibold tracking-[-0.02em]">
              {title}
            </h2>
            {content && <p className="text-foreground/80">{content}</p>}

            <Select
              value={focusAreaFilter ?? ALL_FOCUS_AREAS}
              onValueChange={(value) => setFocusAreaFilter(value as string)}
            >
              <SelectTrigger className="w-fit rounded-full border border-black bg-transparent px-4 py-2 text-sm">
                <SelectValue>
                  {(value: string) =>
                    value === ALL_FOCUS_AREAS
                      ? dict.allFocusAreas
                      : (focusAreaOptions.find(
                          (focusArea) => focusArea._id === value,
                        )?.name ?? dict.focusAreasLabel)
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FOCUS_AREAS}>
                  {dict.allFocusAreas}
                </SelectItem>
                {focusAreaOptions.map((focusArea) => (
                  <SelectItem key={focusArea._id} value={focusArea._id}>
                    {focusArea.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ul className="flex flex-col gap-3">
              {focusAreaOptions.map((focusArea) => (
                <li
                  key={focusArea._id}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={
                      focusArea.color
                        ? { backgroundColor: focusArea.color }
                        : undefined
                    }
                  />
                  {focusArea.name}
                </li>
              ))}
            </ul>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict.emptyFiltered}
            </p>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {filtered.map((outcome) => (
                <OutcomeStatCard key={outcome._id} outcome={outcome} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
