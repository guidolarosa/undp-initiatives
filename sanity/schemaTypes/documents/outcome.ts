import { defineField, defineType } from "sanity";

type OutcomeParent = { content?: "text" | "video" };

/**
 * Outcome — a result under an Intervention, shown as a "pill" or "circle"
 * marker. `content` switches between two mutually exclusive display modes:
 *   - "video": only `videoUrl` is used.
 *   - "text": `numericValue` + `text` are shown together.
 * `videoUrl`/`numericValue`/`text` are hidden and only required for the mode
 * that's currently active, so editors only see the fields that matter.
 */
export const outcome = defineType({
  name: "outcome",
  title: "Outcome",
  type: "document",
  fields: [
    defineField({
      name: "intents",
      title: "Intents",
      type: "array",
      of: [{ type: "reference", to: [{ type: "intent" }] }],
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["pill", "circle"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: { list: ["small", "large"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      description:
        '"Video" shows only the video URL below. "Text" shows the number and rich text together.',
      type: "string",
      options: {
        list: [
          { title: "Text (number + rich text)", value: "text" },
          { title: "Video", value: "video" },
        ],
      },
      initialValue: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      hidden: ({ parent }: { parent?: OutcomeParent }) =>
        parent?.content !== "video",
      validation: (rule) =>
        rule.custom((value, context) => {
          const content = (context.parent as OutcomeParent | undefined)
            ?.content;
          if (content === "video" && !value) {
            return "Required when content is Video";
          }
          return true;
        }),
    }),
    defineField({
      name: "numericValue",
      title: "Numeric value",
      type: "number",
      hidden: ({ parent }: { parent?: OutcomeParent }) =>
        parent?.content !== "text",
      validation: (rule) =>
        rule.custom((value, context) => {
          const content = (context.parent as OutcomeParent | undefined)
            ?.content;
          if (content === "text" && value === undefined) {
            return "Required when content is Text";
          }
          return true;
        }),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      of: [{ type: "block" }],
      hidden: ({ parent }: { parent?: OutcomeParent }) =>
        parent?.content !== "text",
      validation: (rule) =>
        rule.custom((value, context) => {
          const content = (context.parent as OutcomeParent | undefined)
            ?.content;
          if (content === "text" && (!value || value.length === 0)) {
            return "Required when content is Text";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { type: "type", numericValue: "numericValue", content: "content" },
    prepare({ type, numericValue, content }) {
      return {
        title: content === "video" ? "Video outcome" : String(numericValue ?? ""),
        subtitle: `${type ?? "outcome"}`,
      };
    },
  },
});
