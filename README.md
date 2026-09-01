# FAROL — UNDP Initiatives

A site showcasing initiatives for the UN UNDP programme. Content is fully managed in Sanity CMS; the Next.js frontend renders it statically at build time.

## Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Sanity](https://www.sanity.io/) CMS, Studio embedded at `/studio`
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) for primitives
- Hosted on [Vercel](https://vercel.com/)

See [`docs/architecture.md`](docs/architecture.md) for how content, rendering, and i18n fit together.

## Pages

Pages are created in Sanity, not hardcoded as routes — publishing a `page` document with a slug makes it live at `/en/<slug>` automatically (see [`docs/architecture.md`](docs/architecture.md#routing-pages-are-created-from-the-cms)). The initial content is:

- Home (`/en`)
- Initiatives (`/en/initiatives`)
- Results (`/en/results`)
- Collaborate (`/en/collaborate`)

English is the only supported locale today; routes are locale-prefixed (`/en/...`) so additional languages can be added without a URL migration. Each page also carries its own SEO metadata (title, description, OG image), editable in Sanity.

## Getting started

### Prerequisites

- Node.js (LTS)
- [pnpm](https://pnpm.io/)
- A Sanity account (`npx sanity login` if you don't have the CLI set up)

### Setup

```bash
pnpm install
```

Create a `.env.local` with your Sanity project details:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

If you don't have a Sanity project yet, create one from the repo root:

```bash
npx sanity init
```

### Run locally

```bash
pnpm dev
```

The site runs at `http://localhost:3000`, the embedded Sanity Studio at `http://localhost:3000/studio`.

### Build

```bash
pnpm build
```

Pages are statically generated at build time. In production, publishing content in Sanity triggers a rebuild via a webhook — see [`docs/architecture.md`](docs/architecture.md#publish-workflow).
