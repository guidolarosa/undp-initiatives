import { defineField, defineType } from "sanity";

/**
 * Outcomes Section — Block variant (registered into PageData.sections).
 * A title (with its own divider) over a description beside a row of
 * highlighted stat cards — same `statCard` object as the Stats block
 * (free-text value/label/color), not filtering/dropdown UI.
 *
 * Redesigned 2026-10-28, confirmed explicitly: cards are now curated
 * directly on this block (e.g. "11" / "Interventions"), not derived from
 * Outcome documents — the new cards are portfolio-wide tallies with no
 * natural single Focus Area to color them by, unlike the old per-Outcome
 * model. The Outcome document type is unchanged and still exists for
 * `Intervention.outcomes`, just no longer read by this block.
 */
export const outcomesSection = defineType({
  name: "outcomesSection",
  title: "Outcomes Section",
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
      title: "Description",
      type: "text",
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
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Outcomes Section", subtitle: "Outcomes Section" };
    },
  },
});
