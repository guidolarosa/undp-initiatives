import { defineField, defineType } from "sanity";

/**
 * ShiftsInLogic — Block variant (registered into PageData.sections).
 * A title/paragraph intro, a full-width lead-in line, then a stack of
 * pill-shaped rows each describing one "from X to Y" shift. Rows are inline
 * objects (like StatCard), not references — they belong to this block, they
 * aren't a reusable content library.
 */
export const shiftsInLogic = defineType({
  name: "shiftsInLogic",
  title: "Shifts in Logic",
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
      description: "Paragraph shown beside the title.",
      type: "text",
    }),
    defineField({
      name: "leadIn",
      title: "Lead-in",
      description:
        'The line between the intro and the rows, e.g. "A shift in logic: Portfolios represent a fundamental shift in how development is delivered…".',
      type: "text",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      description: "Full-bleed background behind the whole block.",
      type: "reference",
      to: [{ type: "colorToken" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [{ type: "shiftInLogicRow" }],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", rowCount: "rows.length" },
    prepare({ title, rowCount }) {
      return {
        title: title ?? "Shifts in Logic",
        subtitle: `${rowCount ?? 0} row(s)`,
      };
    },
  },
});
