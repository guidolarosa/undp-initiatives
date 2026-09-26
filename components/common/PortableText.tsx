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
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-1 pl-5 text-foreground/80 text-xl">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1 pl-5 text-foreground/80 text-xl">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <PortableTextRenderer value={value} components={components} />;
}
