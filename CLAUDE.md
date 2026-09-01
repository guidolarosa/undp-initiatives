# FAROL — UNDP Initiatives

CMS-driven site (Sanity + Next.js) showcasing UNDP initiatives. See [`docs/architecture.md`](docs/architecture.md) for the full design — this file is a short operating reference.

## Stack

TypeScript, Next.js (App Router), Tailwind, shadcn/ui, Sanity (Studio embedded at `/studio`), pnpm, deployed on Vercel.

## Key conventions

- **Pages are block-based**: page content is an array of typed Sanity blocks rendered via a `_type` → component registry in `components/blocks/`. Don't hardcode page layout — add a block type + component instead. Details: [`docs/architecture.md`](docs/architecture.md#content-model-block-based-page-builder).
- **Component folders**: `components/ui/` (shadcn primitives), `components/common/` (shared components like Hero, Navbar, Footer, LinkCard), `components/blocks/` (CMS block registry). Organized by role, not by page.
- **Rendering**: static generation at build time. Server Components by default; only use Client Components when something genuinely needs client-side data/state.
- **Routing**: locale-prefixed (`/en/...`) even though English is the only locale today. Don't add flat (non-prefixed) routes.
- **Pages are CMS-created, not hardcoded routes**: a single dynamic route (`app/[locale]/[[...slug]]`) resolves any Sanity `page` document by slug; `generateStaticParams` enumerates them at build time. `/studio` is reserved and lives outside this tree. Initial content: Home, Initiatives, Results, Collaborate. Details: [`docs/architecture.md`](docs/architecture.md#routing-pages-are-created-from-the-cms).
- **SEO**: every page has a shared `seo` object (title, description, OG image) mapped via `generateMetadata`. Details: [`docs/architecture.md`](docs/architecture.md#seo-metadata).

## Not yet set up

No `package.json`, Sanity schemas, or app scaffold exist yet — this repo currently only has docs and `INSTRUCTIONS.md`. Per-page content specs (what each page contains) are written separately by the project owner, not derived from this file.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
