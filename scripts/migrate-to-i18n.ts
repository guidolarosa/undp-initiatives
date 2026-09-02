/**
 * One-off migration: make the existing single-language content compatible with
 * the i18n setup (@sanity/document-internationalization + internationalized
 * arrays).
 *
 *   1. Stamp every existing `pageData` document with `language: "en"` so it
 *      becomes the English version.
 *   2. Convert `global.siteName` from a plain string to an internationalized
 *      array (the "en" entry keeps the current value).
 *   3. Convert any `link.label` strings the same way.
 *
 * Idempotent — safe to re-run. Reads NEXT_PUBLIC_SANITY_* from .env.local.
 *
 *   SANITY_API_WRITE_TOKEN=xxx pnpm migrate:i18n
 *
 * Get a write token at https://sanity.io/manage → API → Tokens (Editor role).
 */
import { readFileSync } from "node:fs";

import { createClient } from "@sanity/client";

// This script runs outside Next, so load .env.local ourselves.
try {
  for (const line of readFileSync(
    new URL("../.env.local", import.meta.url),
    "utf8",
  ).split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // no .env.local — rely on the ambient environment
}

const DEFAULT_LOCALE = "en";

const token = process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN environment variable.");
  process.exit(1);
}
if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

function toIntlArrayString(value: string) {
  return [
    {
      _key: DEFAULT_LOCALE,
      _type: "internationalizedArrayStringValue",
      value,
    },
  ];
}

async function run() {
  const tx = client.transaction();
  let changes = 0;

  const pages: { _id: string; name: string }[] = await client.fetch(
    `*[_type == "pageData" && !defined(language)]{ _id, name }`,
  );
  for (const page of pages) {
    console.log(`pageData "${page.name}" -> language: ${DEFAULT_LOCALE}`);
    tx.patch(page._id, { set: { language: DEFAULT_LOCALE } });
    changes++;
  }

  const global: { _id: string; siteName: unknown } | null = await client.fetch(
    `*[_type == "global"][0]{ _id, siteName }`,
  );
  if (global && typeof global.siteName === "string") {
    console.log(
      `global.siteName "${global.siteName}" -> internationalized array`,
    );
    tx.patch(global._id, {
      set: { siteName: toIntlArrayString(global.siteName) },
    });
    changes++;
  }

  const links: { _id: string; label: unknown }[] = await client.fetch(
    `*[_type == "link"]{ _id, label }`,
  );
  for (const link of links) {
    if (typeof link.label === "string") {
      console.log(`link.label "${link.label}" -> internationalized array`);
      tx.patch(link._id, { set: { label: toIntlArrayString(link.label) } });
      changes++;
    }
  }

  if (changes === 0) {
    console.log("Nothing to migrate — already up to date.");
    return;
  }

  await tx.commit();
  console.log(`\nDone. ${changes} document(s) patched.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
