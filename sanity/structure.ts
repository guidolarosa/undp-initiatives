import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["global"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Global settings")
        .id("global")
        .child(S.document().schemaType("global").documentId("global")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
      ),
    ]);
