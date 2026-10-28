import { defineField, defineType } from "sanity";

/**
 * Focus Areas Breakdown — Block variant (registered into PageData.sections).
 * A title/description/breakdown header over a two-column layout: the same
 * radial graph used by Initiatives Explorer on the left (here, clicking a
 * Focus Area's arc selects it, rather than clicking an initiative dot), and
 * a details panel on the right showing the selected Focus Area's
 * initiatives, early results, gap, and potential partnership text.
 *
 * Focus Areas are **not curated on this block** — every Focus Area is
 * plotted, each carrying its own Early results/Gap/Potential partnership
 * fields (see sanity/schemaTypes/documents/focusAreas.ts) and its own
 * Interventions (matched by `primaryFocusArea`), same philosophy as
 * Initiatives Explorer/Outcomes Section/Territory.
 */
export const focusAreasBreakdown = defineType({
  name: "focusAreasBreakdown",
  title: "Focus Areas Breakdown",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "breakdown",
      title: "Breakdown",
      description: 'Second paragraph, below the divider, e.g. "Explore each focus area to see..."',
      type: "text",
    }),
    defineField({
      name: "graphTitle",
      title: "Graph title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Focus Areas Breakdown", subtitle: "Focus Areas Breakdown" };
    },
  },
});
