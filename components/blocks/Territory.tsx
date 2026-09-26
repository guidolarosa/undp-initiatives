import { Territory } from "@/components/common/Territory";
import type { TerritoryMapPoint } from "@/components/common/TerritoryMap";
import type { TerritorySection } from "@/lib/sanity/queries";

/**
 * Block wrapper: maps a Sanity `territory` block onto the common <Territory>
 * component. MapLibre handles the projection, so this only needs to filter out
 * interventions whose geopoint is missing or incomplete.
 */
export function TerritoryBlock({ block }: { block: TerritorySection }) {
  const points = (block.points ?? []).flatMap((point): TerritoryMapPoint[] =>
    typeof point.lat === "number" && typeof point.lng === "number"
      ? [
          {
            id: point._id,
            name: point.name,
            lat: point.lat,
            lng: point.lng,
            color: point.color,
          },
        ]
      : [],
  );

  return (
    <Territory
      title={block.title}
      content={block.content}
      backgroundColor={block.backgroundColor}
      points={points}
    />
  );
}
