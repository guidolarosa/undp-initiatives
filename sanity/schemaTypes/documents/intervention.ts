import { defineField, defineType } from "sanity";

import { isUniqueOtherThanLanguage } from "../../lib/isUniqueOtherThanLanguage";

/**
 * Intervention — one of the central content types. Document-internationalized
 * like PageData: one document per locale, linked via the Translations menu.
 * `Connection` (linking two Interventions) is deferred; no field for it yet.
 */
export const intervention = defineType({
  name: "intervention",
  title: "Intervention",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", isUnique: isUniqueOtherThanLanguage },
      validation: (rule) => rule.required(),
      description: "Shared across locales, like a Page's URL slug.",
    }),
    defineField({
      // Managed by @sanity/document-internationalization. Read-only here; set
      // when a document is created or a translation is added.
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["started", "not-started"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "focusAreas",
      title: "Focus areas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "focusAreas" }] }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "primaryFocusArea",
      title: "Primary focus area",
      description:
        "Which focus area badges this intervention where only one can be shown (e.g. card lists). Independent of the full Focus areas list above.",
      type: "reference",
      to: [{ type: "focusAreas" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryActor",
      title: "Primary actor",
      type: "reference",
      to: [{ type: "actors" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryActors",
      title: "Secondary actors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "actors" }] }],
    }),
    defineField({
      name: "localization",
      title: "Localization",
      type: "geopoint",
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "outcome" }] }],
    }),
    defineField({
      name: "activities",
      title: "Activities",
      type: "array",
      of: [{ type: "reference", to: [{ type: "activity" }] }],
    }),
    defineField({
      name: "mainPhoto",
      title: "Main photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "status" },
  },
});
