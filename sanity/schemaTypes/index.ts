import { type SchemaTypeDefinition } from "sanity";

import { global } from "./documents/global";
import { link } from "./documents/link";
import { pageData } from "./documents/pageData";
import { blockPlaceholder } from "./objects/blockPlaceholder";

export const schemaTypes: SchemaTypeDefinition[] = [
  global,
  link,
  pageData,
  blockPlaceholder,
];
