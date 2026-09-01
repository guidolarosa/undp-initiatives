import Link from "next/link";

import { getNavPages } from "@/lib/sanity/queries";

export async function Navbar({ locale }: { locale: string }) {
  const pages = await getNavPages();

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <Link href={`/${locale}`} className="font-semibold tracking-tight">
          FAROL
        </Link>
        <ul className="flex items-center gap-4 text-sm">
          {pages.length === 0 && (
            <li className="text-muted-foreground">No pages published yet</li>
          )}
          {pages.map((page) => (
            <li key={page.slug}>
              <Link
                href={`/${locale}/${page.slug}`}
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
