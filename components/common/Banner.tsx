export interface BannerProps {
  title: string;
  content?: string;
  backgroundColor?: string;
}

export function Banner({ title, content, backgroundColor }: BannerProps) {
  return (
    <div
      style={backgroundColor ? { backgroundColor } : undefined}
      className="my-29.75 border-y"
    >
      <section className={"pt-8"}>
        <div className="border-t">
          <div className="grid grid-cols-[1.5fr_1fr] gap-4 ">
            <div className="pl-[calc(50vw-568px)] border-r flex flex-col gap-8 py-8 pr-12">
              <h2 className="mt-auto">{title}</h2>
              <div>São Tomé doesn’t lack potential; it lacks the unity to turn it into progress.</div>
            </div>
            <div className="pr-[calc(50vw-568px)] py-8">
              {content && (
                  <p className="whitespace-pre-line text-foreground/80 lg:text-xl px-4 lg:px-0">
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
