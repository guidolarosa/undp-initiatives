import { defineField, defineType } from "sanity";

/**
 * Intent — a short reusable tag attached to an Outcome (e.g. "Youth
 * Employment"). Its own document so the same tag can be reused across many
 * Outcomes/Interventions.
 */
export const intent = defineType({
  name: "intent",
  title: "Intent",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
      description: "One entry per language.",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { label: "label" },
    prepare({ label }) {
      const values = Array.isArray(label) ? label : [];
      const first =
        values.find((l: { language?: string }) => l?.language === "en") ??
        values[0];
      return { title: first?.value ?? "Intent" };
    },
  },
});
