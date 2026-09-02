export const locales = ["en", "es", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Shape the Sanity i18n plugins (`@sanity/document-internationalization`,
 * `sanity-plugin-internationalized-array`) expect: `{ id, title }` per language.
 * Kept in sync with `locales` so Studio and the app never disagree.
 */
export const languages = locales.map((id) => ({
  id,
  title: localeLabels[id],
}));
