import type { PortableTextBlock } from "@portabletext/react";

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

export interface ExplorerOutcome {
  _id: string;
  content: "text" | "video";
  numericValue?: number;
  /** Rich text (Sanity `array of block`) — only set when content is "text". */
  text?: PortableTextBlock[];
  videoUrl?: string;
}

export interface ExplorerLocalization {
  lat: number;
  lng: number;
}

export interface ExplorerInitiative {
  _id: string;
  name: string;
  status?: "funded" | "looking-for-partners";
  mainPhoto?: ExplorerImage;
  primaryFocusArea?: ExplorerFocusArea;
  focusAreas: ExplorerFocusArea[];
  primaryActor?: ExplorerActor;
  secondaryActors: ExplorerActor[];
  about?: PortableTextBlock[];
  activities: ExplorerActivity[];
  outcomes: ExplorerOutcome[];
  localization?: ExplorerLocalization;
}

/** UI chrome strings — see lib/dictionaries/*.json: initiativesExplorer. */
export interface InitiativesExplorerDict {
  typeLabel: string;
  focusAreasLabel: string;
  initiativesLabel: string;
  allFocusAreas: string;
  visualizeBy: string;
  backToList: string;
  emptyFiltered: string;
  readMore: string;
  implementedLabel: string;
  newInterventionLabel: string;
}
