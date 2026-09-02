import { notFound } from "next/navigation";

import { Blocks } from "@/components/blocks";
import { getAllPageSlugs, getPageBySlug } from "@/lib/sanity/queries";

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map(({ slug }) => ({
    slug: slug ? slug.split("/").filter(Boolean) : [],
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { slug } = await params;
  const urlSlug = slug?.join("/") ?? "";
  const page = await getPageBySlug(urlSlug);

  if (!page) {
    notFound();
  }

  return <Blocks sections={page.sections ?? []} />;
}
