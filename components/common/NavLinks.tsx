"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import type { NavLink } from "@/lib/sanity/queries";

export function NavLinks({
  links,
  locale,
}: {
  links: NavLink[];
  locale: Locale;
}) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-4 text-sm ml-auto flex-1 justify-end">
      {links.length === 0 && (
        <li className="text-muted-foreground">No navigation links set</li>
      )}
      {links.map((link) => {
        if (link.type === "external") {
          return (
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
          );
        }

        const href = `/${locale}${link.url}`;
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <li key={link._key}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-foreground underline underline-offset-4"
                  : "text-foreground/80 transition-colors hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
