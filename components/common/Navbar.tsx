import Link from "next/link";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NavLinks } from "@/components/common/NavLinks";
import type { Locale } from "@/lib/i18n";
import { getGlobalNav, getGlobalSiteName } from "@/lib/sanity/queries";
import Image from "next/image";

export async function Navbar({ locale }: { locale: Locale }) {
  const navLinks = await getGlobalNav();
  const siteName = await getGlobalSiteName();
  return (
    <header className="border-b border-border bg-navbar">
      <nav className="mx-auto flex max-w-5xl items-end justify-between gap-6 px-6 pb-4">
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
                href={`/${locale}`}
                className="font-semibold tracking-tight text-[33px] leading-none"
              >
                {siteName}
              </Link>
              <p className="text-sm text-muted-foreground">
                Policy Inteligence
              </p>
            </div>
          </div>
          <NavLinks links={navLinks} locale={locale} />
        </div>
        <div className="text-2xl leading-none">🇸🇹</div>
        <LanguageSwitcher locale={locale} />
      </nav>
    </header>
  );
}
