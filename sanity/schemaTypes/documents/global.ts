import { WrenchIcon } from "@sanity/icons/Wrench";
import { defineField, defineType } from "sanity";

export const global = defineType({
  name: "global",
  title: "Global settings",
  type: "document",
  icon: WrenchIcon,
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
      description:
        "The name of the site as it appears in the browser tab and navigation. One entry per language.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "internationalizedArrayString",
      description:
        'Shown below the site name in the navbar (e.g. "Policy Intelligence"). One entry per language — leave a language empty to show nothing for it.',
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "reference",
      to: [{ type: "theme" }],
    }),
    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "pageData" }, { type: "link" }],
        },
      ],
      description:
        "Reference a Page (linked by its slug) or a Link (custom/external URL). Order here controls the order links appear in the navbar.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Global settings" }),
  },
});
