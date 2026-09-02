import { notFound, redirect } from "next/navigation";

import { Blocks } from "@/components/blocks";
import { isLocale } from "@/lib/i18n";
import { getAllPageSlugs, getPageBySlug } from "@/lib/sanity/queries";

export async function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const pages = await getAllPageSlugs();
  return pages
    .filter((page) => page.language === locale)
    .map((page) => ({
      slug: page.slug ? page.slug.split("/").filter(Boolean) : [],
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

  return <Blocks sections={page.sections ?? []} />;
}
