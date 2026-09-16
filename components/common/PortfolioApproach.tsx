import type { PortableTextBlock } from "@portabletext/react";
import Image from "next/image";

import { PortableText } from "@/components/common/PortableText";

export interface PortfolioApproachCardProps {
  _key: string;
  title: string;
  content?: string;
  backgroundColor?: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
}

export interface PortfolioApproachProps {
  title: string;
  content?: PortableTextBlock[];
  portfolioApproachCards: PortfolioApproachCardProps[];
}

const PortfolioApproachCard = ({
  portfolioApproachCard,
}: {
  portfolioApproachCard: PortfolioApproachCardProps;
}) => {
  return (
    <div
      className="flex gap-4 pr-[calc(50vw-568px)] flex-1 border-b pl-12 justify-between last:border-b-0"
      style={{ backgroundColor: portfolioApproachCard.backgroundColor }}
    >
      <div className="flex flex-col justify-center h-full">
        <h3 className="text-[18px] leading-7">{portfolioApproachCard.title}</h3>
        {portfolioApproachCard.content && (
          <p className="mt-4 whitespace-pre-line text-foreground/80 text-xl italic">
            {portfolioApproachCard.content}
          </p>
        )}
      </div>
      {portfolioApproachCard.image && (
        <div className="relative aspect-square w-full max-w-40 my-auto">
          <Image
            src={portfolioApproachCard.image.src}
            alt={portfolioApproachCard.image.alt}
            fill
            placeholder={
              portfolioApproachCard.image.blurDataURL ? "blur" : undefined
            }
            blurDataURL={portfolioApproachCard.image.blurDataURL}
            className="rounded-2xl object-cover"
          />
        </div>
      )}
    </div>
  );
};

export function PortfolioApproach({
  title,
  content,
  portfolioApproachCards,
}: PortfolioApproachProps) {
  return (
    <section className="w-full min-h-172 flex border-b">
      <div className="border-t grid grid-cols-[1.5fr_1fr]">
        <div className="mx-auto max-w-280 flex flex-col h-full border-t mt-8">
          <div className="border-b py-8 flex-1 pl-[calc(50vw-568px)]">
            <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
              {title}
            </h2>
          </div>
          {content && (
            <div className="py-8 pl-[calc(50vw-568px)] pr-11 *:text-[20px] mb-8">
              <PortableText value={content} />
            </div>
          )}
        </div>
        <div className="flex flex-col h-full border-l">
          {portfolioApproachCards.map((card) => (
            <PortfolioApproachCard
              key={card._key}
              portfolioApproachCard={card}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
