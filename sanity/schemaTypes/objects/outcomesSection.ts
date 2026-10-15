import { defineField, defineType } from "sanity";

/**
 * Outcomes Section — Block variant (registered into PageData.sections).
 * A title/legend/filter panel beside a grid of Outcome cards (each showing
 * its numericValue + text, colored by the Outcome's own `color` field).
 *
 * Outcomes are **not curated on this block** — every text-content Outcome
 * referenced by at least one Intervention in the current locale is read
 * directly, same philosophy as Territory/InitiativesExplorer.
 *
 * An Outcome has no direct Focus Area field. For the "Focus Areas" filter,
 * an Outcome's focus area(s) are derived: every Intervention that lists
 * this Outcome in its `outcomes` array contributes its own
 * `primaryFocusArea` — confirmed explicitly, not assumed.
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
      title: "Content",
      type: "text",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Outcomes Section", subtitle: "Outcomes Section" };
    },
  },
});
