import { type SchemaTypeDefinition } from "sanity";

import { pageData } from "./documents/pageData";
import { blockPlaceholder } from "./objects/blockPlaceholder";

export const schemaTypes: SchemaTypeDefinition[] = [pageData, blockPlaceholder];
