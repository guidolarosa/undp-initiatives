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
          image && "md:grid-cols-[1fr_1fr]",
        )}
      >
        <div className={cn(image && imagePosition === "left" && "md:order-2", "border-t mt-auto py-15 pl-[calc(50vw-568px)]")}>
          <h2 className="text-[56px] font-semibold leading-15 tracking-[-0.02em]">{title}</h2>
          {content && (
            <p className="mt-4 whitespace-pre-line text-foreground/80">
              {content}
            </p>
          )}
        </div>
        {image && (
          <div
            className={cn("relative h-full py-11", imagePosition === "left" ? "md:order-1" : "border-l pl-11 pr-[calc(50vw-568px)]")}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              placeholder={image.blurDataURL ? "blur" : undefined}
              blurDataURL={image.blurDataURL}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        )}
      </section>
    </div>
  );
}
