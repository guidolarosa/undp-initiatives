import { defineField, defineType } from "sanity";

/**
 * StatCard — used inside the `stats` block. A single highlighted stat (e.g.
 * "1 in 5", "68%") with a short caption, each with its own background color.
 */
export const statCard = defineType({
  name: "statCard",
  title: "Stat card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: 'The highlighted stat, e.g. "1 in 5", "68%", "Up to 45%".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "content" },
  },
});
