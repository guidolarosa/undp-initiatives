import { Experiences } from "@/components/common/Experiences";
import type { ExperiencesSection } from "@/lib/sanity/queries";


/**
 * Block wrapper: maps a Sanity `Experiences` block onto the common <Experiences> component.
 */

export function ExperiencesBlock({ block }: { block: ExperiencesSection }) {
  return (
    <Experiences
      title={block.title}
      content={block.content ?? ""}
      experiences={block.experiences ?? []}
    />
  );
}
