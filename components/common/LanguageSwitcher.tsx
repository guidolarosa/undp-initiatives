"use client";

import { usePathname, useRouter } from "next/navigation";

import { locales, localeLabels, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${nextLocale}${rest ? `/${rest}` : ""}`);
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label="Select language"
      className="rounded-md text-sm"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {localeLabels[l]}
        </option>
      ))}
    </select>
  );
}
