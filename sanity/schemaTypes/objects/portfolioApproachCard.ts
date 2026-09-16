import { defineField, defineType } from "sanity";

/**
 * Portfolio Approach Card — Block variant (registered into PageData.sections).
 * A headline + body paragraph beside an image; the image sits on the
 * left or right of the text per `imagePosition`.
*/

export const portfolioApproachCard = defineType({
  name: "portfolioApproachCard",
  title: "Portfolio ApproachCard",
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
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
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
    select: { title: "title", media: "image" },
    prepare({ title, media }) {
      return { title: title ?? "Portfolio Approach Card", subtitle: "Portfolio Approach Card", media };
    },
  },
});
