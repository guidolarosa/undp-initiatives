import Link from "next/link";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import type { Locale } from "@/lib/i18n";
import { getGlobalNav } from "@/lib/sanity/queries";

export async function Navbar({ locale }: { locale: Locale }) {
  const navLinks = await getGlobalNav();

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="font-semibold tracking-tight">
            FAROL
          </Link>
          <ul className="flex items-center gap-4 text-sm">
            {navLinks.length === 0 && (
              <li className="text-muted-foreground">No navigation links set</li>
            )}
            {navLinks.map((link) =>
              link.type === "external" ? (
                <li key={link._key}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link._key}>
                  <Link
                    href={`/${locale}${link.url}`}
                    className="text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
        <LanguageSwitcher locale={locale} />
      </nav>
    </header>
  );
}
