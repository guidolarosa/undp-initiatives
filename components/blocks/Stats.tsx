import { Stats } from "@/components/common/Stats";
import type { StatsSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `stats` block onto the common <Stats> component.
 */
export function StatsBlock({ block }: { block: StatsSection }) {
  return (
    <Stats
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
      cards={block.cards}
    />
  );
}
