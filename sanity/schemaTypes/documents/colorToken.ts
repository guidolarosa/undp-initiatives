import { defineField, defineType } from "sanity";

export const colorToken = defineType({
  name: "colorToken",
  title: "Color token",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "UNDP Blue", "Off White"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "color",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "value.hex" },
  },
});
