import { OutcomesSection } from "@/components/common/OutcomesSection";
import type { OutcomesSectionSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `outcomesSection` block onto the common
 * <OutcomesSection> component.
 */
export function OutcomesSectionBlock({ block }: { block: OutcomesSectionSection }) {
  return <OutcomesSection title={block.title} content={block.content} cards={block.cards} />;
}
