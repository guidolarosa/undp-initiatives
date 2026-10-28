import { defineField, defineType } from "sanity";

/**
 * Focus Area Result — one "early result" stat on a Focus Area (e.g. "1.240" /
 * "Direct beneficiaries"). `value` is free text, not a number: editors type
 * the display string as-is (locale-formatted thousands separators, "%", "+",
 * etc. included), same approach as StatCard.
 */
export const focusAreaResult = defineType({
  name: "focusAreaResult",
  title: "Result",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      description: 'e.g. "1.240", "17", "7"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      description: 'e.g. "Direct beneficiaries"',
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
  },
});
