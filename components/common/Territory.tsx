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
    <section className="grid w-full border-y lg:grid-cols-2 mt-20">
      <div
        style={backgroundColor ? { backgroundColor } : undefined}
        className="flex flex-col"
      >
        <div className="mt-8 flex flex-1 items-end border-y py-12 px-6 lg:pl-[calc(50vw-568px)] lg:pr-11">
          <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] lg:text-[56px] lg:leading-18">
            {title}
          </h2>
        </div>
        {content && (
          <p className="whitespace-pre-line py-12 px-6 lg:pl-[calc(50vw-568px)] lg:pr-11 text-[18px] leading-8">
            {content}
          </p>
        )}
      </div>
      {/* Map hidden below lg — a WebGL map canvas has no useful "reflow" at
          mobile width, same treatment as the two InitiativesGraph instances. */}
      <div className="hidden border-l lg:block">
        <TerritoryMap points={points} />
      </div>
    </section>
  );
}
