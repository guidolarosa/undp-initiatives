import { defineField, defineType } from "sanity";

/**
 * Focus Areas List — Block variant (registered into PageData.sections).
 * A list of focus areas with a title.
 */
export const lowerLinks = defineType({
  name: "lowerLinks",
  title: "Lower Links",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "reference", to: [{ type: "link" }] }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Lower Links", subtitle: "Lower Links" };
    },
  },
});
