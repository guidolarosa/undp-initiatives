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
        <p className="text-[40px] font-bold leading-tight mt-auto">{card.title}</p>
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
        <div className="mx-auto max-w-280 flex flex-col gap-16 px-6">
          <div className="flex gap-8">
            <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em] flex-1">
              {title}
            </h2>
            {content && (
              <p className="mt-4 whitespace-pre-line text-foreground/80 text-[20px] flex-1">
                {content}
              </p>
            )}
          </div>
          <div className="flex gap-6">
            {cards.map((card) => (
              <StatCard key={card._key} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
