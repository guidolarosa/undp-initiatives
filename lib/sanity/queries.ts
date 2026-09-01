import type { QueryParams } from "next-sanity";

import { client } from "./client";

export interface NavLink {
  _key: string;
  label: string;
  url: string;
  type: "external" | "internal";
}

export interface PageSection {
  _key: string;
  _type: string;
  title?: string;
  body?: string;
}

export interface PageData {
  _id: string;
  name: string;
  slug: string;
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

export async function getGlobalNav(): Promise<NavLink[]> {
  const links = await sanityFetch<NavLink[]>(
    `*[_type == "global"][0].navLinks[]{
      _key,
      "label": select(
        @->_type == "pageData" => @->name,
        @->_type == "link" => @->label
      ),
      "url": select(
        @->_type == "pageData" => "/" + @->urlSlug.current,
        @->_type == "link" => @->url
      ),
      "type": select(
        @->_type == "pageData" => "internal",
        @->_type == "link" => @->type
      )
    }`,
  );
  return links ?? [];
}

export interface ThemeColors {
  backgroundColor?: string;
  frontColor?: string;
  buttonColor?: string;
  secondaryButtonColor?: string;
}

export async function getGlobalTheme(): Promise<ThemeColors | null> {
  return sanityFetch<ThemeColors>(
    `*[_type == "global"][0].theme->{
      "backgroundColor": backgroundColor->value.hex,
      "frontColor": frontColor->value.hex,
      "buttonColor": buttonColor->value.hex,
      "secondaryButtonColor": secondaryButtonColor->value.hex
    }`,
  );
}

export async function getAllPageSlugs(): Promise<{ slug: string }[]> {
  const slugs = await sanityFetch<{ slug: string }[]>(
    `*[_type == "pageData" && defined(urlSlug.current)] {
      "slug": urlSlug.current
    }`,
  );
  return slugs ?? [];
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  return sanityFetch<PageData>(
    `*[_type == "pageData" && urlSlug.current == $slug][0] {
      _id,
      name,
      "slug": urlSlug.current,
      showNavbar,
      sections
    }`,
    { slug },
  );
}
