import { OutcomesSection } from "@/components/common/OutcomesSection";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { OutcomesSectionSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `outcomesSection` block onto the common
 * <OutcomesSection> component, formatting each outcome's numeric value with
 * locale-aware thousands separators and supplying the locale's UI chrome
 * strings.
 */
export function OutcomesSectionBlock({
  block,
  locale,
}: {
  block: OutcomesSectionSection;
  locale: Locale;
}) {
  const dict = getDictionary(locale).outcomesSection;
  const formatNumber = new Intl.NumberFormat(locale).format;

  return (
    <OutcomesSection
      title={block.title}
      content={block.content}
      focusAreaOptions={block.focusAreaOptions}
      outcomes={block.outcomes.map((outcome) => ({
        _id: outcome._id,
        value: formatNumber(outcome.numericValue),
        text: outcome.text,
        focusArea: outcome.focusArea,
      }))}
      dict={dict}
    />
  );
}
