import { defineField, defineType } from "sanity";

/**
 * Banner — Block variant (registered into PageData.sections).
 * A headline + body paragraph with a background color.
 */
export const ctaBanner = defineType({
  name: "ctaBanner",
  title: "CTA Banner",
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
      name: "cta",
      title: "CTA",
      type: "reference",
      to: [{ type: "link" }],
      validation: (rule) => rule.required(),
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
      return { title: title ?? "CTA Banner", subtitle: "CTA Banner" };
    },
  },
});
