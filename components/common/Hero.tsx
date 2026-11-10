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
            ? "lg:grid-cols-[1fr_1.25fr]"
            : "lg:grid-cols-[1.25fr_1fr]",
        )}
      >
        <div
          className={cn(
            image && imagePosition === "left" ? "lg:order-2" : "lg:order-1",
            "lg:border-t mt-auto lg:py-15 border-b lg:border-b-0",
            content && "flex flex-col justify-between h-full mt-8 py-0",
          )}
        >
          <h2
            className={cn(
              "px-6 py-8 lg:px-0",
              imagePosition === "left"
                ? "lg:py-0 lg:pl-11 lg:pr-[calc(50vw-568px)]"
                : "lg:pl-[calc(50vw-568px)] lg:pr-11",
            )}
          >
            {title}
          </h2>
          {content && (
            <p
              className={cn(
                "whitespace-pre-line text-foreground/80 border-t px-6 py-8 pb-16 text-[20px] lg:px-0",
                imagePosition === "left"
                  ? "lg:pl-11 lg:pr-[calc(50vw-568px)]"
                  : "lg:pl-[calc(50vw-568px)] lg:pr-11",
              )}
            >
              {content}
            </p>
          )}
        </div>
        {image && (
          <div
            className={cn(
              "relative h-89 lg:h-full lg:py-11 py-6 px-6 lg:px-0",
              imagePosition === "left"
                ? "lg:order-1 lg:border-r lg:pr-11 lg:pl-[calc(50vw-568px)]"
                : "lg:border-l lg:pl-11 lg:pr-[calc(50vw-568px)] lg:order-2",
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
