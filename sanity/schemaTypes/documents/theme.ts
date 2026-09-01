import { defineField, defineType } from "sanity";

export const theme = defineType({
  name: "theme",
  title: "Theme",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        'Not in the original spec — added so themes are identifiable in Studio lists, e.g. "Default", "High contrast".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "frontColor",
      title: "Front (text) color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonColor",
      title: "Button color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryButtonColor",
      title: "Secondary button color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navbarColor",
      title: "Navbar color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
