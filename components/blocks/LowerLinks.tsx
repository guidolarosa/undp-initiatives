import { LowerLinks } from "@/components/common/LowerLinks";
import type { LowerLinksSection } from "@/lib/sanity/queries";


/**
 * Block wrapper: maps a Sanity `Banner` block onto the common <Banner> component,
 * resolving the image reference to a CDN URL.
 */
export function LowerLinksBlock({ block }: { block: LowerLinksSection }) {
  return (
    <LowerLinks
      title={block.title}
      content={block.content}
      links={block.links}
    />
  );
}
