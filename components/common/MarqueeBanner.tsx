import Image from "next/image";
import Link from "next/link";

export interface MarqueeBannerProps {
  title: string;
  content?: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
  marqueeText: string;
  /** Already resolved (locale-prefixed if internal) by the block wrapper. */
  marqueeHref?: string;
  marqueeExternal?: boolean;
  backgroundColor?: string;
}

// How many times the text repeats within a single copy of the track — high
// enough that even a very wide screen never shows a gap before the loop.
const REPEAT = 6;

function MarqueeCopy({ text }: { text: string }) {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: REPEAT }, (_, i) => (
        <span
          key={i}
          className="flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 lg:text-[32px] text-[24px] font-semibold uppercase tracking-tight"
        >
          {text}
        </span>
      ))}
    </div>
  );
}

export function MarqueeBanner({
  title,
  content,
  image,
  marqueeText,
  marqueeHref,
  marqueeExternal,
  backgroundColor,
}: MarqueeBannerProps) {
  // Decorative — screen readers get one clean link/label instead of the
  // marquee text repeated 12 times (2 copies x REPEAT).
  const track = (
    <div
      aria-hidden
      className="flex w-max animate-[marquee-rtl_90s_linear_infinite] motion-reduce:animate-none group-hover:[animation-play-state:paused]"
    >
      <MarqueeCopy text={marqueeText} />
      <MarqueeCopy text={marqueeText} />
    </div>
  );

  return (
    <div style={backgroundColor ? { backgroundColor } : undefined}>
      <section className="mx-auto grid min-h-159 border-y md:grid-cols-[1.25fr_1fr]">
        <div className="mt-8 flex h-full flex-col justify-between border-t py-0 md:order-1">
          <h2 className="lg:py-8 pt-8 px-4 lg:px-0 lg:pl-[calc(50vw-568px)] lg:pr-11">
            {title}
          </h2>
          {content && (
            <p className="whitespace-pre-line border-t py-8 pb-16 lg:pl-[calc(50vw-568px)] pr-11 lg:text-[20px] text-foreground/80 px-4">
              {content}
            </p>
          )}
        </div>
        {image && (
          <div className="relative h-full border-l lg:py-11 lg:pl-11 pr-[calc(50vw-568px)] md:order-2 bg-stone-50 py-4">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              placeholder={image.blurDataURL ? "blur" : undefined}
              blurDataURL={image.blurDataURL}
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        )}
      </section>

      <div className="overflow-hidden border-b lg:py-6 py-4">
        {marqueeHref ? (
          marqueeExternal ? (
            <a
              href={marqueeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={marqueeText}
              className="group block"
            >
              {track}
            </a>
          ) : (
            <Link href={marqueeHref} aria-label={marqueeText} className="group block">
              {track}
            </Link>
          )
        ) : (
          <div role="marquee" aria-label={marqueeText}>
            {track}
          </div>
        )}
      </div>
    </div>
  );
}
