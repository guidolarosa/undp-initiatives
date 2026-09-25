export interface InterventionCardProps {
  _key: string;
  name: string;
  primaryFocusArea?: {
    name: string;
    color?: string;
  };
}

export interface InterventionsListProps {
  eyebrow?: string;
  title: string;
  content?: string;
  backgroundColor?: string;
  interventions: InterventionCardProps[];
}

const InterventionCard = ({
  intervention,
}: {
  intervention: InterventionCardProps;
}) => {
  return (
    <div className="flex flex-col rounded-2xl border ">
      {intervention.primaryFocusArea && (
        <div className="flex items-center gap-2 border-b px-4 py-2.5 text-sm">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={
              intervention.primaryFocusArea.color
                ? { backgroundColor: intervention.primaryFocusArea.color }
                : undefined
            }
          />
          {intervention.primaryFocusArea.name}
        </div>
      )}
      <p className="min-h-40 px-4 py-8 text-[18px] leading-8">
        {intervention.name}
      </p>
    </div>
  );
};

export function InterventionsList({
  eyebrow,
  title,
  content,
  backgroundColor,
  interventions,
}: InterventionsListProps) {
  return (
    <section className="grid w-full border-y md:grid-cols-2 my-20">
      <div className="flex flex-col gap-10 py-18 pl-[calc(50vw-568px)] pr-11">
        {eyebrow && (
          <p className="text-sm uppercase tracking-[0.08em]">{eyebrow}</p>
        )}
        <div className="grid grid-cols-2 gap-x-6 gap-y-7">
          {interventions.map((intervention) => (
            <InterventionCard
              key={intervention._key}
              intervention={intervention}
            />
          ))}
        </div>
      </div>
      <div
        style={backgroundColor ? { backgroundColor } : undefined}
        className="flex flex-col border-l"
      >
        <div className="mt-8 flex-1 border-y py-12 pl-11 pr-[calc(50vw-568px)]">
          <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
            {title}
          </h2>
        </div>
        {content && (
          <p className="whitespace-pre-line py-12 pl-11 pr-[calc(50vw-568px)] text-[20px] leading-9">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}
