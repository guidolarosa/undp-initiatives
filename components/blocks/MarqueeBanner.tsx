import { MarqueeBanner } from "@/components/common/MarqueeBanner";
import type { ExplorerInitiative } from "@/components/common/InitiativesExplorerTypes";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { MarqueeBannerInitiative, MarqueeBannerSection } from "@/lib/sanity/queries";

function resolveGraphInitiative(initiative: MarqueeBannerInitiative): ExplorerInitiative {
  return {
    _id: initiative._id,
    name: initiative.name,
    primaryFocusArea: initiative.primaryFocusArea,
    focusAreas: [],
    secondaryActors: [],
    activities: [],
    outcomes: [],
  };
}

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
 * <MarqueeBanner> component, resolving the marquee link to a locale-aware
 * href and supplying the data for its decorative, non-interactive
 * Initiatives graph preview (which links to /initiatives as a whole).
 */
export function MarqueeBannerBlock({
  block,
  locale,
}: {
  block: MarqueeBannerSection;
  locale: Locale;
}) {
  const marqueeLink = resolveMarqueeLink(block.marqueeLinkUrl, locale);
  const dict = getDictionary(locale).initiativesExplorer;

  return (
    <MarqueeBanner
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
      marqueeText={block.marqueeText}
      marqueeHref={marqueeLink?.href}
      marqueeExternal={marqueeLink?.external}
      locale={locale}
      focusAreaOptions={block.focusAreaOptions}
      initiatives={block.initiatives.map(resolveGraphInitiative)}
      focusAreasLabel={dict.focusAreasLabel}
      initiativesLabel={dict.initiativesLabel}
    />
  );
}
