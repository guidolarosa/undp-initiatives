import type { ExplorerActor, ExplorerFocusArea } from "@/components/common/InitiativesExplorerTypes";

export function FocusAreaTag({ focusArea }: { focusArea: ExplorerFocusArea }) {
  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium"
      style={focusArea.color ? { backgroundColor: focusArea.color } : undefined}
    >
      {focusArea.name}
    </span>
  );
}

export function ActorTag({ actor }: { actor: ExplorerActor }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-foreground/60 px-3 py-1 text-sm">
      {actor.name}
    </span>
  );
}
