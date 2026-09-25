import { defineField, defineType } from "sanity";

/**
 * Activity — a concrete activity under an Intervention (or a Shift). Plain,
 * single-language document — translated by authoring a separate Activity per
 * locale, referenced from that locale's own Intervention/Shift, the same way
 * Intervention content is translated.
 */
export const activity = defineType({
  name: "activity",
  title: "Activity",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "date", media: "image" },
  },
});
