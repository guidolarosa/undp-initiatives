import { defineField, defineType } from "sanity";

/**
 * Focus Areas List — Block variant (registered into PageData.sections).
 * A list of focus areas with a title.
 */
export const focusAreasList = defineType({
  name: "focusAreasList",
  title: "Focus Areas List",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "focusAreas",
      title: "Focus areas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "focusAreas" }] }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Focus Areas", subtitle: "Focus Areas" };
    },
  },
});
