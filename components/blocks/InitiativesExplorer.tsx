import {
  InitiativesExplorer,
  type ExplorerActivity,
  type ExplorerActor,
  type ExplorerImage,
  type ExplorerInitiative,
} from "@/components/common/InitiativesExplorer";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { urlForImage } from "@/lib/sanity/image";
import type {
  Initiative,
  InitiativeActor,
  InitiativesExplorerSection,
  SanityImage,
} from "@/lib/sanity/queries";

const DETAIL_IMAGE_WIDTH = 1200;
const ACTIVITY_IMAGE_WIDTH = 600;

function resolveImage(
  image: SanityImage | undefined,
  width: number,
  alt: string,
): ExplorerImage | undefined {
  if (!image?.asset) return undefined;
  const aspectRatio = image.dimensions?.aspectRatio ?? 1;
  return {
    src: urlForImage(image).width(width).url(),
    width,
    height: Math.round(width / aspectRatio),
    alt,
    blurDataURL: image.lqip,
  };
}

function resolveActor(actor: InitiativeActor | undefined): ExplorerActor | undefined {
  if (!actor) return undefined;
  return { name: actor.name };
}

function resolveActivity(
  activity: Initiative["activities"][number],
): ExplorerActivity {
  return {
    _id: activity._id,
    name: activity.name,
    date: activity.date,
    url: activity.url,
    excerpt: activity.excerpt,
    category: activity.category,
    image: resolveImage(activity.image, ACTIVITY_IMAGE_WIDTH, activity.name),
  };
}

function resolveInitiative(initiative: Initiative): ExplorerInitiative {
  return {
    _id: initiative._id,
    name: initiative.name,
    mainPhoto: resolveImage(initiative.mainPhoto, DETAIL_IMAGE_WIDTH, initiative.name),
    primaryFocusArea: initiative.primaryFocusArea,
    // GROQ returns null (not []) when dereferencing an array-of-references
    // field that's unset, and all three of these are optional on
    // Intervention — the `?? []` keeps that from reaching .map()/.length
    // downstream as a crash.
    focusAreas: initiative.focusAreas ?? [],
    primaryActor: resolveActor(initiative.primaryActor),
    secondaryActors: (initiative.secondaryActors ?? []).map(
      (actor) => resolveActor(actor) as ExplorerActor,
    ),
    about: initiative.about,
    activities: (initiative.activities ?? []).map(resolveActivity),
  };
}

/**
 * Block wrapper: maps a Sanity `initiativesExplorer` block onto the common
 * <InitiativesExplorer> component, resolving every image reference to a CDN
 * URL and supplying the locale's UI chrome strings.
 */
export function InitiativesExplorerBlock({
  block,
  locale,
}: {
  block: InitiativesExplorerSection;
  locale: Locale;
}) {
  const dict = getDictionary(locale).initiativesExplorer;

  return (
    <InitiativesExplorer
      title={block.title}
      description={block.description}
      graphTagline={block.graphTagline}
      graphBackgroundColor={block.graphBackgroundColor}
      aboutTitle={block.aboutTitle}
      activitiesTitle={block.activitiesTitle}
      focusAreaOptions={block.focusAreaOptions}
      initiatives={block.initiatives.map(resolveInitiative)}
      dict={dict}
    />
  );
}
