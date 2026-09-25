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
      description:
        'What kind of actor this is — e.g. Implementer, Cofounder, Government, Civil society, International org. Managed as its own list of Actor type documents so new types can be added without a schema change.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'actorType' }] }],
    }),
    defineField({
      name: 'showInFooter',
      title: 'Show in footer',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});