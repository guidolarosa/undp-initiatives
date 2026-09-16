import { defineField, defineType } from "sanity";

export const focusAreas = defineType({
  name: "focusAreas",
  title: "Focus Areas",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "Climate Change", "Peace and Security"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: 'e.g. "Climate Change is a global issue that affects all countries and all people. It is a threat to human security and sustainable development."',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
