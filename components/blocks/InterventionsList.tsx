import { InterventionsList } from "@/components/common/InterventionsList";
import type { InterventionsListSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `interventionsList` block onto the common
 * <InterventionsList> component.
 */
export function InterventionsListBlock({
  block,
}: {
  block: InterventionsListSection;
}) {
  return (
    <InterventionsList
      eyebrow={block.eyebrow}
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
      interventions={block.interventions}
    />
  );
}
