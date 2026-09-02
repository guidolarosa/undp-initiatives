import { defineField, defineType } from "sanity";

/**
 * Banner — Block variant (registered into PageData.sections).
 * A headline + body paragraph with a background color.
 */
export const banner = defineType({
  name: "banner",
  title: "Banner",
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
      name: "backgroundColor",
      title: "Background Color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Banner", subtitle: "Banner" };
    },
  },
});
