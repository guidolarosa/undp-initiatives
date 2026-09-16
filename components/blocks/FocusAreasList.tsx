import { FocusAreasList } from "@/components/common/FocusAreasList";
import type { FocusAreasListSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `focusAreasList` block onto the common
 * <FocusAreasList> component.
 */
export function FocusAreasListBlock({ block }: { block: FocusAreasListSection }) {
  return (
    <FocusAreasList title={block.title} focusAreas={block.focusAreas} />
  );
}
