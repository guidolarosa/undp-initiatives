import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["global"]);
// Managed automatically by @sanity/document-internationalization — no need to
// show it as an editable list.
const HIDDEN_TYPES = new Set(["translation.metadata"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Global settings")
        .id("global")
        .child(S.document().schemaType("global").documentId("global")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId() ?? "";
        return !SINGLETON_TYPES.has(id) && !HIDDEN_TYPES.has(id);
      }),
    ]);
