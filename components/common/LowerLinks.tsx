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
    <Link href={link.url} className="rounded-2xl h-75 flex flex-col flex-1 aspect-square max-w-75" style={{ backgroundColor: link.color }}>
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
            <div className="flex gap-8">
              <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em] flex-1">
                {title}
              </h2>
              {content && (
                <p className="mt-4 whitespace-pre-line text-foreground/80 text-[20px] flex-1">
                  {content}
                </p>
              )}
            </div>
            <div className="flex gap-8 mx-auto">
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
