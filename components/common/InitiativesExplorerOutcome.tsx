import { PortableText } from "@/components/common/PortableText";
import type { ExplorerOutcome } from "@/components/common/InitiativesExplorerTypes";

export function OutcomeCard({ outcome }: { outcome: ExplorerOutcome }) {
  if (outcome.content === "video") {
    if (!outcome.videoUrl) return null;
    return (
      <div className="rounded-2xl border px-4 py-4">
        <a
          href={outcome.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline underline-offset-2"
        >
          Watch video
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border px-4 py-4">
      {outcome.numericValue !== undefined && (
        <span className="block text-3xl font-bold leading-tight">
          {outcome.numericValue}
        </span>
      )}
      {outcome.text && outcome.text.length > 0 && (
        <div className="mt-1 *:text-sm">
          <PortableText value={outcome.text} />
        </div>
      )}
    </div>
  );
}
