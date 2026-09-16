import {
  PortableText as PortableTextRenderer,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

/**
 * Shared renderer for Sanity `array of block` (Portable Text) fields, styled to
 * match the plain-text paragraphs used elsewhere in the blocks.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 whitespace-pre-line text-foreground/80 text-xl">
        {children}
      </p>
    ),
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <PortableTextRenderer value={value} components={components} />;
}
