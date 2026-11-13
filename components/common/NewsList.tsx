import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface NewsItemProps {
  _key: string;
  title: string;
  date: string;
  category?: string;
  url: string;
  backgroundColor?: string;
}

export interface CtaProps {
  label: string;
  url: string;
  color: string;
}

export interface NewsListProps {
  title: string;
  content?: string;
  news: NewsItemProps[];
  cta: CtaProps;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(date.getUTCFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

// No image — a plain, fixed-size card regardless of how many items the CMS
// has (never stretches to fill a part-empty row), individually bordered so
// cards sit with a gap between them instead of sharing one outer box.
const NewsCard = ({ item }: { item: NewsItemProps }) => {
  return (
    <div
      style={item.backgroundColor ? { backgroundColor: item.backgroundColor } : undefined}
      className="flex flex-col overflow-hidden rounded-2xl border"
    >
      <div className="flex items-center justify-between gap-4 border-b px-6 py-3 text-sm">
        {item.category && (
          <span className="uppercase">{item.category}</span>
        )}
        <span>{formatDate(item.date)}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="text-lg font-semibold leading-7">{item.title}</h3>
        {/* "Read more" is fixed UI copy (no per-item label field on News) —
            hardcoded, not localized. Localize here if that's needed later. */}
        <Link href={item.url} className="mt-auto underline w-fit">
          Read more
        </Link>
      </div>
    </div>
  );
};

export function NewsList({ title, content, news, cta }: NewsListProps) {
  return (
    <div className="lg:my-29.75 my-0">
      <section className={"pt-8"}>
        <div className="border-t py-18">
          <div className="mx-auto max-w-280 flex flex-col gap-6 px-6 lg:gap-12">
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
            {/* Fixed-size cards, gap between them (not a shared outer
                border) — stays 1/3-width on desktop no matter how many
                items the CMS has, rather than stretching to fill the row. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <NewsCard key={item._key} item={item} />
              ))}
            </div>
            <Link
              href={cta.url}
              className="rounded-full h-15 w-fit px-8 flex items-center gap-2 text-xl"
              style={{ backgroundColor: cta.color }}
            >
              {cta.label}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
