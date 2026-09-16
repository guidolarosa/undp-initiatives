import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
      description: "Link text shown in the navbar. One entry per language.",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "string",
      description:
        "For internal links, enter a path starting with / (e.g. /initiatives) — the current locale is added automatically. For external links, enter the full URL.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["external", "internal"] },
      initialValue: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color",
      description: "Color of the link. Used for lower links or other colored backgrounds.",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { label: "label", subtitle: "url" },
    prepare({ label, subtitle }) {
      const first = Array.isArray(label)
        ? (label.find((l) => l?._key === "en") ?? label[0])?.value
        : undefined;
      return { title: first ?? "Link", subtitle };
    },
  },
});
