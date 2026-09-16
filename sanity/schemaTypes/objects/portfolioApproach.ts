import { defineField, defineType } from "sanity";

/**
 * Portfolio Approach — Block variant (registered into PageData.sections).
 * A headline + body paragraph beside an image; the image sits on the
 * left or right of the text per `imagePosition`.
 * 
 * @example
 * {
 *   _type: "portfolioApproach",
 *   title: "Our Approach",
 *   content: "We are a team of experts who are dedicated to providing the best possible service to our clients.",
 *   image: "https://via.placeholder.com/150",
 * }
 * 
 * @description
 * The Portfolio Approach block is used to display the approach of the portfolio.
 * It is a block that contains a title, a content, an image and a background color.
 * The image is displayed on the left or right of the text per `imagePosition`.
 * The background color is displayed behind the text and the image.
 * The image position is displayed on the left or right of the text per `imagePosition`.
 * The image position is displayed on the left or right of the text per `imagePosition`.
 */

export const portfolioApproach = defineType({
  name: "portfolioApproach",
  title: "Portfolio Approach",
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
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portfolioApproachCards",
      title: "Portfolio Approach Cards",
      type: "array",
      of: [{ type: "portfolioApproachCard" }],
    }),
  ],
  preview: {
    select: { title: "title", media: "cards.0.image" },
    prepare({ title, media }) {
      return { title: title ?? "Portfolio Approach", subtitle: "Portfolio Approach", media: media ?? undefined };
    },
  },
});
