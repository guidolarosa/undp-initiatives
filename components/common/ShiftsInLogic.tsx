import Image from "next/image";

import { cn } from "@/lib/utils";

export interface ShiftInLogicRowProps {
  _key: string;
  label: string;
  content?: string;
  color?: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
}

export interface ShiftsInLogicProps {
  title: string;
  content?: string;
  leadIn?: string;
  backgroundColor?: string;
  rows: ShiftInLogicRowProps[];
}

const ShiftRow = ({
  row,
  isFirst,
  isLast,
}: {
  row: ShiftInLogicRowProps;
  isFirst: boolean;
  isLast: boolean;
}) => {
  return (
    <div
      style={row.color ? { backgroundColor: row.color } : undefined}
      className="rounded-3xl outline-black outline-1 lg:rounded-full"
    >
      {/* Inset from the pill's rounded ends so the rules never cross the curve.
          Only the outer edges of the whole stack get a horizontal rule. */}
      <div
        className={cn(
          "mx-4 grid min-h-34 grid-cols-1 lg:mx-16 lg:grid-cols-[1fr_1.3fr_2.2fr]",
        )}
      >
        <div className="flex items-center border-b px-8 py-10 text-[18px] font-bold leading-8 lg:border-b-0 lg:border-r">
          {row.label}
        </div>
        <div className="flex items-center justify-center border-b px-8 py-10 lg:border-b-0 lg:border-r">
          {row.image && (
            <Image
              src={row.image.src}
              alt={row.image.alt}
              width={row.image.width}
              height={row.image.height}
              placeholder={row.image.blurDataURL ? "blur" : undefined}
              blurDataURL={row.image.blurDataURL}
              className="h-auto max-h-28 w-auto object-contain"
            />
          )}
        </div>
        <div className="flex items-center px-8 py-10">
          {row.content && (
            <p className="whitespace-pre-line text-[18px] leading-8">
              {row.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export function ShiftsInLogic({
  title,
  content,
  leadIn,
  backgroundColor,
  rows,
}: ShiftsInLogicProps) {
  return (
    <section
      style={backgroundColor ? { backgroundColor } : undefined}
      className="w-full border-y"
    >
      <div className="grid border-b lg:grid-cols-[1.5fr_1fr]">
        <div className="px-6 py-16 lg:pl-[calc(50vw-568px)] lg:pr-11 lg:px-0">
          <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] lg:text-[56px] lg:leading-15">
            {title}
          </h2>
        </div>
        {content && (
          <div className="px-6 py-16 lg:pl-11 lg:pr-[calc(50vw-568px)] lg:px-0">
            <p className="whitespace-pre-line text-[18px] leading-8">
              {content}
            </p>
          </div>
        )}
      </div>

      {leadIn && (
        <div className="border-b px-6 py-8 lg:px-0 lg:pl-[calc(50vw-568px)] lg:pr-[calc(50vw-568px)]">
          <p className="whitespace-pre-line text-[18px] leading-8">{leadIn}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 px-6 py-20 lg:gap-0 lg:px-0 lg:pl-[calc(50vw-568px)] lg:pr-[calc(50vw-568px)]">
        {rows.map((row, index) => (
          <ShiftRow
            key={row._key}
            row={row}
            isFirst={index === 0}
            isLast={index === rows.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
