import { PortfolioApproach } from "@/components/common/PortfolioApproach";
import { urlForImage } from "@/lib/sanity/image";
import type { PortfolioApproachSection } from "@/lib/sanity/queries";

const IMAGE_WIDTH = 800;

/**
 * Block wrapper: maps a Sanity `portfolioApproach` block onto the common
 * <PortfolioApproach> component, resolving each card's image reference to a
 * CDN URL.
 */
export function PortfolioApproachBlock({
  block,
}: {
  block: PortfolioApproachSection;
}) {
  return (
    <PortfolioApproach
      title={block.title}
      content={block.content}
      portfolioApproachCards={block.portfolioApproachCards.map((card) => {
        const { image } = card;
        const aspectRatio = image?.dimensions?.aspectRatio ?? 1;
        return {
          _key: card._key,
          title: card.title,
          content: card.content,
          backgroundColor: card.backgroundColor,
          image: image?.asset
            ? {
                src: urlForImage(image).width(IMAGE_WIDTH).url(),
                width: IMAGE_WIDTH,
                height: Math.round(IMAGE_WIDTH / aspectRatio),
                alt: card.title,
                blurDataURL: image.lqip,
              }
            : undefined,
        };
      })}
    />
  );
}
