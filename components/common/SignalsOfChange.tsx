export interface SignalsMilestone {
  _key: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  description: string;
  importance: "low" | "medium" | "high";
}

export interface SignalsChronology {
  _key: string;
  fromText: string;
  toText: string;
  milestones: SignalsMilestone[];
}

export interface SignalsOfChangeProps {
  title: string;
  content?: string;
  circleText: string;
  circleSizeText: string;
  backgroundColor?: string;
  milestoneColor?: string;
  /** ISO date string — every Chronology's timeline starts here. */
  timelineStartDate: string;
  /** ISO date string for "now" — passed in so server and client render the same value. */
  now: string;
  chronologies: SignalsChronology[];
  /** UI chrome strings — see lib/dictionaries/*.json: signalsOfChange. */
  dict: {
    from: string;
    to: string;
    now: string;
  };
}

// Circle diameter (px) per importance — the one variable the design calls
// out explicitly ("size of milestones should depend on importance").
const IMPORTANCE_SIZE: Record<SignalsMilestone["importance"], number> = {
  low: 10,
  medium: 18,
  high: 30,
};

const TRACK_TOP = 24; // px from the row's top to the line
const ROW_HEIGHT = 76; // px — line + tick labels below it

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Year-boundary tick marks strictly between `start` and `end` — the row
 * renders its own start/"now" ticks at the two ends separately.
 */
function yearTicksBetween(start: Date, end: Date): { label: string; fraction: number }[] {
  const startMs = start.getTime();
  const span = end.getTime() - startMs;
  if (span <= 0) return [];

  const ticks: { label: string; fraction: number }[] = [];
  for (let year = start.getUTCFullYear() + 1; ; year += 1) {
    const jan1 = Date.UTC(year, 0, 1);
    if (jan1 >= end.getTime()) break;
    ticks.push({ label: String(year), fraction: (jan1 - startMs) / span });
  }
  return ticks;
}

function MilestoneDot({
  milestone,
  fraction,
  color,
}: {
  milestone: SignalsMilestone;
  fraction: number;
  color?: string;
}) {
  const size = IMPORTANCE_SIZE[milestone.importance];
  return (
    <div
      className="group absolute z-10 -translate-x-1/2"
      style={{ left: `${fraction * 100}%`, top: TRACK_TOP }}
    >
      <button
        type="button"
        aria-label={milestone.description}
        className="block -translate-y-1/2 rounded-full opacity-65 transition-opacity duration-200 hover:opacity-90 focus-visible:opacity-90 focus-visible:outline-none"
        style={{ width: size, height: size, backgroundColor: color }}
      />
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-3 text-xs leading-5 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {milestone.description}
      </div>
    </div>
  );
}

function TimelineTick({ label, fraction }: { label: string; fraction: number }) {
  return (
    <div
      className="absolute flex -translate-x-1/2 flex-col items-center"
      style={{ left: `${fraction * 100}%`, top: TRACK_TOP }}
    >
      <span className="size-1.5 -translate-y-1/2 rounded-full bg-foreground" />
      <span className="mt-1 h-3.5 border-l border-dashed border-foreground/50" />
      <span className="mt-1 whitespace-nowrap text-sm">{label}</span>
    </div>
  );
}

function ChronologyRow({
  chronology,
  milestoneColor,
  startDate,
  now,
  fromLabel,
  toLabel,
  nowLabel,
}: {
  chronology: SignalsChronology;
  milestoneColor?: string;
  startDate: Date;
  now: Date;
  fromLabel: string;
  toLabel: string;
  nowLabel: string;
}) {
  const startMs = startDate.getTime();
  const span = Math.max(now.getTime() - startMs, 1);
  const yearTicks = yearTicksBetween(startDate, now);

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-start gap-10">
      <div className="text-sm">
        <p className="font-semibold">{fromLabel}</p>
        <p>{chronology.fromText}</p>
      </div>

      <div className="relative" style={{ height: ROW_HEIGHT }}>
        <div
          className="absolute inset-x-0 bg-foreground"
          style={{ top: TRACK_TOP, height: 1 }}
        />

        <TimelineTick label={String(startDate.getUTCFullYear())} fraction={0} />
        {yearTicks.map((tick) => (
          <TimelineTick key={tick.label} label={tick.label} fraction={tick.fraction} />
        ))}
        <TimelineTick label={nowLabel} fraction={1} />

        {chronology.milestones.map((milestone) => (
          <MilestoneDot
            key={milestone._key}
            milestone={milestone}
            color={milestoneColor}
            fraction={clamp01((new Date(milestone.date).getTime() - startMs) / span)}
          />
        ))}
      </div>

      <div className="text-sm">
        <p className="font-semibold">{toLabel}</p>
        <p>{chronology.toText}</p>
      </div>
    </div>
  );
}

export function SignalsOfChange({
  title,
  content,
  circleText,
  circleSizeText,
  backgroundColor,
  milestoneColor,
  timelineStartDate,
  now,
  chronologies,
  dict,
}: SignalsOfChangeProps) {
  const startDate = new Date(timelineStartDate);
  const nowDate = new Date(now);

  return (
    <section className="my-20 grid w-full border-y md:grid-cols-[5fr_4fr]">
      <div className="flex flex-col border-r">
        <div className="flex flex-1 flex-col gap-10 py-12 pl-[calc(50vw-568px)] pr-11 justify-center">
          {chronologies.map((chronology) => (
            <ChronologyRow
              key={chronology._key}
              chronology={chronology}
              milestoneColor={milestoneColor}
              startDate={startDate}
              now={nowDate}
              fromLabel={dict.from}
              toLabel={dict.to}
              nowLabel={dict.now}
            />
          ))}
        </div>

        <div className="flex items-center gap-8 border-t py-4 pl-[calc(50vw-568px)] pr-11 text-sm">
          <span className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-full border border-foreground" />
            {circleText}
          </span>
          <span className="flex items-center gap-2">
            <span className="relative flex size-3 shrink-0 items-center justify-center rounded-full border border-foreground">
              <span className="size-1.5 rounded-full border border-foreground" />
            </span>
            {circleSizeText}
          </span>
        </div>
      </div>

      <div
        style={backgroundColor ? { backgroundColor } : undefined}
        className="flex flex-col"
      >
        <div className="mt-8 flex flex-1 items-end border-y py-12 pl-11 pr-[calc(50vw-568px)]">
          <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
            {title}
          </h2>
        </div>
        {content && (
          <p className="whitespace-pre-line py-12 pl-11 pr-[calc(50vw-568px)] text-[18px] leading-8">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}
