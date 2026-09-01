import { notFound } from "next/navigation";

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

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{page.name}</h1>
      <div className="mt-8 flex flex-col gap-6">
        {page.sections?.map((section) => (
          <section key={section._key}>
            {section.title && (
              <h2 className="text-xl font-medium">{section.title}</h2>
            )}
            {section.body && <p className="mt-2 text-foreground/80">{section.body}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
