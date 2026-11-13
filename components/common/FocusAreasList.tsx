import { cn } from "@/lib/utils";

export interface FocusArea {
  _key: string;
  name: string;
  description?: string;
  backgroundColor?: string;
}

export interface FocusAreasListProps {
  title: string;
  focusAreas: FocusArea[];
}

export function FocusAreasList({ title, focusAreas }: FocusAreasListProps) {
  return (
    <div className="my-12 border-t lg:my-29.75 lg:mb-30">
      <section className={"pt-8"}>
        <div className="border-t py-18">
          <div className="mx-auto max-w-280 flex flex-col gap-6 px-4 lg:gap-12 lg:px-0">
            <h2>
              {title}
            </h2>
            <div className="grid gap-3 grid-cols-2 lg:gap-6 lg:grid-cols-5">
              {focusAreas.map((focusArea, index) => {
                // An odd count leaves the last card alone in its own row —
                // span both mobile columns and shrink back to a single
                // card's width so it centers instead of sitting flush left.
                const isCenteredLast =
                  index === focusAreas.length - 1 && focusAreas.length % 2 !== 0;
                return (
                  <div
                    key={focusArea._key}
                    style={
                      focusArea.backgroundColor
                        ? { backgroundColor: focusArea.backgroundColor }
                        : undefined
                    }
                    className={cn(
                      "bg-white px-4 py-5 rounded-lg odd:rounded-full aspect-square text-center flex items-center justify-center flex-col lg:px-8 lg:py-10 lg:col-span-1 lg:w-auto",
                      isCenteredLast
                        ? "col-span-2 mx-auto w-[calc(50%-0.375rem)]"
                        : "col-span-1",
                    )}
                  >
                    <h3 className="text-sm font-bold leading-5 lg:text-[18px] lg:leading-7">{focusArea.name}</h3>
                    <p className="hidden lg:block text-sm leading-5">
                      {focusArea.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
