"use client";

import Image from "next/image";

import { ActorTag, FocusAreaTag } from "@/components/common/InitiativesExplorerTags";
import type { ExplorerInitiative } from "@/components/common/InitiativesExplorerTypes";

export function InitiativeCard({
  initiative,
  typeLabel,
  onSelect,
}: {
  initiative: ExplorerInitiative;
  typeLabel: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col overflow-hidden rounded-2xl border text-left transition-colors hover:border-foreground/40"
    >
      <div className="relative aspect-[2/1] w-full bg-muted">
        {initiative.mainPhoto && (
          <Image
            src={initiative.mainPhoto.src}
            alt={initiative.mainPhoto.alt}
            fill
            placeholder={initiative.mainPhoto.blurDataURL ? "blur" : undefined}
            blurDataURL={initiative.mainPhoto.blurDataURL}
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {typeLabel}
        </span>
        <h3 className="text-[18px] font-semibold leading-6">{initiative.name}</h3>
        <div className="mt-1 flex flex-col items-start gap-2">
          {initiative.focusAreas.map((focusArea) => (
            <FocusAreaTag key={focusArea._id} focusArea={focusArea} />
          ))}
          {initiative.primaryActor && <ActorTag actor={initiative.primaryActor} />}
        </div>
      </div>
    </button>
  );
}
