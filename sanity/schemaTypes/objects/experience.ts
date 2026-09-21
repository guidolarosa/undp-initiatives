import { defineField, defineType } from "sanity";

/**
 * Experience — Block variant (registered into PageData.sections).
 * A experience with an author and a role.
 */
export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "text",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "text",
    })
  ],
  preview: {
    select: { author: "author", role: "role" },
    prepare({ author, role }) {
      return { title: author ?? "Author", subtitle: role ?? "Role" };
    },
  },
});
