import { FocusAreasBreakdown } from "@/components/common/FocusAreasBreakdown";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { FocusAreasBreakdownSection } from "@/lib/sanity/queries";

export function FocusAreasBreakdownBlock({
  block,
  locale,
}: {
  block: FocusAreasBreakdownSection;
  locale: Locale;
}) {
  const dict = getDictionary(locale).focusAreasBreakdown;

  return (
    <FocusAreasBreakdown
      title={block.title}
      description={block.description}
      breakdown={block.breakdown}
      graphTitle={block.graphTitle}
      focusAreas={block.focusAreas}
      dict={dict}
    />
  );
}
