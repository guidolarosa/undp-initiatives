import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface NewsItemProps {
  _key: string;
  title: string;
  date: string;
  category?: string;
  url: string;
  backgroundColor?: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
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

const COLUMNS = 3;

function formatDate(iso: string) {
  const date = new Date(iso);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(date.getUTCFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

const NewsCard = ({ item, index }: { item: NewsItemProps; index: number }) => {
  return (
    <div
      style={
        item.backgroundColor ? { backgroundColor: item.backgroundColor } : undefined
      }
      className={cn(
        "flex flex-col gap-4 p-6",
        // Below lg the grid is a single column — every card but the first
        // just gets a plain top divider. At lg the real grid dividers take
        // over: a left border on every column but the first, a top border
        // on every row but the first (Tailwind's divide-x/y utilities don't
        // place these correctly on a multi-row CSS grid).
        index > 0 && "border-t lg:border-t-0",
        index % COLUMNS !== 0 && "lg:border-l",
        index >= COLUMNS && "lg:border-t",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">{formatDate(item.date)}</span>
        {item.category && (
          <span className="rounded-full border px-3 py-1 text-sm">
            {item.category}
          </span>
        )}
      </div>
      {item.image && (
        <div className="relative aspect-4/3">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            placeholder={item.image.blurDataURL ? "blur" : undefined}
            blurDataURL={item.image.blurDataURL}
            className="rounded-2xl object-cover"
          />
        </div>
      )}
      <h3 className="text-lg leading-7">{item.title}</h3>
      {/* "Read more" is fixed UI copy (no per-item label field on News) —
          hardcoded, not localized. Localize here if that's needed later. */}
      <Link href={item.url} className="underline w-fit">
        Read more
      </Link>
    </div>
  );
};

export function NewsList({ title, content, news, cta }: NewsListProps) {
  return (
    <div className="lg:my-29.75 my-0">
      <section className={"pt-8"}>
        <div className="border-t py-18">
          <div className="mx-auto max-w-280 flex flex-col gap-12 px-6">
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
            <div className="grid grid-cols-1 overflow-hidden rounded-3xl border lg:grid-cols-3">
              {news.map((item, index) => (
                <NewsCard key={item._key} item={item} index={index} />
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
