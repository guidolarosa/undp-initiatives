import { cn } from "@/lib/utils";

export interface BannerProps {
  title: string;
  content?: string;
  backgroundColor?: string;
}

export function Banner({ title, content, backgroundColor }: BannerProps) {
  return (
    <div style={backgroundColor ? { backgroundColor } : undefined} className="my-29.75">
      <section className={"pt-8"}>
        <div className="text-center border-t py-18">
          <div className="mx-auto max-w-221 flex flex-col gap-4">
            <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
              {title}
            </h2>
            {content && (
              <p className="mt-4 whitespace-pre-line text-foreground/80 text-xl">
                {content}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
