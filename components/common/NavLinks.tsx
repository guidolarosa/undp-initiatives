"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import type { NavLink } from "@/lib/sanity/queries";

export function NavLinks({
  links,
  locale,
  emptyLabel,
  vertical = false,
  onLinkClick,
}: {
  links: NavLink[];
  locale: Locale;
  emptyLabel: string;
  /** Stacked, left-aligned list for the mobile menu panel instead of the desktop horizontal row. */
  vertical?: boolean;
  /** Called when a link is clicked — the mobile menu panel uses this to close itself. */
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        "flex gap-4 text-base",
        vertical
          ? "flex-col items-start"
          : "ml-auto flex-1 items-center justify-end",
      )}
    >
      {links.length === 0 && (
        <li className="text-muted-foreground">{emptyLabel}</li>
      )}
      {links.map((link) => {
        if (link.type === "external") {
          return (
            <li key={link._key}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onLinkClick}
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
              onClick={onLinkClick}
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
