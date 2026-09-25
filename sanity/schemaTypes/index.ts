import { type SchemaTypeDefinition } from "sanity";

import { colorToken } from "./documents/colorToken";
import { global } from "./documents/global";
import { link } from "./documents/link";
import { pageData } from "./documents/pageData";
import { theme } from "./documents/theme";
import { blockPlaceholder } from "./objects/blockPlaceholder";
import { hero } from "./objects/hero";
import { banner } from "./objects/banner";
import { focusAreasList } from "./objects/focusAreasList";
import { focusAreas } from "./documents/focusAreas";
import { lowerLinks } from "./objects/lowerLinks";
import { ctaBanner } from "./objects/ctaBanner";
import { portfolioApproachCard } from "./objects/portfolioApproachCard";
import { portfolioApproach } from "./objects/portfolioApproach";
import { actors } from "./documents/actors";
import { experiences } from "./objects/experiences";
import { experience } from "./objects/experience";
import { newsList } from "./objects/newsList";
import { news } from "./documents/news";
import { newsCategory } from "./documents/newsCategory";
import { stats } from "./objects/stats";
import { statCard } from "./objects/statCard";
import { intervention } from "./documents/intervention";
import { actorType } from "./documents/actorType";
import { outcome } from "./documents/outcome";
import { intent } from "./documents/intent";
import { activity } from "./documents/activity";
import { shift } from "./documents/shift";
import { interventionsList } from "./objects/interventionsList";

export const schemaTypes: SchemaTypeDefinition[] = [
  global,
  theme,
  colorToken,
  link,
  pageData,
  actors,
  actorType,
  intervention,
  outcome,
  intent,
  activity,
  shift,
  // Blocks
  focusAreas,
  lowerLinks,
  blockPlaceholder,
  hero,
  banner,
  ctaBanner,
  focusAreasList,
  portfolioApproach,
  experiences,
  newsList,
  stats,
  interventionsList,
  // Modules
  portfolioApproachCard,
  experience,
  news,
  newsCategory,
  statCard,
];
