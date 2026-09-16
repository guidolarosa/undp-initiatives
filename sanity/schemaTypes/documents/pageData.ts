import { defineField, defineType } from "sanity";

import { isUniqueOtherThanLanguage } from "../../lib/isUniqueOtherThanLanguage";

export const pageData = defineType({
  name: "pageData",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "urlSlug",
      title: "URL slug",
      type: "slug",
      options: { source: "name", isUnique: isUniqueOtherThanLanguage },
      validation: (rule) => rule.required(),
      description:
        "Shared across locales — the same page in another language uses the same slug (e.g. /en/home and /es/home).",
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
      name: "showNavbar",
      title: "Show in navbar",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        { type: "hero" },
        { type: "banner" },
        { type: "blockPlaceholder" },
        { type: "focusAreasList" },
        { type: "lowerLinks" },
        { type: "ctaBanner" },
        { type: "portfolioApproach" },
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "urlSlug.current" },
  },
});
