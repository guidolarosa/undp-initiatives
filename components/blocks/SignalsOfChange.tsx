import { SignalsOfChange } from "@/components/common/SignalsOfChange";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { SignalsOfChangeSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `signalsOfChange` block onto the common
 * <SignalsOfChange> component, supplying the locale's "From"/"To"/"Now"
 * chrome strings and today's date for the timeline's "now" end.
 *
 * "Now" is resolved once, here, at render time — for this statically
 * generated site that means it's effectively frozen as of the last build,
 * same as any other build-time data on this site. Not live-updating for a
 * visitor browsing days after a deploy.
 */
export function SignalsOfChangeBlock({
  block,
  locale,
}: {
  block: SignalsOfChangeSection;
  locale: Locale;
}) {
  const dict = getDictionary(locale).signalsOfChange;
  const now = new Date().toISOString().slice(0, 10);

  return (
    <SignalsOfChange
      title={block.title}
      content={block.content}
      circleText={block.circleText}
      circleSizeText={block.circleSizeText}
      backgroundColor={block.backgroundColor}
      milestoneColor={block.milestoneColor}
      timelineStartDate={block.timelineStartDate}
      now={now}
      chronologies={block.chronologies}
      dict={dict}
    />
  );
}
