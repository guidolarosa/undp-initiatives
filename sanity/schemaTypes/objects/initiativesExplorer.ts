import { defineField, defineType } from "sanity";

/**
 * Initiatives Explorer — Block variant (registered into PageData.sections).
 * A graph placeholder + tagline beside a title/description, a Focus Area
 * filter, and a list of Intervention cards; clicking a card swaps the right
 * side to that Intervention's detail view.
 *
 * Interventions are **not curated on this block** — every Intervention in
 * the current locale is read directly, same philosophy as Territory's map
 * points — so adding one is all it takes for it to show up here.
 */
export const initiativesExplorer = defineType({
  name: "initiativesExplorer",
  title: "Initiatives Explorer",
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
      name: "graphTagline",
      title: "Graph tagline",
      type: "string",
      description: "Caption shown below the graph, on the left.",
    }),
    defineField({
      name: "graphBackgroundColor",
      title: "Graph background color",
      type: "reference",
      to: [{ type: "colorToken" }],
      description: "Background of the graph panel only — not the full block.",
    }),
    defineField({
      name: "aboutTitle",
      title: '"About the initiative" heading',
      type: "string",
      description:
        "Shared across every Intervention shown in this block's detail view. Translated per-locale, like any other block field — not per-Intervention.",
      initialValue: "About the initiative",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "activitiesTitle",
      title: '"Latest activities" heading',
      type: "string",
      description:
        "Shared across every Intervention shown in this block's detail view. Translated per-locale, like any other block field — not per-Intervention.",
      initialValue: "Latest activities",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Initiatives Explorer", subtitle: "Initiatives Explorer" };
    },
  },
});
