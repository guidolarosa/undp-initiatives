import { ShiftsInLogic } from "@/components/common/ShiftsInLogic";
import { urlForImage } from "@/lib/sanity/image";
import type { ShiftsInLogicSection } from "@/lib/sanity/queries";

const IMAGE_WIDTH = 600;

/**
 * Block wrapper: maps a Sanity `shiftsInLogic` block onto the common
 * <ShiftsInLogic> component, resolving each row's illustration to a CDN URL.
 */
export function ShiftsInLogicBlock({
  block,
}: {
  block: ShiftsInLogicSection;
}) {
  return (
    <ShiftsInLogic
      title={block.title}
      content={block.content}
      leadIn={block.leadIn}
      backgroundColor={block.backgroundColor}
      rows={block.rows.map((row) => {
        const { image } = row;
        const aspectRatio = image?.dimensions?.aspectRatio ?? 1;
        return {
          _key: row._key,
          label: row.label,
          content: row.content,
          color: row.color,
          image: image?.asset
            ? {
                src: urlForImage(image).width(IMAGE_WIDTH).url(),
                width: IMAGE_WIDTH,
                height: Math.round(IMAGE_WIDTH / aspectRatio),
                alt: row.label,
                blurDataURL: image.lqip,
              }
            : undefined,
        };
      })}
    />
  );
}
