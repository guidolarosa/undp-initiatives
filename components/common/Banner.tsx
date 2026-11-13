export interface BannerProps {
  title: string;
  content?: string;
  backgroundColor?: string;
}

export function Banner({ title, content, backgroundColor }: BannerProps) {
  return (
    <div
      style={backgroundColor ? { backgroundColor } : undefined}
      className="my-12 border-y lg:my-29.75"
    >
      <section className={"pt-8"}>
        <div className="border-t">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="border-b lg:border-b-0 flex flex-col gap-8 px-6 py-8 lg:border-r lg:pl-[calc(50vw-568px)] lg:pr-12 lg:px-0">
              <h2 className="mt-auto">{title}</h2>
              <div>São Tomé doesn’t lack potential; it lacks the unity to turn it into progress.</div>
            </div>
            <div className="px-6 py-8 lg:pr-[calc(50vw-568px)] lg:px-0">
              {content && (
                  <p className="whitespace-pre-line text-foreground/80 lg:text-xl">
                    {content}
                  </p>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
