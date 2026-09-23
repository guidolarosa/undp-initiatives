import { defineField, defineType } from "sanity";

/**
 * Stats — Block variant (registered into PageData.sections).
 * A headline + body paragraph over a background color, with a row of
 * highlighted StatCards below. Cards are inline objects (like
 * PortfolioApproachCard), not references — they're specific to one block,
 * not a reusable content library like News or FocusArea.
 */
export const stats = defineType({
  name: "stats",
  title: "Stats",
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
      title: "Background color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [{ type: "statCard" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", cardCount: "cards.length" },
    prepare({ title, cardCount }) {
      return {
        title: title ?? "Stats",
        subtitle: `${cardCount ?? 0} card(s)`,
      };
    },
  },
});
