export interface StatCardProps {
  _key: string;
  title: string;
  content?: string;
  color?: string;
}

export interface StatsProps {
  title: string;
  content?: string;
  backgroundColor?: string;
  cards: StatCardProps[];
}

const StatCard = ({ card }: { card: StatCardProps }) => {
  return (
    <div
      style={card.color ? { backgroundColor: card.color } : undefined}
      className="flex-1 rounded-2xl overflow-hidden border"
    >
      <div className="h-8 border-b" />
      <div className="py-14 px-6 flex flex-col justify-end h-full">
        <p className="text-[28px] font-bold leading-tight mt-auto lg:text-[40px]">{card.title}</p>
        {card.content && (
          <p className="whitespace-pre-line text-lg text-foreground/80 min-h-14">
            {card.content}
          </p>
        )}
      </div>
    </div>
  );
};

export function Stats({ title, content, backgroundColor, cards }: StatsProps) {
  return (
    <div style={backgroundColor ? { backgroundColor } : undefined} className="mt-20">
      <section className="border-y py-18">
        <div className="mx-auto max-w-280 flex flex-col gap-8 px-6 lg:gap-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] lg:flex-1 lg:text-[56px] lg:leading-18">
              {title}
            </h2>
            {content && (
              <p className="whitespace-pre-line text-foreground/80 text-[20px] lg:mt-4 lg:flex-1">
                {content}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            {cards.map((card) => (
              <StatCard key={card._key} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
