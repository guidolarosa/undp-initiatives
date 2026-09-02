import { locale as rootLocale } from "next/root-params";

import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";

export default async function NotFound() {
  const resolved = await rootLocale().catch(() => undefined);
  const locale = resolved && isLocale(resolved) ? resolved : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        {dict.notFound.title}
      </h1>
      <p className="mt-2 text-foreground/80">{dict.notFound.body}</p>
    </div>
  );
}
