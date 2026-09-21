import { defineField, defineType } from "sanity";

export const actors = defineType({
  name: 'actors',
  title: 'Actors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Implementer', value: 'implementer' },
          { title: 'Cofounder', value: 'cofounder' },
        ],
      },
    }),
    defineField({
      name: 'showInFooter',
      title: 'Show in footer',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});