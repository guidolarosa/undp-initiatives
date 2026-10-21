import { defineField, defineType } from "sanity";

/**
 * Chronology — one "From X to Y" timeline row in the SignalsOfChange block.
 * Not a reusable document (like ShiftInLogicRow/PortfolioApproachCard) —
 * these rows belong to their block.
 */
export const chronology = defineType({
  name: "chronology",
  title: "Chronology",
  type: "object",
  fields: [
    defineField({
      name: "fromText",
      title: "From",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "toText",
      title: "To",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      of: [{ type: "milestone" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { fromText: "fromText", toText: "toText" },
    prepare({ fromText, toText }) {
      return { title: `${fromText ?? "?"} → ${toText ?? "?"}` };
    },
  },
});
