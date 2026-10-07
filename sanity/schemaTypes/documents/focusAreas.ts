import { TargetIcon } from "@sanity/icons/Target";
import { defineField, defineType } from "sanity";

export const focusAreas = defineType({
  name: "focusAreas",
  title: "Focus Areas",
  type: "document",
  icon: TargetIcon,
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
    defineField({
      name: "insight",
      title: "Insight",
      type: "array",
      of: [{ type: "block" }],
      description: "Used by the Focus Areas Detail block. Optional — only needed for focus areas placed in that block.",
    }),
    defineField({
      name: "opportunity",
      title: "Opportunity",
      type: "array",
      of: [{ type: "block" }],
      description: "Used by the Focus Areas Detail block. Optional — only needed for focus areas placed in that block.",
    }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [{ type: "block" }],
      description: "Used by the Focus Areas Detail block. Optional — only needed for focus areas placed in that block.",
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
