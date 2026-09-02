import { notFound, redirect } from "next/navigation";

import { Blocks } from "@/components/blocks";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { getAllPageSlugs, getPageBySlug } from "@/lib/sanity/queries";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const pages = await getAllPageSlugs();
  // Prerender every slug that exists in this locale OR in the default locale
  // (those render via the fallback in getPageBySlug).
  const slugs = new Set(
    pages
      .filter(
        (page) => page.language === locale || page.language === defaultLocale,
      )
      .map((page) => page.slug),
  );
  return [...slugs].map((slug) => ({
    slug: slug ? slug.split("/").filter(Boolean) : [],
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const urlSlug = slug?.join("/") ?? "";
  if (!urlSlug) {
    redirect(`/${locale}/home`);
  }

  const page = await getPageBySlug(urlSlug, locale);

  if (!page) {
    notFound();
  }

  return (
    <>
      {page.isFallback && (
        <p className="bg-muted px-6 py-2 text-center text-sm text-muted-foreground">
          {getDictionary(locale).fallbackNotice}
        </p>
      )}
      <Blocks sections={page.sections ?? []} />
    </>
  );
}
