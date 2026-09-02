import { Banner } from "@/components/common/Banner";
import type { BannerSection } from "@/lib/sanity/queries";


/**
 * Block wrapper: maps a Sanity `Banner` block onto the common <Banner> component,
 * resolving the image reference to a CDN URL.
 */
export function BannerBlock({ block }: { block: BannerSection }) {

  return (
    <Banner
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
    />
  );
}
