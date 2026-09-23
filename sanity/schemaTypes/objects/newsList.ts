import { defineField, defineType } from "sanity";

/**
 * NewsList — Block variant (registered into PageData.sections).
 * A titled grid of News items (referenced, so the same News document can
 * appear in more than one list) plus a "Read more" CTA button. Rendered in
 * order of each News item's `date`, most recent first — not array order.
 */
export const newsList = defineType({
  name: "newsList",
  title: "News List",
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
      name: "news",
      title: "News",
      type: "array",
      of: [{ type: "reference", to: [{ type: "news" }] }],
      validation: (rule) => rule.required().min(1),
      description:
        "Displayed by publish date (newest first), regardless of the order you add them here.",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      description: 'The "Read more" button below the grid.',
      type: "reference",
      to: [{ type: "link" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", newsCount: "news.length" },
    prepare({ title, newsCount }) {
      return {
        title: title ?? "News List",
        subtitle: `${newsCount ?? 0} news item(s)`,
      };
    },
  },
});
