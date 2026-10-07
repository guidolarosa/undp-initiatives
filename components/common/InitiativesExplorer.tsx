"use client";

import { useState } from "react";
import Image from "next/image";
import type { PortableTextBlock } from "@portabletext/react";
import { ArrowLeft, Link2 } from "lucide-react";

import { PortableText } from "@/components/common/PortableText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface ExplorerImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
}

export interface ExplorerFocusArea {
  _id: string;
  name: string;
  color?: string;
}

export interface ExplorerActor {
  name: string;
}

export interface ExplorerActivity {
  _id: string;
  name: string;
  date: string;
  url?: string;
  excerpt?: string;
  image?: ExplorerImage;
  category?: string;
}

export interface ExplorerInitiative {
  _id: string;
  name: string;
  mainPhoto?: ExplorerImage;
  primaryFocusArea?: ExplorerFocusArea;
  focusAreas: ExplorerFocusArea[];
  primaryActor?: ExplorerActor;
  secondaryActors: ExplorerActor[];
  about?: PortableTextBlock[];
  activities: ExplorerActivity[];
}

export interface InitiativesExplorerProps {
  title: string;
  description?: string;
  graphTagline?: string;
  graphBackgroundColor?: string;
  aboutTitle: string;
  activitiesTitle: string;
  focusAreaOptions: ExplorerFocusArea[];
  initiatives: ExplorerInitiative[];
  /** UI chrome strings — see lib/dictionaries/*.json: initiativesExplorer. */
  dict: {
    typeLabel: string;
    focusAreasLabel: string;
    allFocusAreas: string;
    visualizeBy: string;
    backToList: string;
    emptyFiltered: string;
    readMore: string;
  };
}

const ALL_FOCUS_AREAS = "all";
const ACTIVITIES_PAGE_SIZE = 2;

function FocusAreaTag({ focusArea }: { focusArea: ExplorerFocusArea }) {
  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium"
      style={focusArea.color ? { backgroundColor: focusArea.color } : undefined}
    >
      {focusArea.name}
    </span>
  );
}

function ActorTag({ actor }: { actor: ExplorerActor }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-foreground/60 px-3 py-1 text-sm">
      {actor.name}
    </span>
  );
}

function InitiativeCard({
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

function ActivityEntry({
  activity,
  readMoreLabel,
}: {
  activity: ExplorerActivity;
  readMoreLabel: string;
}) {
  return (
    <li className="border-t px-4 py-4 first:border-t-0">
      <div className="flex items-center justify-between gap-2">
        <time dateTime={activity.date} className="text-sm">
          {new Date(activity.date).toLocaleDateString(undefined, {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })}
        </time>
        {activity.category && (
          <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs">
            {activity.category}
          </span>
        )}
      </div>
      {activity.image && (
        <div className="relative mt-3 aspect-[2/1] w-full overflow-hidden rounded-xl">
          <Image
            src={activity.image.src}
            alt={activity.image.alt}
            fill
            placeholder={activity.image.blurDataURL ? "blur" : undefined}
            blurDataURL={activity.image.blurDataURL}
            className="object-cover"
          />
        </div>
      )}
      <p className="mt-3 text-sm font-medium">{activity.name}</p>
      {activity.url && (
        <a
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm underline underline-offset-2"
        >
          {readMoreLabel}
        </a>
      )}
    </li>
  );
}

function InitiativeDetail({
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

  return (
    <section className="mx-auto -mt-8 h-[calc(100vh-100px)] overflow-hidden">
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
                <SelectValue />
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
        <div className="flex h-full flex-col gap-6 overflow-y-auto pr-[calc(50vw-568px)] pt-8 w-6/12 pl-10 pb-10">
          {selected ? (
            <InitiativeDetail
              initiative={selected}
              aboutTitle={aboutTitle}
              activitiesTitle={activitiesTitle}
              backLabel={dict.backToList}
              readMoreLabel={dict.readMore}
              onBack={() => setSelectedId(null)}
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
                  <SelectValue placeholder={dict.focusAreasLabel} />
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
                <div className="grid gap-4 sm:grid-cols-2">
                  {filtered.map((initiative) => (
                    <InitiativeCard
                      key={initiative._id}
                      initiative={initiative}
                      typeLabel={dict.typeLabel}
                      onSelect={() => setSelectedId(initiative._id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
