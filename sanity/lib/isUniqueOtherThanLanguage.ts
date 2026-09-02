import type { SlugValidationContext } from "sanity";

/**
 * Slug uniqueness check that ignores documents in other languages, so the same
 * slug (e.g. `home`) can exist once per locale when pages are translated with
 * `@sanity/document-internationalization`.
 */
export async function isUniqueOtherThanLanguage(
  slug: string,
  context: SlugValidationContext,
): Promise<boolean> {
  const { document, getClient } = context;

  if (!document?.language) {
    return true;
  }

  const client = getClient({ apiVersion: "2024-01-01" });
  const id = document._id.replace(/^drafts\./, "");
  const params = {
    draft: `drafts.${id}`,
    published: id,
    language: document.language,
    slug,
  };
  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    urlSlug.current == $slug &&
    language == $language
  ][0]._id)`;

  return client.fetch(query, params);
}
