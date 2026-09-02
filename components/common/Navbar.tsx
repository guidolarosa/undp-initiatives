import Link from "next/link";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NavLinks } from "@/components/common/NavLinks";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getGlobalNav, getGlobalSiteName } from "@/lib/sanity/queries";
import Image from "next/image";

export async function Navbar({ locale }: { locale: Locale }) {
  const [navLinks, siteName] = await Promise.all([
    getGlobalNav(locale),
    getGlobalSiteName(locale),
  ]);
  const dict = getDictionary(locale);
  return (
    <header className="border-b border-border bg-navbar">
      <nav className="mx-auto flex max-w-296.25 items-end justify-between gap-6 px-6 pb-4">
        <div className="h-22.5 w-11.25 relative">
          <Image
            src="/img/undp_logo.png"
            alt="UNDP"
            fill
            className="object-contain object-top"
          />
        </div>
        <div className="flex items-end gap-6 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-15 aspect-square bg-[#2E2E2E] rounded-full"></div>
            <div>
              <Link
                href={`/${locale}/home`}
                className="font-semibold tracking-tight text-[33px] leading-none"
              >
                {siteName}
              </Link>
              <p className="text-sm text-muted-foreground">
                {dict.nav.tagline}
              </p>
            </div>
          </div>
          <NavLinks
            links={navLinks}
            locale={locale}
            emptyLabel={dict.nav.emptyLinks}
          />
        </div>
        <div className="text-2xl leading-none">🇸🇹</div>
        <LanguageSwitcher
          locale={locale}
          label={dict.languageSwitcher.label}
        />
      </nav>
    </header>
  );
}
