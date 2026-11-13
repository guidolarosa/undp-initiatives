"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NavLinks } from "@/components/common/NavLinks";
import type { Locale } from "@/lib/i18n";
import type { NavLink } from "@/lib/sanity/queries";

export function MobileNav({
  links,
  locale,
  emptyLabel,
  languageSwitcherLabel,
}: {
  links: NavLink[];
  locale: Locale;
  emptyLabel: string;
  languageSwitcherLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex items-center justify-center p-2"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 z-50 flex flex-col gap-6 border-b border-border bg-navbar px-4 py-6 shadow-lg">
          <NavLinks
            links={links}
            locale={locale}
            emptyLabel={emptyLabel}
            vertical
            onLinkClick={() => setOpen(false)}
          />
          <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
            <LanguageSwitcher locale={locale} label={languageSwitcherLabel} />
            <span className="text-2xl leading-none">🇸🇹</span>
          </div>
        </div>
      )}
    </div>
  );
}
