import { colorInput } from "@sanity/color-input";
import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { visionTool } from "@sanity/vision";

import { languages } from "./lib/i18n";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "FAROL — UNDP Initiatives",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    // One document per locale for pages; the plugin adds a `language` field and
    // a "Translations" menu that links the versions via a translation.metadata doc.
    documentInternationalization({
      supportedLanguages: [...languages],
      schemaTypes: ["pageData", "intervention"],
    }),
    // Field-level translation for short shared strings (site name, link labels)
    // where a whole separate document per locale would be overkill.
    internationalizedArray({
      languages: [...languages],
      defaultLanguages: ["en"],
      fieldTypes: ["string"],
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    colorInput(),
  ],
  schema: { types: schemaTypes },
});
