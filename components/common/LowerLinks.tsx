import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface LinkProps {
  _key: string;
  label: string;
  url: string;
  type: "external" | "internal";
  color: string;
}

export interface LowerLinksProps {
  title: string;
  content?: string;
  links: LinkProps[];
}

const LinkBlock = ({ link }: { link: LinkProps }) => {
  return (
    <Link href={link.url} className="rounded-2xl h-60 flex flex-col flex-1" style={{ backgroundColor: link.color }}>
      <div className="px-6 py-4 border-t mt-auto flex justify-between items-center font-medium">
        <h3 className="text-[18px] leading-7">{link.label}</h3>
        <ArrowRight className="w-6 h-6" />
      </div>
    </Link>
  );
};

export function LowerLinks({ title, content, links }: LowerLinksProps) {
  return (
    <div className="my-29.75">
      <section className={"pt-8"}>
        <div className="border-t py-18">
          <div className="mx-auto max-w-280 flex flex-col gap-12">
            <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
              {title}
            </h2>
            {content && (
              <p className="mt-4 whitespace-pre-line text-foreground/80 text-xl">
                {content}
              </p>
            )}
            <div className="flex gap-8">
              {links.map((link) => (
                <LinkBlock key={link._key} link={link} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
