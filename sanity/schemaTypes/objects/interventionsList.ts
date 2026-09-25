import { defineField, defineType } from "sanity";

/**
 * InterventionsList — Block variant (registered into PageData.sections).
 * The first block fed by Intervention data. A curated (not auto-filtered)
 * list of Interventions on the left, a title/content panel on a background
 * color on the right. Nothing in the block links anywhere yet.
 */
export const interventionsList = defineType({
  name: "interventionsList",
  title: "Interventions List",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: 'Small label above the list, e.g. "New interventions".',
      type: "string",
    }),
    defineField({
      name: "interventions",
      title: "Interventions",
      type: "array",
      of: [{ type: "reference", to: [{ type: "intervention" }] }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "title",
      title: "Title",
      description: "Heading in the colored panel.",
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
      description: "Applies to the panel only, not the full block width.",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", count: "interventions.length" },
    prepare({ title, count }) {
      return {
        title: title ?? "Interventions List",
        subtitle: `${count ?? 0} intervention(s)`,
      };
    },
  },
});
