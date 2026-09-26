import { defineField, defineType } from "sanity";

/**
 * Territory — Block variant (registered into PageData.sections).
 * A title/content panel beside a map of São Tomé and Príncipe.
 *
 * The map points are **not** curated here: every Intervention in the current
 * locale that has a `localization` geopoint is plotted automatically, so
 * adding a located intervention is all it takes to put it on the map. Each
 * point takes its colour from that intervention's primary focus area.
 */
export const territory = defineType({
  name: "territory",
  title: "Territory",
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
      type: "text",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      description: "Applies to the title/content panel, not the map side.",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Territory", subtitle: "Territory map" };
    },
  },
});
