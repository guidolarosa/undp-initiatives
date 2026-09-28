import { MarqueeBanner } from "@/components/common/MarqueeBanner";
import type { Locale } from "@/lib/i18n";
import { urlForImage } from "@/lib/sanity/image";
import type { MarqueeBannerSection } from "@/lib/sanity/queries";

const IMAGE_WIDTH = 1200;

/**
 * Resolves the editor-authored `marqueeLinkUrl` into an actual href:
 * - A full URL ("http://..."/"https://...") is treated as external, opened
 *   in a new tab, and left untouched.
 * - Anything else is treated as an internal path (e.g. "/initiatives") and
 *   prefixed with the current locale (e.g. "/en/initiatives") — matching
 *   how internal links are localized elsewhere (see NavLinks.tsx).
 */
function resolveMarqueeLink(url: string | undefined, locale: Locale) {
  if (!url) return undefined;
  const isExternal = /^https?:\/\//.test(url);
  return {
    href: isExternal ? url : `/${locale}${url}`,
    external: isExternal,
  };
}

/**
 * Block wrapper: maps a Sanity `marqueeBanner` block onto the common
 * <MarqueeBanner> component, resolving the image reference to a CDN URL and
 * the marquee link to a locale-aware href.
 */
export function MarqueeBannerBlock({
  block,
  locale,
}: {
  block: MarqueeBannerSection;
  locale: Locale;
}) {
  const { image } = block;
  const aspectRatio = image?.dimensions?.aspectRatio ?? 1;
  const marqueeLink = resolveMarqueeLink(block.marqueeLinkUrl, locale);

  return (
    <MarqueeBanner
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
      marqueeText={block.marqueeText}
      marqueeHref={marqueeLink?.href}
      marqueeExternal={marqueeLink?.external}
      image={
        image?.asset
          ? {
              src: urlForImage(image).width(IMAGE_WIDTH).url(),
              width: IMAGE_WIDTH,
              height: Math.round(IMAGE_WIDTH / aspectRatio),
              alt: block.title,
              blurDataURL: image.lqip,
            }
          : undefined
      }
    />
  );
}
