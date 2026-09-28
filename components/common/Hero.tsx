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
          "mx-auto grid lg:min-h-159 border-y",
          image && imagePosition === "left"
            ? "md:grid-cols-[1fr_1.25fr]"
            : "md:grid-cols-[1.25fr_1fr]",
        )}
      >
        <div
          className={cn(
            image && imagePosition === "left" ? "md:order-2" : "md:order-1",
            "lg:border-t mt-auto lg:py-15 px-4 border-b lg:border-b-0",
            content && "flex flex-col justify-between h-full mt-8 py-0",
          )}
        >
          <h2
            className={cn(
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
              "relative h-89 lg:h-full lg:py-11 py-6",
              imagePosition === "left"
                ? "md:order-1 lg:border-r pr-11 pl-[calc(50vw-568px)]"
                : "lg:border-l lg:pl-11 lg:pr-[calc(50vw-568px)] md:order-2 px-4",
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
