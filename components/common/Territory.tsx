import {
  TerritoryMap,
  type TerritoryMapPoint,
} from "@/components/common/TerritoryMap";

export interface TerritoryProps {
  title: string;
  content?: string;
  backgroundColor?: string;
  points: TerritoryMapPoint[];
}

export function Territory({
  title,
  content,
  backgroundColor,
  points,
}: TerritoryProps) {
  return (
    <section className="grid w-full border-y md:grid-cols-2 mt-20">
      <div
        style={backgroundColor ? { backgroundColor } : undefined}
        className="flex flex-col"
      >
        <div className="mt-8 flex flex-1 items-end border-y py-12 pl-[calc(50vw-568px)] pr-11">
          <h2 className="text-[56px] font-semibold leading-18 tracking-[-0.02em]">
            {title}
          </h2>
        </div>
        {content && (
          <p className="whitespace-pre-line py-12 pl-[calc(50vw-568px)] pr-11 text-[18px] leading-8">
            {content}
          </p>
        )}
      </div>
      <div className="border-l">
        <TerritoryMap points={points} />
      </div>
    </section>
  );
}
