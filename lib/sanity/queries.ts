import type { QueryParams } from "next-sanity";

import { defaultLocale, type Locale } from "@/lib/i18n";

import { client } from "./client";

export interface NavLink {
  _key: string;
  label: string;
  url: string;
  type: "external" | "internal";
}

export interface SanityImage {
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  lqip?: string;
  dimensions?: { width: number; height: number; aspectRatio: number };
}

export interface HeroSection {
  _key: string;
  _type: "hero";
  title: string;
  content?: string;
  image?: SanityImage;
  imagePosition: "left" | "right";
  backgroundColor?: string;
}

export interface BannerSection {
  _key: string;
  _type: "banner";
  title: string;
  content?: string;
  backgroundColor?: string;
}

export interface PlaceholderSection {
  _key: string;
  _type: "blockPlaceholder";
  title?: string;
  body?: string;
}

export type PageSection = HeroSection | BannerSection | PlaceholderSection;

export interface PageData {
  _id: string;
  name: string;
  slug: string;
  language: string;
  /** True when the requested locale had no page and the default locale was used. */
  isFallback: boolean;
  showNavbar: boolean;
  sections: PageSection[];
}

/**
 * Wraps client.fetch so a Sanity outage or misconfigured project (e.g. no
 * project set up yet) degrades to "no data" instead of crashing the page.
 */
async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    console.error("[sanity] fetch failed:", error);
    return null;
  }
}

export async function getGlobalSiteName(
  locale: Locale = defaultLocale,
): Promise<string | null> {
  return sanityFetch<string>(
    `*[_type == "global"][0]{
      "value": coalesce(
        siteName[_key == $locale][0].value,
        siteName[_key == $fallback][0].value,
        siteName[0].value
      )
    }.value`,
    { locale, fallback: defaultLocale },
  );
}

interface RawNavItem {
  _key: string;
  kind?: "pageData" | "link";
  slug?: string;
  url?: string;
  linkType?: "external" | "internal";
  label?: string;
}

export async function getGlobalNav(
  locale: Locale = defaultLocale,
): Promise<NavLink[]> {
  const raw =
    (await sanityFetch<RawNavItem[]>(
      `*[_type == "global"][0].navLinks[]{
        _key,
        "kind": @->_type,
        @->_type == "pageData" => { "slug": @->urlSlug.current },
        @->_type == "link" => {
          "url": @->url,
          "linkType": @->type,
          "label": coalesce(
            @->label[_key == $locale][0].value,
            @->label[_key == $fallback][0].value,
            @->label[0].value
          )
        }
      }`,
      { locale, fallback: defaultLocale },
    )) ?? [];

  // Internal links point at one locale's page document; resolve the label from
  // the current locale's translation, matched by the (shared) slug.
  const internalSlugs = raw
    .filter((item) => item.kind === "pageData" && item.slug)
    .map((item) => item.slug as string);

  const localizedNames = internalSlugs.length
    ? ((await sanityFetch<{ slug: string; name: string }[]>(
        `*[_type == "pageData" && language == $locale && urlSlug.current in $slugs]{
          "slug": urlSlug.current,
          name
        }`,
        { locale, slugs: internalSlugs },
      )) ?? [])
    : [];
  const nameBySlug = new Map(localizedNames.map((n) => [n.slug, n.name]));

  return raw.flatMap((item): NavLink[] => {
    if (item.kind === "pageData" && item.slug) {
      return [
        {
          _key: item._key,
          label: nameBySlug.get(item.slug) ?? item.slug,
          url: `/${item.slug}`,
          type: "internal",
        },
      ];
    }
    if (item.kind === "link" && item.url) {
      return [
        {
          _key: item._key,
          label: item.label ?? item.url,
          url: item.url,
          type: item.linkType === "external" ? "external" : "internal",
        },
      ];
    }
    return [];
  });
}

export interface ThemeColors {
  backgroundColor?: string;
  frontColor?: string;
  buttonColor?: string;
  secondaryButtonColor?: string;
  navbarColor?: string;
}

export async function getGlobalTheme(): Promise<ThemeColors | null> {
  return sanityFetch<ThemeColors>(
    `*[_type == "global"][0].theme->{
      "backgroundColor": backgroundColor->value.hex,
      "frontColor": frontColor->value.hex,
      "buttonColor": buttonColor->value.hex,
      "secondaryButtonColor": secondaryButtonColor->value.hex,
      "navbarColor": navbarColor->value.hex
    }`,
  );
}

export async function getAllPageSlugs(): Promise<
  { slug: string; language: string }[]
> {
  const slugs = await sanityFetch<{ slug: string; language: string }[]>(
    `*[_type == "pageData" && defined(urlSlug.current) && defined(language)] {
      "slug": urlSlug.current,
      language
    }`,
  );
  return slugs ?? [];
}

export async function getPageBySlug(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<PageData | null> {
  // Prefer the requested locale; fall back to the default locale's version so an
  // untranslated page still renders (with a "fell back" flag) instead of 404ing.
  return sanityFetch<PageData>(
    `*[_type == "pageData" && urlSlug.current == $slug && language in [$locale, $fallback]]
      | order(select(language == $locale => 0, 1))[0] {
      _id,
      name,
      language,
      "isFallback": language != $locale,
      "slug": urlSlug.current,
      showNavbar,
      sections[]{
        _key,
        _type,
        _type == "hero" => {
          title,
          content,
          imagePosition,
          "backgroundColor": backgroundColor->value.hex,
          image{
            ...,
            "lqip": asset->metadata.lqip,
            "dimensions": asset->metadata.dimensions
          }
        },
        _type == "banner" => {
          title,
          content,
          "backgroundColor": backgroundColor->value.hex,
        },
        _type == "blockPlaceholder" => {
          title,
          body
        }
      }
    }`,
    { slug, locale, fallback: defaultLocale },
  );
}
