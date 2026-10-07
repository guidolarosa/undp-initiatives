"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

import { InitiativeCard } from "@/components/common/InitiativesExplorerCard";
import { InitiativeDetail } from "@/components/common/InitiativesExplorerDetail";
import type {
  ExplorerFocusArea,
  ExplorerInitiative,
  InitiativesExplorerDict,
} from "@/components/common/InitiativesExplorerTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCardStagger } from "@/components/common/useCardStagger";
import { useListDetailTransition } from "@/components/common/useListDetailTransition";
import { cn } from "@/lib/utils";

export type {
  ExplorerActivity,
  ExplorerActor,
  ExplorerFocusArea,
  ExplorerImage,
  ExplorerInitiative,
} from "@/components/common/InitiativesExplorerTypes";

export interface InitiativesExplorerProps {
  title: string;
  description?: string;
  graphTagline?: string;
  graphBackgroundColor?: string;
  aboutTitle: string;
  activitiesTitle: string;
  focusAreaOptions: ExplorerFocusArea[];
  initiatives: ExplorerInitiative[];
  dict: InitiativesExplorerDict;
}

const ALL_FOCUS_AREAS = "all";

export function InitiativesExplorer({
  title,
  description,
  graphTagline,
  graphBackgroundColor,
  aboutTitle,
  activitiesTitle,
  focusAreaOptions,
  initiatives,
  dict,
}: InitiativesExplorerProps) {
  const [focusAreaFilter, setFocusAreaFilter] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered =
    !focusAreaFilter || focusAreaFilter === ALL_FOCUS_AREAS
      ? initiatives
      : initiatives.filter((initiative) =>
          initiative.focusAreas.some((focusArea) => focusArea._id === focusAreaFilter),
        );

  const selected = selectedId
    ? initiatives.find((initiative) => initiative._id === selectedId)
    : undefined;

  const viewKey = selected ? selected._id : "list";
  const { scrollRef, contentRef, transition } = useListDetailTransition(viewKey);
  const selectInitiative = (id: string) => transition("forward", () => setSelectedId(id));
  const backToList = () => transition("backward", () => setSelectedId(null));

  // Cards stagger in on their own whenever the filter changes — keyed on
  // the filter only, so this doesn't also fire when returning from the
  // detail view (that's the list/detail transition's job, above).
  const cardsGridRef = useCardStagger(focusAreaFilter);

  return (
    <section className="mx-auto -mt-8 h-[calc(100vh-108px)] overflow-hidden">
      <div className="flex items-start h-full">
        {/* Graph — placeholder for now. Static: never scrolls, always fits
            exactly within the block's height (no aspect-ratio forcing it
            taller than the space left after the dropdown/tagline). */}
        <div
          style={graphBackgroundColor ? { backgroundColor: graphBackgroundColor } : undefined}
          className="flex h-full w-6/12 flex-col overflow-hidden border-r"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
            <Select defaultValue="interventions">
              <SelectTrigger className="w-fit rounded-full border border-black bg-transparent px-4 py-2 text-sm">
                {/* Base UI's SelectValue only resolves a label via an `items`
                    prop on Select (not by reading rendered SelectItem
                    children) — without it, it falls back to the raw value
                    string. The function-children form sidesteps that. */}
                <SelectValue>{() => dict.visualizeBy}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interventions">{dict.visualizeBy}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex w-full flex-1 items-center justify-center text-sm text-muted-foreground">
              Graph
            </div>
          </div>
          {graphTagline && (
            <div className="flex items-center gap-2 border-t px-6 py-3 text-sm text-muted-foreground">
              <Link2 className="size-4 shrink-0" />
              {graphTagline}
            </div>
          )}
        </div>

        {/* Title / description / filter / list or detail */}
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto pr-[calc(50vw-568px)] pt-8 w-6/12 pl-10 pb-10"
        >
          <div ref={contentRef} className="flex flex-col gap-6">
            {selected ? (
              <InitiativeDetail
                initiative={selected}
                aboutTitle={aboutTitle}
                activitiesTitle={activitiesTitle}
                backLabel={dict.backToList}
                readMoreLabel={dict.readMore}
                onBack={backToList}
              />
            ) : (
              <>
                <h2 className="text-[40px] font-semibold leading-11 tracking-[-0.02em]">
                  {title}
                </h2>
                {description && <p className="text-foreground/80">{description}</p>}

                <Select
                  value={focusAreaFilter ?? ALL_FOCUS_AREAS}
                  onValueChange={(value) => {
                    setFocusAreaFilter(value as string);
                    setSelectedId(null);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-fit rounded-full border border-black bg-transparent px-4 py-2 text-sm",
                    )}
                  >
                    {/* See the graph's "Visualize by" dropdown above for why
                        this needs a function, not a bare <SelectValue />. */}
                    <SelectValue>
                      {(value: string) =>
                        value === ALL_FOCUS_AREAS
                          ? dict.allFocusAreas
                          : (focusAreaOptions.find((focusArea) => focusArea._id === value)
                              ?.name ?? dict.focusAreasLabel)
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FOCUS_AREAS}>{dict.allFocusAreas}</SelectItem>
                    {focusAreaOptions.map((focusArea) => (
                      <SelectItem key={focusArea._id} value={focusArea._id}>
                        {focusArea.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{dict.emptyFiltered}</p>
                ) : (
                  <div ref={cardsGridRef} className="grid gap-4 sm:grid-cols-2">
                    {filtered.map((initiative) => (
                      <InitiativeCard
                        key={initiative._id}
                        initiative={initiative}
                        typeLabel={dict.typeLabel}
                        onSelect={() => selectInitiative(initiative._id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
