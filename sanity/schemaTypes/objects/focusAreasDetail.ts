import { defineField, defineType } from "sanity";

/**
 * Focus Areas Detail — Block variant (registered into PageData.sections).
 * A cluster of clickable focus area shapes beside an Insight/Opportunity/
 * Actions card grid that shows the selected focus area's content.
 */
export const focusAreasDetail = defineType({
  name: "focusAreasDetail",
  title: "Focus Areas Detail",
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
      description: "Body paragraph beside the title.",
    }),
    defineField({
      name: "focusAreas",
      title: "Focus areas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "focusAreas" }] }],
      description:
        "Each referenced Focus Area should have its Insight/Opportunity/Actions fields filled in for this block to show content when selected.",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Focus Areas Detail", subtitle: "Focus Areas Detail" };
    },
  },
});
