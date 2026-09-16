import { CTABanner } from "@/components/common/CTABanner";
import type { CTABannerSection } from "@/lib/sanity/queries";


/**
 * Block wrapper: maps a Sanity `Banner` block onto the common <Banner> component,
 * resolving the image reference to a CDN URL.
 */
export function CTABannerBlock({ block }: { block: CTABannerSection }) {

  return (
    <CTABanner
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
      cta={block.cta}
    />
  );
}
