import type { CSSProperties } from "react";

import { notFound } from "next/navigation";

import { Navbar } from "@/components/common/Navbar";
import { isLocale, locales } from "@/lib/i18n";
import { getGlobalTheme } from "@/lib/sanity/queries";

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

  const theme = await getGlobalTheme();
  const themeStyle: CSSProperties | undefined = theme
    ? ({
        "--background": theme.backgroundColor,
        "--foreground": theme.frontColor,
        "--navbar": theme.navbarColor,
        "--primary": theme.buttonColor,
        "--secondary": theme.secondaryButtonColor,
      } as CSSProperties)
    : undefined;

  return (
    <div style={themeStyle} className="flex min-h-full flex-1 flex-col bg-background">
      <Navbar locale={locale} />
      <main className="flex-1 pt-8">{children}</main>
    </div>
  );
}
