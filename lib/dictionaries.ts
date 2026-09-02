import { defaultLocale, type Locale } from "@/lib/i18n";

import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";
import pt from "./dictionaries/pt.json";

/** UI chrome strings (not CMS content). One dictionary per locale, same shape. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, es, pt };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
