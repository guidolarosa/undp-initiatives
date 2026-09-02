# Architecture

FAROL is a CMS-driven site: the frontend's job is to render whatever structure editors compose in Sanity, not to encode page layout in application code.

## Content model: block-based page builder

Each page document in Sanity has an array field of typed content blocks (e.g. `hero`, `linkCardGrid`, `richText`). A page is just an ordered list of blocks — there is no per-page layout code.

Rendering works via a `_type` → component registry:

```
components/blocks/
  index.ts          # registry: maps Sanity _type to component
  Hero.tsx
  LinkCardGrid.tsx
  RichText.tsx
  ...
```

The page route fetches its document, then maps over the block array, looking up each block's component by `_type` and rendering it. Adding a new visual section to the site means adding a new block schema in Sanity plus a matching component in `components/blocks/` and registry entry — no page route changes required.

This is distinct from the site's other two component tiers:

- `components/ui/` — shadcn primitives, generated/vendored, not content-aware
- `components/common/` — shared, reusable components referenced across pages/blocks (Hero, Navbar, Footer, LinkCard). Blocks are often thin wrappers that pass Sanity data into one of these.

Each `page` document also has a `slug` field (used for routing, see below) and an `seo` object (see [SEO metadata](#seo-metadata)).

## Routing: pages are created from the CMS

Page *creation*, not just page content, is CMS-driven. Rather than one Next.js route per known page, there's a single dynamic route that resolves any `page` document by its slug:

```
app/
  studio/[[...tool]]/page.tsx     # Sanity Studio, unlocalized, outside the CMS-routing tree
  [locale]/
    [[...slug]]/page.tsx          # resolves a Sanity `page` document by slug and renders its blocks
```

- `generateStaticParams` queries Sanity for every published page's `{ locale, slug }` at build time, so each is statically generated — creating a page in Sanity and publishing it is enough for it to get a build and a URL, no code change or route file needed.
- An empty slug (`/en`) resolves to the page flagged as the homepage (e.g. a boolean `isHomepage` field on the `page` document, enforced unique in Studio) rather than a literal `"home"` slug.
- The 4 pages named in the project brief (Home, Initiatives, Results, Collaborate) are the initial content, not hardcoded routes — they're just the first 4 `page` documents an editor creates.
- Reserved paths — `studio`, and any future non-CMS routes — must be excluded from the catch-all, either by checking for collisions at build time or by placing them outside the `[locale]` segment as shown above.

## SEO metadata

Every `page` document has a shared `seo` object (title, description, OG image), reused across all pages via a single Sanity object schema rather than redefined per page type. Each route implements Next.js's `generateMetadata`, fetching the page document and mapping `seo` fields to `<title>`, meta description, and Open Graph tags — resolved at build time alongside the page content. If `seo.title` is empty, it falls back to the page's main title so editors aren't required to duplicate it.

## Sanity Studio

The Studio is embedded in the Next.js app at `/studio`, rather than deployed as a separate project. Single repo, single deploy, no cross-project CORS/versioning to manage. Schema definitions live alongside the app code (not yet scaffolded).

## Rendering strategy

Pages are statically generated at build time (no ISR/on-demand revalidation). Components render server-side by default; a component only becomes a Client Component when it has a specific need to read data or manage state on the client (e.g. an interactive filter). This keeps the CMS-driven pages as close to pure server rendering as possible.

## Publish workflow

Because rendering happens at build time, a content change in Sanity does not appear on the live site until a new build runs. This is handled via:

1. Editor publishes a document in Sanity Studio.
2. Sanity fires a webhook on publish.
3. The webhook hits a Vercel deploy hook.
4. Vercel rebuilds and redeploys the site with the new content.

This gives editors a normal "publish and it goes live" experience without a developer needing to trigger a redeploy manually. The webhook/deploy hook wiring is not yet configured — this describes the intended flow for when deployment is set up.

## Internationalization

Three locales ship: **English (default), Spanish, Portuguese**. Routing is locale-prefixed (`/en/...`, `/es/...`, `/pt/...`), part of the `[locale]/[[...slug]]` structure. The single source of truth for the locale list is `lib/i18n.ts` (`locales`, `defaultLocale`, `localeLabels`, and `languages` — the `{id,title}` shape the Sanity plugins want); `next.config.ts`, `sanity.config.ts`, and the routes all read from it.

**Redirects** (in `next.config.ts`): `/` and each bare `/<locale>` redirect to `/<locale>/home`.

**`<html lang>`**: the site's root layout lives at `app/[locale]/layout.tsx` (so `locale` is a Next *root param*), and Sanity Studio has its own minimal root layout at `app/studio/layout.tsx` — Studio must not inherit the site's Tailwind globals or fonts. There is no `app/layout.tsx`.

**Content localization — document-level.** Pages are block-based (nested block arrays), so field-level localization would make every block field a per-language object. Instead, `pageData` uses [`@sanity/document-internationalization`](https://github.com/sanity-io/document-internationalization): one `pageData` document per locale, carrying a `language` field, linked by a hidden `translation.metadata` document. Slugs are **shared across locales** (`/en/home` and `/es/home` both have slug `home`); `urlSlug` uniqueness is scoped by language (`sanity/lib/isUniqueOtherThanLanguage.ts`).

Short shared strings that aren't full documents — `global.siteName`, `link.label` — use **field-level** localization instead (`sanity-plugin-internationalized-array`, an array of `{_key: locale, value}`).

**Queries** (`lib/sanity/queries.ts`) take a `locale`: `getPageBySlug` filters `language == $locale`; `getGlobalNav` resolves each internal nav item's label from the current locale's page (matched by shared slug), falling back to the default locale.

**UI chrome strings** (not CMS content) — the 404 page, the navbar tagline — come from `lib/dictionaries/{en,es,pt}.json` via `getDictionary(locale)`.

**Adding a locale**: add it to `locales`/`localeLabels` in `lib/i18n.ts`, add a `lib/dictionaries/<locale>.json`, and create the translated `pageData` documents in Studio. No other code changes.

## Deployment

Hosted on Vercel. Chosen for first-party Next.js support and straightforward deploy-hook integration with Sanity webhooks (see [Publish workflow](#publish-workflow)).

## Conventions

- TypeScript throughout, including generated types from Sanity schemas
- Package manager: pnpm
- Component organization: by role (`ui/`, `common/`, `blocks/`), not by page — common components and blocks are shared across all pages, not owned by one route
