"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { ActivityEntry } from "@/components/common/InitiativesExplorerActivity";
import { PortableText } from "@/components/common/PortableText";
import { ActorTag, FocusAreaTag } from "@/components/common/InitiativesExplorerTags";
import type { ExplorerActor, ExplorerInitiative } from "@/components/common/InitiativesExplorerTypes";

const ACTIVITIES_PAGE_SIZE = 2;

export function InitiativeDetail({
  initiative,
  aboutTitle,
  activitiesTitle,
  backLabel,
  readMoreLabel,
  onBack,
}: {
  initiative: ExplorerInitiative;
  aboutTitle: string;
  activitiesTitle: string;
  backLabel: string;
  readMoreLabel: string;
  onBack: () => void;
}) {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const actors = [initiative.primaryActor, ...initiative.secondaryActors].filter(
    (actor): actor is ExplorerActor => Boolean(actor),
  );
  const visibleActivities = showAllActivities
    ? initiative.activities
    : initiative.activities.slice(0, ACTIVITIES_PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-2 text-sm text-foreground/80 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </button>

      <h2 className="text-[40px] font-semibold leading-11 tracking-[-0.02em]">
        {initiative.name}
      </h2>

      {actors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actors.map((actor, i) => (
            <ActorTag key={i} actor={actor} />
          ))}
        </div>
      )}

      {initiative.focusAreas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {initiative.focusAreas.map((focusArea) => (
            <FocusAreaTag key={focusArea._id} focusArea={focusArea} />
          ))}
        </div>
      )}

      {initiative.mainPhoto && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={initiative.mainPhoto.src}
            alt={initiative.mainPhoto.alt}
            fill
            placeholder={initiative.mainPhoto.blurDataURL ? "blur" : undefined}
            blurDataURL={initiative.mainPhoto.blurDataURL}
            className="object-cover"
          />
        </div>
      )}

      {initiative.about && initiative.about.length > 0 && (
        <div>
          <h3 className="border-b pb-2 text-lg font-semibold">{aboutTitle}</h3>
          <PortableText value={initiative.about} />
        </div>
      )}

      {initiative.activities.length > 0 && (
        <div>
          <h3 className="border-b pb-2 text-lg font-semibold">{activitiesTitle}</h3>
          <ul className="mt-4 rounded-2xl border">
            {visibleActivities.map((activity) => (
              <ActivityEntry
                key={activity._id}
                activity={activity}
                readMoreLabel={readMoreLabel}
              />
            ))}
          </ul>
          {!showAllActivities && initiative.activities.length > ACTIVITIES_PAGE_SIZE && (
            <button
              type="button"
              onClick={() => setShowAllActivities(true)}
              className="mt-4 rounded-full bg-theme-green px-6 py-2.5 text-sm font-medium text-white"
            >
              {readMoreLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
