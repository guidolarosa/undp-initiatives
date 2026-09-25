import { defineField, defineType } from "sanity";

/**
 * ActorType — what kind of institution an Actor is (government, civil society,
 * international org, but also UNDP-relationship values like implementer/
 * cofounder — kept open-ended on purpose, not a locked enum, so new types can
 * be added without a schema change).
 */
export const actorType = defineType({
  name: "actorType",
  title: "Actor type",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
      description: "One entry per language.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Stable identifier, independent of the translated label — code (e.g. the footer's implementer/cofounder split) checks this, not the label text.",
      options: {
        source: (doc) => {
          const label = doc.label as
            | { language?: string; value?: string }[]
            | undefined;
          const first =
            label?.find((l) => l?.language === "en") ?? label?.[0];
          return first?.value ?? "";
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { label: "label", subtitle: "slug.current" },
    prepare({ label, subtitle }) {
      const values = Array.isArray(label) ? label : [];
      const first =
        values.find((l: { language?: string }) => l?.language === "en") ??
        values[0];
      return { title: first?.value ?? "Actor type", subtitle };
    },
  },
});
