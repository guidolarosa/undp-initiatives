import { type SchemaTypeDefinition } from "sanity";

import { colorToken } from "./documents/colorToken";
import { global } from "./documents/global";
import { link } from "./documents/link";
import { pageData } from "./documents/pageData";
import { theme } from "./documents/theme";
import { blockPlaceholder } from "./objects/blockPlaceholder";

export const schemaTypes: SchemaTypeDefinition[] = [
  global,
  theme,
  colorToken,
  link,
  pageData,
  blockPlaceholder,
];
