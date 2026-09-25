import { defineField, defineType } from "sanity";

/**
 * Shift — a time-bounded set of Activities. Not referenced from Intervention
 * directly; the two are joined only through shared Activity references.
 */
export const shift = defineType({
  name: "shift",
  title: "Shift",
  type: "document",
  fields: [
    defineField({
      name: "activities",
      title: "Activities",
      type: "array",
      of: [{ type: "reference", to: [{ type: "activity" }] }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "from",
      title: "From",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "to",
      title: "To",
      type: "date",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { from: "from", to: "to" },
    prepare({ from, to }) {
      return { title: `${from ?? "?"} → ${to ?? "?"}` };
    },
  },
});
