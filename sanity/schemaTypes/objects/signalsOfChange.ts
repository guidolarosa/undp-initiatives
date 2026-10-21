import { defineField, defineType } from "sanity";

/**
 * Signals of Change — Block variant (registered into PageData.sections).
 * A title/content panel beside a stack of Chronology timelines — each one
 * a "From X to Y" row with Milestone dots positioned between the block's
 * shared `timelineStartDate` and "now".
 */
export const signalsOfChange = defineType({
  name: "signalsOfChange",
  title: "Signals of Change",
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
      description: "Body paragraph beside the title.",
      type: "text",
    }),
    defineField({
      name: "circleText",
      title: "Circle legend text",
      description: 'e.g. "Each circle is a signal" — shown at the bottom of the timeline panel.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "circleSizeText",
      title: "Circle size legend text",
      description:
        'e.g. "The size of the circles depends on the relevance of the signal." — shown next to the circle legend text.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      description: "Full-bleed background behind the title/content panel.",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "milestoneColor",
      title: "Milestone circle color",
      description: "Shared by every milestone circle across every Chronology.",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timelineStartDate",
      title: "Timeline start date",
      description:
        "Every Chronology's timeline starts here and ends at \"now\" — confirmed as a single shared date, not per-Chronology.",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "chronologies",
      title: "Chronologies",
      type: "array",
      of: [{ type: "chronology" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Signals of Change", subtitle: "Signals of Change" };
    },
  },
});
