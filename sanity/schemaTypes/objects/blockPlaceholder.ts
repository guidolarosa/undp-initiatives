import { defineField, defineType } from "sanity";

/**
 * Stand-in block type until the real Block Schemas (Hero, Banner, etc. —
 * see docs/sanity-entities.md) are built, so PageData.sections has
 * something to hold and the page-builder plumbing can be tested end to end.
 */
export const blockPlaceholder = defineType({
  name: "blockPlaceholder",
  title: "Placeholder section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
