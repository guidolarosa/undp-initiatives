import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface LinkProps {
  _key: string;
  label: string;
  url: string;
  type: "external" | "internal";
  color: string;
}

export interface CTABannerProps {
  title: string;
  content?: string;
  backgroundColor?: string;
  cta: LinkProps;
}

export function CTABanner({
  title,
  content,
  backgroundColor,
  cta,
}: CTABannerProps) {
  return (
    <div
      style={backgroundColor ? { backgroundColor } : undefined}
      className="my-29.75"
    >
      <section className={"pt-8"}>
        <div className="text-center border-t py-18">
          <div className="mx-auto max-w-221 flex flex-col gap-8 items-center">
            <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
              {title}
            </h2>
            {content && (
              <p className=" whitespace-pre-line text-foreground/80 text-xl max-w-160">
                {content}
              </p>
            )}
            <Link
              href={cta.url}
              className="rounded-full h-15 w-fit px-8 flex items-center text-xl"
              style={{ backgroundColor: cta.color }}
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
