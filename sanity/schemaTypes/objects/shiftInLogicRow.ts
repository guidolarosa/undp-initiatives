import { defineField, defineType } from "sanity";

/**
 * ShiftInLogicRow — used inside the `shiftsInLogic` block. One pill-shaped
 * row: a "From X to Y" label, a diagram illustrating the shift, and a short
 * example, all on the row's own background color.
 */
export const shiftInLogicRow = defineType({
  name: "shiftInLogicRow",
  title: "Shift in logic row",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: 'e.g. "From fragmentation to Coherence".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Illustration",
      description: "The diagram shown between the label and the description.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
    }),
    defineField({
      name: "color",
      title: "Color",
      description: "This row's background color.",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "content", media: "image" },
  },
});
