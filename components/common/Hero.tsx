import Image from "next/image";

import { cn } from "@/lib/utils";

export interface HeroProps {
  title: string;
  content?: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
  imagePosition?: "left" | "right";
  backgroundColor?: string;
}

export function Hero({
  title,
  content,
  image,
  imagePosition = "right",
  backgroundColor,
}: HeroProps) {
  return (
    <div style={backgroundColor ? { backgroundColor } : undefined}>
      <section
        className={cn(
          "mx-auto grid min-h-159 border-y",
          image && imagePosition === "left"
            ? "md:grid-cols-[1fr_1.25fr]"
            : "md:grid-cols-[1.25fr_1fr]",
        )}
      >
        <div
          className={cn(
            image && imagePosition === "left" ? "md:order-2" : "md:order-1",
            "border-t mt-auto py-15",
            content && "flex flex-col justify-between h-full mt-8 py-0"
          )}
        >
          <h2
            className={cn(
              "text-[56px] font-semibold leading-15 tracking-[-0.02em]",
              imagePosition === "left"
                ? "pl-11 pr-[calc(50vw-568px)]"
                : "pl-[calc(50vw-568px)] pr-11 py-8",
            )}
          >
            {title}
          </h2>
          {content && (
            <p
              className={cn(
                "whitespace-pre-line text-foreground/80 border-t py-8 pb-16 text-[20px]",
                imagePosition === "left"
                  ? "pl-11 pr-[calc(50vw-568px)]"
                  : "pl-[calc(50vw-568px)] pr-11",
              )}
            >
              {content}
            </p>
          )}
        </div>
        {image && (
          <div
            className={cn(
              "relative h-full py-11",
              imagePosition === "left"
                ? "md:order-1 border-r pr-11 pl-[calc(50vw-568px)]"
                : "border-l pl-11 pr-[calc(50vw-568px)] md:order-2",
            )}
          >
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
    </div>
  );
}
