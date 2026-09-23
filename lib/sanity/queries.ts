import type { PortableTextBlock } from "@portabletext/react";
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

export interface FocusArea {
  _key: string;
  name: string;
  description?: string;
  backgroundColor?: string;
}

export interface FocusAreasListSection {
  _key: string;
  _type: "focusAreasList";
  title: string;
  focusAreas: FocusArea[];
}

export interface Link {
  _key: string;
  label: string;
  url: string;
  type: "external" | "internal";
  color: string;
}

export interface LowerLinksSection {
  _key: string;
  _type: "lowerLinks";
  title: string;
  content?: string;
  links: Link[];
}

export interface CTABannerSection {
  _key: string;
  _type: "ctaBanner";
  title: string;
  content?: string;
  backgroundColor?: string;
  cta: Link;
}

export interface PortfolioApproachSection {
  _key: string;
  _type: "portfolioApproach";
  title: string;
  /** Rich text (Sanity `array of block`) — render with components/common/PortableText. */
  content?: PortableTextBlock[];
  portfolioApproachCards: PortfolioApproachCard[];
}

export interface PortfolioApproachCard {
  _key: string;
  title: string;
  content?: string;
  image: SanityImage;
  backgroundColor?: string;
}

export interface Experience {
  _key: string;
  content: string;
  author: string;
  role: string;
}

export interface ExperiencesSection {
  _key: string;
  _type: "experiences";
  title: string;
  content?: string;
  experiences: Experience[];
}

export interface NewsItem {
  _key: string;
  title: string;
  date: string;
  category?: string;
  url: string;
  backgroundColor?: string;
  image?: SanityImage;
}

export interface NewsListSection {
  _key: string;
  _type: "newsList";
  title: string;
  content?: string;
  news: NewsItem[];
  cta: Link;
}

export interface StatCard {
  _key: string;
  title: string;
  content?: string;
  color?: string;
}

export interface StatsSection {
  _key: string;
  _type: "stats";
  title: string;
  content?: string;
  backgroundColor?: string;
  cards: StatCard[];
}

export interface PlaceholderSection {
  _key: string;
  _type: "blockPlaceholder";
  title?: string;
  body?: string;
}

export type PageSection =
  | HeroSection
  | BannerSection
  | FocusAreasListSection
  | LowerLinksSection
  | CTABannerSection
  | PortfolioApproachSection
  | ExperiencesSection
  | NewsListSection
  | StatsSection
  | PlaceholderSection;

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
        siteName[language == $locale][0].value,
        siteName[language == $fallback][0].value,
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
            @->label[language == $locale][0].value,
            @->label[language == $fallback][0].value,
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
  footerBackgroundColor?: string;
  green?: string;
}

export async function getGlobalTheme(): Promise<ThemeColors | null> {
  return sanityFetch<ThemeColors>(
    `*[_type == "global"][0].theme->{
      "backgroundColor": backgroundColor->value.hex,
      "frontColor": frontColor->value.hex,
      "buttonColor": buttonColor->value.hex,
      "secondaryButtonColor": secondaryButtonColor->value.hex,
      "navbarColor": navbarColor->value.hex,
      "footerBackgroundColor": footerBackgroundColor->value.hex,
      "green": green->value.hex
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

export interface Actor {
  _id: string;
  name: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
  type: ["implementer", "cofounder"];
  showInFooter: boolean;
}

export async function getActors(): Promise<Actor[]> {
  const actors = await sanityFetch<Actor[]>(
    `*[_type == "actors" && showInFooter == true] {
      _id,
      name,
      image{
        ...,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions
      },
      type,
      showInFooter
    }`,
  );
  return actors ?? [];
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
        _type == "focusAreasList" => {
          title,
          // "arr[]->{...}" dereferences and loses the array item's own _key
          // (React list key) — project via "@->" instead to keep it.
          focusAreas[]{
            _key,
            "name": @->name,
            "description": @->description,
            "backgroundColor": @->backgroundColor->value.hex
          }
        },
        _type == "lowerLinks" => {
          title,
          content,
          links[]{
            _key,
            "label": coalesce(
              @->label[language == $locale][0].value,
              @->label[language == $fallback][0].value,
              @->label[0].value
            ),
            "url": @->url,
            "type": @->type,
            "color": @->color->value.hex
          }
        },
        _type == "ctaBanner" => {
          title,
          content,
          "backgroundColor": backgroundColor->value.hex,
          cta{
            "label": coalesce(
              @->label[language == $locale][0].value,
              @->label[language == $fallback][0].value,
              @->label[0].value
            ),
            "url": @->url,
            "type": @->type,
            "color": @->color->value.hex
          }
        },
        _type == "experiences" => {
          title,
          content,
          experiences[]{
            _key,
            "content": @->content,
            "author": @->author,
            "role": @->role
          }
        },
        _type == "portfolioApproach" => {
          title,
          content,
          // Cards are inline objects, not references — no "@->" here.
          portfolioApproachCards[]{
            _key,
            title,
            content,
            "backgroundColor": backgroundColor->value.hex,
            image{
              ...,
              "lqip": asset->metadata.lqip,
              "dimensions": asset->metadata.dimensions
            }
          }
        },
        _type == "newsList" => {
          title,
          content,
          // Rendered newest first, regardless of the order items were added
          // to the list in Studio.
          "news": news[]{
            _key,
            "title": @->title,
            "date": @->date,
            "category": coalesce(
              @->category->label[language == $locale][0].value,
              @->category->label[language == $fallback][0].value,
              @->category->label[0].value
            ),
            "url": @->url,
            "backgroundColor": @->backgroundColor->value.hex,
            "image": @->image{
              ...,
              "lqip": asset->metadata.lqip,
              "dimensions": asset->metadata.dimensions
            }
          } | order(date desc),
          cta{
            "label": coalesce(
              @->label[language == $locale][0].value,
              @->label[language == $fallback][0].value,
              @->label[0].value
            ),
            "url": @->url,
            "type": @->type,
            "color": @->color->value.hex
          }
        },
        _type == "stats" => {
          title,
          content,
          "backgroundColor": backgroundColor->value.hex,
          // Cards are inline objects, not references — no "@->" here.
          cards[]{
            _key,
            title,
            content,
            "color": color->value.hex
          }
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
