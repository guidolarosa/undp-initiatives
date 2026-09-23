import { NewsList } from "@/components/common/NewsList";
import { urlForImage } from "@/lib/sanity/image";
import type { NewsListSection } from "@/lib/sanity/queries";

const IMAGE_WIDTH = 600;

/**
 * Block wrapper: maps a Sanity `newsList` block onto the common <NewsList>
 * component, resolving each News item's image reference to a CDN URL.
 */
export function NewsListBlock({ block }: { block: NewsListSection }) {
  return (
    <NewsList
      title={block.title}
      content={block.content}
      cta={{
        label: block.cta.label,
        url: block.cta.url,
        color: block.cta.color,
      }}
      news={block.news.map((item) => {
        const { image } = item;
        const aspectRatio = image?.dimensions?.aspectRatio ?? 4 / 3;
        return {
          _key: item._key,
          title: item.title,
          date: item.date,
          category: item.category,
          url: item.url,
          backgroundColor: item.backgroundColor,
          image: image?.asset
            ? {
                src: urlForImage(image).width(IMAGE_WIDTH).url(),
                width: IMAGE_WIDTH,
                height: Math.round(IMAGE_WIDTH / aspectRatio),
                alt: item.title,
                blurDataURL: image.lqip,
              }
            : undefined,
        };
      })}
    />
  );
}
