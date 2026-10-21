import { defineField, defineType } from "sanity";

/**
 * Milestone — a single point on a Chronology's timeline (SignalsOfChange
 * block). Positioned by `date` (relative to the block's shared
 * timelineStartDate and "now"); sized by `importance`.
 */
export const milestone = defineType({
  name: "milestone",
  title: "Milestone",
  type: "object",
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Shown in a tooltip on hover.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "importance",
      title: "Importance",
      type: "string",
      description: "Controls the circle's size on the timeline.",
      options: { list: ["low", "medium", "high"] },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "description", subtitle: "date" },
  },
});
