import { defineField, defineType } from "sanity";

export const pageData = defineType({
  name: "pageData",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "urlSlug",
      title: "URL slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showNavbar",
      title: "Show in navbar",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "hero" }, { type: "banner" }, { type: "blockPlaceholder" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "urlSlug.current" },
  },
});
