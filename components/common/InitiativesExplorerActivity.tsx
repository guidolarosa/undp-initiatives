import Image from "next/image";

import type { ExplorerActivity } from "@/components/common/InitiativesExplorerTypes";

export function ActivityEntry({
  activity,
  readMoreLabel,
}: {
  activity: ExplorerActivity;
  readMoreLabel: string;
}) {
  return (
    <li className="border-t px-4 py-4 first:border-t-0">
      <div className="flex items-center justify-between gap-2">
        <time dateTime={activity.date} className="text-sm">
          {new Date(activity.date).toLocaleDateString(undefined, {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })}
        </time>
        {activity.category && (
          <span className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs">
            {activity.category}
          </span>
        )}
      </div>
      {activity.image && (
        <div className="relative mt-3 aspect-[2/1] w-full overflow-hidden rounded-xl">
          <Image
            src={activity.image.src}
            alt={activity.image.alt}
            fill
            placeholder={activity.image.blurDataURL ? "blur" : undefined}
            blurDataURL={activity.image.blurDataURL}
            className="object-cover"
          />
        </div>
      )}
      <p className="mt-3 text-sm font-medium">{activity.name}</p>
      {activity.url && (
        <a
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm underline underline-offset-2"
        >
          {readMoreLabel}
        </a>
      )}
    </li>
  );
}
