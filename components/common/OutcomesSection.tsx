export interface OutcomeStatCard {
  _key: string;
  title: string;
  content?: string;
  color?: string;
}

export interface OutcomesSectionProps {
  title: string;
  content?: string;
  cards: OutcomeStatCard[];
}

function OutcomeCard({ card }: { card: OutcomeStatCard }) {
  return (
    <div
      style={card.color ? { backgroundColor: card.color } : undefined}
      className="w-44 shrink-0 overflow-hidden rounded-3xl"
    >
      <div className="h-8 border-b border-foreground" />
      <div className="flex min-h-32 flex-col gap-1 px-5 py-5">
        <span className="text-[32px] font-bold leading-tight">{card.title}</span>
        {card.content && <span className="text-sm text-foreground/80">{card.content}</span>}
      </div>
    </div>
  );
}

export function OutcomesSection({ title, content, cards }: OutcomesSectionProps) {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-280 px-6 pt-14">
        <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">{title}</h2>
      </div>
      <div className="mx-auto flex max-w-280 flex-wrap items-end gap-10 px-6 py-14">
        <div className="min-w-0 flex-1">
          {content && <p className="whitespace-pre-line text-foreground/80">{content}</p>}
        </div>
        <div className="flex flex-wrap gap-4">
          {cards.map((card) => (
            <OutcomeCard key={card._key} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
