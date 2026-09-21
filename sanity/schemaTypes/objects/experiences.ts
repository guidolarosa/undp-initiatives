import { defineField, defineType } from "sanity";

/**
 * Experiences — Block variant (registered into PageData.sections).
 * A list of experiences.
 */
export const experiences = defineType({
  name: "experiences",
  title: "Experiences",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
    }),
    defineField({
      name: "experiences",
      title: "Experiences",
      type: "array",
      of: [{ type: "reference", to: [{ type: "experience" }] }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Experiences", subtitle: "Experiences" };
    },
  },
});
