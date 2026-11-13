import { NewsList } from "@/components/common/NewsList";
import type { NewsListSection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `newsList` block onto the common <NewsList>
 * component. News cards don't show an image, so item.image is never read.
 */
export function NewsListBlock({ block }: { block: NewsListSection }) {
  // Defends against an editor accidentally referencing the same News
  // document more than once in Studio — without this, the same card would
  // visually repeat several times instead of showing distinct items.
  const uniqueNews = block.news.filter(
    (item, index) => block.news.findIndex((other) => other._id === item._id) === index,
  );

  return (
    <NewsList
      title={block.title}
      content={block.content}
      cta={{
        label: block.cta.label,
        url: block.cta.url,
        color: block.cta.color,
      }}
      news={uniqueNews.map((item) => ({
        _key: item._key,
        title: item.title,
        date: item.date,
        category: item.category,
        url: item.url,
        backgroundColor: item.backgroundColor,
      }))}
    />
  );
}
