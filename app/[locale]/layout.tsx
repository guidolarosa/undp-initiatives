import type { CSSProperties } from "react";

import type { Metadata } from "next";
import { Geist_Mono, Mulish } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import { Navbar } from "@/components/common/Navbar";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";
import { getGlobalSiteName, getGlobalTheme } from "@/lib/sanity/queries";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteName = await getGlobalSiteName(
    isLocale(locale) ? locale : defaultLocale,
  );
  return {
    title: `${siteName?.toUpperCase() ?? "FAROL"} — UNDP Initiatives`,
    description: "Showcasing initiatives for the UN UNDP programme.",
  };
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
    <html
      lang={locale}
      className={`${mulish.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div
          style={themeStyle}
          className="flex min-h-full flex-1 flex-col bg-background"
        >
          <Navbar locale={locale} />
          <main className="flex-1 pt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
