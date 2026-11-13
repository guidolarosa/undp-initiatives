import { defineField, defineType } from "sanity";

/**
 * Actors Graph — Block variant (registered into PageData.sections).
 * A radial graph of curated Actors around a dashed ring (grouped visually
 * by their Actor Type's color/shape) beside a title/content panel.
 */
export const actorsGraph = defineType({
  name: "actorsGraph",
  title: "Actors Graph",
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
      type: "reference",
      to: [{ type: "colorToken" }],
      description: "Background of the title/content side only — not the graph side.",
    }),
    defineField({
      name: "actors",
      title: "Actors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "actors" }] }],
      description:
        "Curated, not auto-pulled — only these Actors are plotted on the graph, in the order given. Each Actor's own Type (and that Type's color) drives the node's color and the legend.",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", actorCount: "actors.length" },
    prepare({ title, actorCount }) {
      return {
        title: title ?? "Actors Graph",
        subtitle: `Actors Graph — ${actorCount ?? 0} actor(s)`,
      };
    },
  },
});
