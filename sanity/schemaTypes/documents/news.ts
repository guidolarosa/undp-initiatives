import { defineField, defineType } from "sanity";

/**
 * News — an individual news/communication item. A top-level document (like
 * `experience` or `focusAreas`) so the same item can be curated once, reused
 * across `newsList` blocks, and managed from its own list in Studio.
 */
export const news = defineType({
  name: "news",
  title: "News",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Published date",
      type: "date",
      description: "Controls display order in a News List — most recent first.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "newsCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Read more URL",
      type: "string",
      description:
        'Where "Read more" links to. For an internal page, enter a path starting with / (the current locale is added automatically). For an external article, enter the full URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      type: "reference",
      to: [{ type: "colorToken" }],
      description: "Optional — leave unset for the default (white) card background.",
    }),
  ],
  orderings: [
    {
      title: "Published date, new to old",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "date", media: "image" },
    prepare({ title, date, media }) {
      return { title, subtitle: date, media };
    },
  },
});
