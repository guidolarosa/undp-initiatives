import { ActorsGraph } from "@/components/common/ActorsGraph";
import type { ActorsGraphSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `actorsGraph` block onto the common
 * <ActorsGraph> component.
 */
export function ActorsGraphBlock({ block }: { block: ActorsGraphSection }) {
  return (
    <ActorsGraph
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
      actors={block.actors}
    />
  );
}
