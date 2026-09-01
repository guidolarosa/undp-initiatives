import { defineField, defineType } from "sanity";

export const global = defineType({
  name: "global",
  title: "Global settings",
  type: "document",
  fields: [
    defineField({
      name: "theme",
      title: "Theme",
      type: "reference",
      to: [{ type: "theme" }],
    }),
    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "pageData" }, { type: "link" }],
        },
      ],
      description:
        "Reference a Page (linked by its slug) or a Link (custom/external URL). Order here controls the order links appear in the navbar.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Global settings" }),
  },
});
