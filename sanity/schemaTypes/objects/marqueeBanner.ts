import { defineField, defineType } from "sanity";

/**
 * Marquee Banner — Block variant (registered into PageData.sections).
 * A title/content panel beside a decorative, non-interactive preview of the
 * Initiatives graph (links to /initiatives as a whole), with a full-width
 * marquee strip (looping left-to-right) along the bottom, optionally linking
 * somewhere.
 */
export const marqueeBanner = defineType({
  name: "marqueeBanner",
  title: "Marquee Banner",
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
      title: "Image (unused)",
      type: "image",
      options: { hotspot: true },
      description:
        "No longer shown — the frontend now renders a decorative Initiatives graph preview in this spot instead, linking to the Initiatives page.",
    }),
    defineField({
      name: "marqueeText",
      title: "Marquee text",
      type: "string",
      description:
        "Scrolls left-to-right in an infinite loop along the bottom of the block.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "marqueeLinkUrl",
      title: "Marquee link URL",
      type: "string",
      description:
        'Where the marquee links to. An internal path (e.g. "/initiatives") is automatically prefixed with the visitor\'s locale; a full URL (starting with "http") opens as an external link. Leave empty for a non-clickable marquee.',
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
      return { title: title ?? "Marquee Banner", subtitle: "Marquee Banner", media };
    },
  },
});
