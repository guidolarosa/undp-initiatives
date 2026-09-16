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

export const schemaTypes: SchemaTypeDefinition[] = [
  global,
  theme,
  colorToken,
  link,
  pageData,
  focusAreas,
  lowerLinks,
  blockPlaceholder,
  hero,
  banner,
  ctaBanner,
  focusAreasList,
];
