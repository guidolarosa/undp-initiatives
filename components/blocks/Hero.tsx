import { Hero } from "@/components/common/Hero";
import { urlForImage } from "@/lib/sanity/image";
import type { HeroSection } from "@/lib/sanity/queries";

const IMAGE_WIDTH = 1200;

/**
 * Block wrapper: maps a Sanity `hero` block onto the common <Hero> component,
 * resolving the image reference to a CDN URL.
 */
export function HeroBlock({ block }: { block: HeroSection }) {
  const { image } = block;
  const aspectRatio = image?.dimensions?.aspectRatio ?? 1;

  return (
    <Hero
      title={block.title}
      content={block.content}
      imagePosition={block.imagePosition}
      backgroundColor={block.backgroundColor}
      image={
        image?.asset
          ? {
              src: urlForImage(image).width(IMAGE_WIDTH).url(),
              width: IMAGE_WIDTH,
              height: Math.round(IMAGE_WIDTH / aspectRatio),
              alt: block.title,
              blurDataURL: image.lqip,
            }
          : undefined
      }
    />
  );
}
