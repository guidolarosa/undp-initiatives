import { notFound } from "next/navigation";

import { Navbar } from "@/components/common/Navbar";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
