import { defineField, defineType } from "sanity";

/**
 * Hero — Block variant (registered into PageData.sections).
 * A headline + body paragraph beside an image; the image sits on the
 * left or right of the text per `imagePosition`.
 */
export const hero = defineType({
  name: "hero",
  title: "Hero",
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
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagePosition",
      title: "Image position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "right",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
    prepare({ title, media }) {
      return { title: title ?? "Hero", subtitle: "Hero", media };
    },
  },
});
