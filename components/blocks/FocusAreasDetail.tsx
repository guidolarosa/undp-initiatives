import { FocusAreasDetail } from "@/components/common/FocusAreasDetail";
import type { FocusAreasDetailSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `focusAreasDetail` block onto the common
 * <FocusAreasDetail> component.
 */
export function FocusAreasDetailBlock({ block }: { block: FocusAreasDetailSection }) {
  return (
    <FocusAreasDetail
      title={block.title}
      content={block.content}
      focusAreas={block.focusAreas}
    />
  );
}
