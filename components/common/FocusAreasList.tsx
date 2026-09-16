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
    <div className="my-29.75 border-y mb-30">
      <section className={"pt-8"}>
        <div className="border-t py-18">
          <div className="mx-auto max-w-280 flex flex-col gap-12">
            <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
              {title}
            </h2>
            <div className="grid grid-cols-5 gap-6">
              {focusAreas.map((focusArea) => (
                <div
                  key={focusArea._key}
                  style={
                    focusArea.backgroundColor
                      ? { backgroundColor: focusArea.backgroundColor }
                      : undefined
                  }
                  className="bg-white px-8 py-10 rounded-lg odd:rounded-full aspect-square text-center"
                >
                  <h3 className="text-[18px] font-bold leading-7">{focusArea.name}</h3>
                  <p className="text-sm leading-5">
                    {focusArea.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
