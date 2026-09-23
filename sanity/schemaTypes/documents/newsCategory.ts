import { defineField, defineType } from "sanity";

/**
 * NewsCategory — the small pill/tag shown on a News card (e.g. "Theme 1" in
 * the design). Its own document, like ColorToken or Link, so the same
 * category can be reused across many News items.
 */
export const newsCategory = defineType({
  name: "newsCategory",
  title: "News category",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
      description: "Pill text shown on News cards. One entry per language.",
    }),
  ],
  preview: {
    select: { label: "label" },
    prepare({ label }) {
      const values = Array.isArray(label) ? label : [];
      const first =
        values.find((l: { language?: string }) => l?.language === "en") ??
        values[0];
      return { title: first?.value ?? "News category" };
    },
  },
});
