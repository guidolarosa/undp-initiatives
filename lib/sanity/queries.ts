import type { QueryParams } from "next-sanity";

import { client } from "./client";

export interface NavPage {
  name: string;
  slug: string;
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

export async function getNavPages(): Promise<NavPage[]> {
  const pages = await sanityFetch<NavPage[]>(
    `*[_type == "pageData" && showNavbar == true] | order(name asc) {
      name,
      "slug": urlSlug.current
    }`,
  );
  return pages ?? [];
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
