/**
 * One-off migration to move the existing single-language content onto the i18n
 * setup (@sanity/document-internationalization + internationalized arrays).
 *
 *   1. Stamp every existing `pageData` document with `language: "en"` — the
 *      four originals (Home, Initiatives, Results, Collaborate) become the
 *      English base versions.
 *   2. Convert `global.siteName` from a plain string to an internationalized
 *      array (the "en" entry keeps the current value).
 *   3. Convert any `link.label` strings the same way.
 *   4. Remove the leftovers of a mis-clicked "create translation" in Studio:
 *      every `translation.metadata` doc, plus page drafts that were never
 *      published. (No real translations exist yet — create them from the
 *      Translations menu in Studio after this runs.)
 *
 * Idempotent. Run it with your Studio login (no API token needed):
 *
 *   pnpm exec sanity exec scripts/migrate-to-i18n.ts --with-user-token
 *
 * Add `-- --dry-run` to preview without writing.
 */
import { getCliClient } from "sanity/cli";

const DEFAULT_LOCALE = "en";
const dryRun = process.argv.includes("--dry-run");

const client = getCliClient({ apiVersion: "2024-01-01" });

function toIntlArrayString(value: string) {
  return [
    { _key: DEFAULT_LOCALE, _type: "internationalizedArrayStringValue", value },
  ];
}

async function run() {
  const tx = client.transaction();
  let changes = 0;

  // 1. pageData.language — every existing page is the English base.
  const pages: { _id: string; name: string; language: string | null }[] =
    await client.fetch(
      `*[_type == "pageData" && !(_id in path("drafts.**"))]{ _id, name, language }`,
    );
  for (const page of pages) {
    if (page.language === DEFAULT_LOCALE) continue;
    console.log(
      `pageData "${page.name}" (${page.language ?? "unset"}) -> language: ${DEFAULT_LOCALE}`,
    );
    tx.patch(page._id, { set: { language: DEFAULT_LOCALE } });
    changes++;
  }

  // 2. global.siteName -> internationalized array
  const global: { _id: string; siteName: unknown } | null = await client.fetch(
    `*[_type == "global" && !(_id in path("drafts.**"))][0]{ _id, siteName }`,
  );
  if (global && typeof global.siteName === "string") {
    console.log(`global.siteName "${global.siteName}" -> internationalized array`);
    tx.patch(global._id, {
      set: { siteName: toIntlArrayString(global.siteName) },
    });
    changes++;
  }

  // 3. link.label -> internationalized array
  const links: { _id: string; label: unknown }[] = await client.fetch(
    `*[_type == "link" && !(_id in path("drafts.**"))]{ _id, label }`,
  );
  for (const link of links) {
    if (typeof link.label === "string") {
      console.log(`link.label "${link.label}" -> internationalized array`);
      tx.patch(link._id, { set: { label: toIntlArrayString(link.label) } });
      changes++;
    }
  }

  // 4. Drop premature translation metadata + unpublished page drafts.
  const metas: string[] = await client.fetch(
    `*[_type == "translation.metadata"]._id`,
  );
  for (const id of metas) {
    console.log(`translation.metadata ${id} -> delete (premature)`);
    tx.delete(id);
    changes++;
  }

  const publishedIds: string[] = await client.fetch(
    `*[_type == "pageData" && !(_id in path("drafts.**"))]._id`,
  );
  const draftPages: { _id: string; name: string }[] = await client.fetch(
    `*[_type == "pageData" && _id in path("drafts.**")]{ _id, name }`,
  );
  const publishedSet = new Set(publishedIds);
  for (const draft of draftPages) {
    if (publishedSet.has(draft._id.replace(/^drafts\./, ""))) continue;
    console.log(`draft "${draft.name}" ${draft._id} -> delete (never published)`);
    tx.delete(draft._id);
    changes++;
  }

  if (changes === 0) {
    console.log("Nothing to migrate — already up to date.");
    return;
  }
  if (dryRun) {
    console.log(`\nDry run — ${changes} change(s) NOT committed.`);
    return;
  }

  await tx.commit();
  console.log(`\nDone. ${changes} change(s) committed.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
