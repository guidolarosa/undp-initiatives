/**
 * One-off: six published Intervention documents exist in Sanity with no
 * `language` field set (created outside the document-internationalization
 * "duplicate for translation" flow), so the locale-filtered query on the
 * Initiatives page (`language == $locale`) silently excludes them. Confirmed
 * these aren't part of any translation group and have complete content —
 * stamping them "en" is the same fix already applied to pageData docs by
 * scripts/migrate-to-i18n.ts. Run once, then delete this file.
 *
 *   pnpm exec sanity exec scripts/stamp-intervention-language.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const IDS = [
  "11fdabcf-f06e-40df-a48b-117db0aa455d", // Unlocking the Potential of the Business Environment
  "53be6c8d-2145-4bb9-bb09-2e467c5296d8", // Parenting Education Program (PEP)
  "66f100b2-62c0-492c-9e22-4a7b5f626e87", // National Youth Council
  "920390af-41a8-4a44-8b3f-4511dc200f13", // Prosperity - Inclusive Growth
  "ae1d6a90-a322-44b8-96a6-06bf53d58246", // Running for the Flag
  "d96a6b8d-dd11-48c3-8025-58fc4d265d1b", // Maternal and child nutritional monitoring program
];

const client = getCliClient({ apiVersion: "2024-01-01" });

async function main() {
  const tx = client.transaction();
  for (const id of IDS) {
    tx.patch(id, { set: { language: "en" } });
  }
  const result = await tx.commit();
  console.log("Stamped language=en on", result.results.length, "documents");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
