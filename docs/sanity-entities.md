# Sanity Entities

Working spec for Sanity schemas. New entities get added below following the template in
[Legend & template](#legend--template). See [`docs/architecture.md`](architecture.md) for how these
map onto the Next.js app.

## Legend & template

- **Kind** — one of:
  - `Singleton document` — exactly one instance ever exists (e.g. `Global`).
  - `Document` — a top-level Sanity document type; any number of instances; has its own list in Studio;
    can be referenced (`-> TypeName`) from other entities.
  - `Object` — embedded only; no independent list in Studio; always nested inline inside a parent field.
  - `Object (Block variant)` — an object type registered into `PageData.sections` (see
    [Block Schemas](#block-schemas)).
- **Field type notation**:
  - `-> TypeName` = reference to a document of that type.
  - `Array<X>` = array field, each item of type `X` (which may itself be a reference).
  - `[option-a, option-b]` = fixed-option `select` field, options spelled out.
  - Everything else (`string`, `slug`, `image`, `richText`, `number`, `boolean`, `date`, `geopoint`,
    `color`) maps directly to the equivalent Sanity field type.
- Entity names are singular (matches the Sanity schema `type` convention, e.g. `intervention`), even
  where source sketches used plural headers.
- Diagrams showing an `id` field on every box refer to Sanity's built-in document `_id` — not a custom
  field, so it's omitted from the tables below unless a document also has a separate human-facing
  identifier (e.g. `slug`).
- Box color in a whiteboard sketch is **not** a reliable signal of Kind — confirmed 2026-09-01. Use
  explicit groupings (e.g. a "Block Schemas" heading) or ask instead.
- Each entity may have a trailing **Notes** block for open questions, rationale, or things confirmed
  during spec review. Resolve and delete notes once they're no longer relevant.

When adding a new entity: copy this shape —

```
## EntityName
**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| fieldName | string | |
```

---

## Global

**Kind:** Singleton document

| Field | Type | Notes |
|---|---|---|
| siteName | internationalizedArray<string> | i18n (2026-09-01): one entry per locale. Falls back to the default locale (`en`) when an entry is missing. |
| theme | -> Theme | Implemented (2026-09-01). Optional (not required) — if unset, the site falls back to Tailwind's default palette in `app/globals.css`. |
| navLinks | Array<-> PageData \| -> Link> | Polymorphic reference (2026-09-01): each item is either a Page (linked by its `urlSlug`) or a Link (custom/external URL). Order controls navbar order. A Page reference points at one locale's document; the navbar resolves the label from the current locale's translation via the shared slug. |

## PageData

**Kind:** Document

Renamed from `Page` (2026-09-01 sketch): `blocks` → `sections`, `friendlyUrl` → `urlSlug`.

i18n (2026-09-01): document-level via `@sanity/document-internationalization` — one
document per locale, linked by a `translation.metadata` doc, created/managed from the
Translations menu in Studio.

| Field | Type | Notes |
|---|---|---|
| name | string | |
| sections | Array<Object (Block variant)> | See [Block Schemas](#block-schemas). |
| showNavbar | boolean | |
| urlSlug | slug | **Shared across locales** (`/en/home` and `/es/home` both have slug `home`). Uniqueness scoped by `language` (`sanity/lib/isUniqueOtherThanLanguage.ts`). |
| language | string | Managed by the i18n plugin; hidden/read-only in the form. |

---

## Block Schemas

Object types registered into `PageData.sections` — reusable UI "templates" you create many instances of
and arrange to build a page (confirmed 2026-09-01). Rendered via a `_type` → component registry
(`components/blocks/`), per [`CLAUDE.md`](../CLAUDE.md).

### Hero

**Kind:** Object (Block variant)

Implemented (2026-09-01). First block built; also the working example of the page-builder
plumbing (schema → GROQ projection → `components/blocks/` registry → `components/common/Hero`).

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| content | text | Body paragraph; optional. Rendered with line breaks preserved. |
| image | image | Optional. Hotspot enabled. |
| backgroundColor | -> ColorToken | Required. Full-bleed background behind the block; resolved to its hex value. |
| imagePosition | [left, right] | Required, defaults to `right`. Side the image sits on beside the text. |

### Banner

**Kind:** Object (Block variant)

Implemented (2026-09-01). Distinct from the [Banner](#banner-1) entity documented further below
(same name, different shape) — that one is a pending spec item; this is the block actually built.

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| content | text | Optional. |
| backgroundColor | -> ColorToken | Required. Full-bleed background behind the block. |

### FocusAreasList

**Kind:** Object (Block variant)

Implemented (2026-09-01). Same role as the [FocusAreasBlock](#focusareasblock) spec item below —
built under a different name (`focusAreasList`) and referencing the [FocusArea](#focusarea)
document (named `focusAreas` in the schema; holds `name`/`description`/`backgroundColor`, not the
`name`/`excerpt`/`color` shape sketched there). Reconcile naming when that spec item is resolved.

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| focusAreas | Array<-> FocusArea> | Required, at least one. |

### NewsList

**Kind:** Object (Block variant)

Implemented (2026-09-22). Same role as the sketch's single "News" entity below, split the same
way [FocusAreasList](#focusareaslist) split from `FocusAreasBlock`/`FocusArea`: `NewsList` is the
block placed in `PageData.sections`, referencing many [News](#news) documents so the same item
can be reused and so News is managed from its own list in Studio.

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| content | text | Optional body copy under the title. |
| news | Array<-> News> | Required, at least one. Rendered by each News item's `date`, newest first — not array order. |
| cta | -> Link | The "Read more" button below the grid. |

### News

**Kind:** Document

Implemented (2026-09-22) as a document (not an inline block field) — see [NewsList](#newslist)
above. `backgroundColor` made optional, not required: the design has plain white cards.

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| date | date | Required. Controls display order in a NewsList. |
| category | -> NewsCategory | Required. |
| image | image | Required. Hotspot enabled. |
| url | string | Required. Where "Read more" links to. |
| backgroundColor | -> ColorToken | Optional. |

### NewsCategory

**Kind:** Document

Implemented (2026-09-22). Dropped `slug` (no category-filtered listing exists yet — add it if
that's built later) and made `label` an internationalized array, matching `Link.label`, since it's
locale-facing text (e.g. "Theme 1").

| Field | Type | Notes |
|---|---|---|
| label | internationalizedArray<string> | Required. One entry per language. |

### Stats

**Kind:** Object (Block variant)

Implemented (2026-09-22). Cards are inline objects (`StatCard`), not references — unlike
`NewsList`/`FocusAreasList`, these aren't a reusable content library, just this block's own layout.

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| content | text | Optional body copy. |
| backgroundColor | -> ColorToken | Required. Full-bleed background behind the whole block. |
| cards | Array<Object: StatCard> | Required, at least one. |

### StatCard

**Kind:** Object

| Field | Type | Notes |
|---|---|---|
| title | string | Required. The highlighted stat, e.g. "1 in 5", "68%". |
| content | text | Optional caption. |
| color | -> ColorToken | Required. This card's own background color. |

### Banner

**Kind:** Object (Block variant)

| Field | Type | Notes |
|---|---|---|
| title | string | |
| body | string | |
| backgroundColor | -> ColorToken | Same assumption as News.backgroundColor — no drawn arrow, inferred for consistency. |
| cta | -> Link | |

### FocusAreasBlock

**Kind:** Object (Block variant)

Sketch labeled this `FocusAreas` — renamed to `FocusAreasBlock` here to avoid colliding with the
`FocusArea` document it references (same problem as [Outcome](#outcome) below).

| Field | Type | Notes |
|---|---|---|
| title | string | |
| focusAreas | Array<-> FocusArea> | |
| backgroundColor | -> ColorToken | Same assumption as News.backgroundColor. |

### OutcomesBlock

**Kind:** Object (Block variant)

Sketch labeled this `Outcomes`, referencing a simple `Outcome` shape (`id, slug, label`) — different
from the [Outcome](#outcome) document under Intervention (`intents, type, size, content, videoUrl,
numericValue, text`). Same name, incompatible shape, so treated as a distinct nested type here
(`OutcomeTag`), pending your confirmation — see [Open items](#open-items).

| Field | Type | Notes |
|---|---|---|
| title | string | |
| outcomes | Array<Object: OutcomeTag> | `OutcomeTag` = `{ slug: slug, label: string }`. **Not confirmed** — could instead mean "reference the real Outcome document and show slug/label as a preview." |

### ChartSection

**Kind:** Object (Block variant)

| Field | Type | Notes |
|---|---|---|
| title | string | |
| body | string | |
| chart | -> Chart | |
| marqueeText | string | Optional (marked `*` in sketch). |
| color | -> ColorToken | |

### Chart

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| type | string | |
| data | unknown | Shape not specified in sketch — likely depends on `type`. |

---

## Design system

### Theme

**Kind:** Document — **Implemented** (2026-09-01)

Per sketch annotation: theme color values compile into CSS variables at build time, so changing them
requires a redeploy; resolving them dynamically via JS client-side was explicitly ruled out as untidy.
`app/[locale]/layout.tsx` fetches `Global.theme` server-side and sets the four fields below as CSS
custom properties (`--background`, `--foreground`, `--primary`, `--secondary`) on the page root, which
is resolved once per static build/request — not client-side JS.

| Field | Type | Notes |
|---|---|---|
| name | string | Not in the original spec — added since Theme is a Document (multiple instances allowed) and needs a human-readable label in Studio lists / when picking one from `Global.theme`. |
| backgroundColor | -> ColorToken | Maps to CSS var `--background`. |
| frontColor | -> ColorToken | Maps to CSS var `--foreground`. |
| buttonColor | -> ColorToken | Maps to CSS var `--primary` (shadcn's primary-button token). |
| secondaryButtonColor | -> ColorToken | Renamed from `secondaryButtonToken` in the original text draft for naming consistency with the other Color* fields. Maps to CSS var `--secondary`. |

**Notes:**
- Original text draft listed `backgroundColor` twice; the duplicate was removed (confirmed).
- Only these 4 vars are overridden — `--*-foreground` counterparts (e.g. `--primary-foreground`, the
  text color drawn on top of a button) are NOT part of this schema and stay at their Tailwind defaults.
  A Theme with a light `buttonColor` could end up with low-contrast button text. Not fixed here since
  it's outside the 4 documented fields — flag if you want a 5th field added for this.

### ColorToken

**Kind:** Document — **Implemented** (2026-09-01)

`value` uses Sanity's `color` type, from the `@sanity/color-input` plugin (not built into core Sanity).

| Field | Type | Notes |
|---|---|---|
| name | string | |
| value | color | Stored as `{hex, alpha, hsl, hsv, rgb}`; only `.hex` is read by the frontend today. |

### Link

**Kind:** Document

Referenced from `Global.navLinks`, `Banner.cta`, and (assumed) `Associate.link`.

| Field | Type | Notes |
|---|---|---|
| label | internationalizedArray<string> | i18n (2026-09-01): one entry per locale, falls back to `en`. |
| url | string | |
| type | [external, internal] | |

---

## Domain

### Intervention

**Kind:** Document

Implemented (2026-09-25), decided in a full grilling session against a newer ERD sketch. Document-
internationalized like `PageData` (one document per locale, `language` field, slug uniqueness scoped
by language) — confirmed explicitly, since Intervention content (name, outcome text, activity
excerpts...) all needs translation the same way page content does.

| Field | Type | Notes |
|---|---|---|
| name | string | Required. |
| slug | slug | Required. Shared across locales, like `PageData.urlSlug`. |
| language | string | Managed by the i18n plugin; hidden/read-only in the form. |
| status | [started, not-started] | Confirmed `not-started` (not `non-started` as both sketches had it — a repeated typo, not intentional vocabulary). |
| focusAreas | Array<-> [FocusArea](#focusarea)> | Required, at least one. |
| primaryFocusArea | -> [FocusArea](#focusarea) | New field, not in either sketch. Needed because the first block fed by Intervention data (a card list) badges each card with exactly one focus area, and relying on `focusAreas[0]` (array order) was judged too fragile/implicit. |
| primaryActor | -> [Actor](#actor) | Required. |
| secondaryActors | Array<-> [Actor](#actor)> | |
| localization | geopoint | |
| outcomes | Array<-> [Outcome](#outcome)> | |
| activities | Array<-> [Activity](#activity)> | |
| mainPhoto | image | Confirmed kept on Intervention (the newer sketch draws it here, resolving the old sketch-vs-text-draft conflict). |

**Notes:**
- No `connection` field yet — see [Connection](#connection) below; deferred entirely, by choice, not
  oversight.

### Connection

**Kind:** Document

**Deferred (2026-09-25)** — explicitly not built in this pass ("a bit complicated, leave that for
later"). Spec below is unchanged from the prior review, kept for whenever this gets picked up.

| Field | Type | Notes |
|---|---|---|
| interventionA | -> Intervention | |
| interventionB | -> Intervention | |
| text | string | |
| mainPhoto | image | Added per 2026-09-01 sketch. |

**Notes:**
- Open: how/where a Connection is surfaced (e.g. rendered on both linked Interventions' pages? its own
  view?) is not yet specified.

### Shift

**Kind:** Document

Implemented (2026-09-25). Confirmed explicitly: **not** referenced from Intervention — the two are
joined only indirectly, through Activities each one separately references. No `intervention` field
exists on Shift.

| Field | Type | Notes |
|---|---|---|
| activities | Array<-> [Activity](#activity)> | Required, at least one. |
| from | date | Required. |
| to | date | Required. |

### Activity

**Kind:** Document

Implemented (2026-09-25) as specced. Plain, single-language document (see i18n note below).

| Field | Type | Notes |
|---|---|---|
| name | string | Required. |
| date | date | Required. |
| url | string | |
| image | image | Hotspot enabled. |
| excerpt | text | |

**Notes:**
- i18n (2026-09-25): confirmed **no** document-internationalization plugin on Activity (or Outcome).
  Each locale's Intervention document references its own separately-authored Activity/Outcome
  documents — translation happens by authoring parallel content per locale, not by linking translated
  Activities to a source via the plugin. Less machinery; matches how the rest of an Intervention's
  content is translated anyway.

### Outcome

**Kind:** Document

Implemented (2026-09-25). The `content`/`videoUrl`/`numericValue`/`text` relationship — flagged
"assumed, not confirmed" in the prior review — turned out to be more specific than guessed: **not**
"numericValue always shown, text/video is the supplementary mode." Confirmed instead:
- `content = "video"` → only `videoUrl` is relevant.
- `content = "text"` → `numericValue` **and** `text` are shown together.

`videoUrl`, `numericValue`, and `text` are each hidden in Studio and only required for the mode
that's active (`hidden`/`validation` keyed off the sibling `content` field).

| Field | Type | Notes |
|---|---|---|
| intents | Array<-> [Intent](#intent)> | |
| type | [pill, circle] | Required. |
| size | [small, large] | Required. |
| content | [text, video] | Required. Mode switch — see above. |
| videoUrl | url | Required only when `content = video`; hidden otherwise. |
| numericValue | number | Required only when `content = text`; hidden otherwise. |
| text | richText | Confirmed rich text (Portable Text, same as `PortfolioApproach.content`). Required only when `content = text`; hidden otherwise. |

**Notes:**
- Not internationalized — see [Activity](#activity)'s i18n note above; same reasoning applies here.
- See [OutcomesBlock](#outcomesblock) — the sketch also shows a same-named, differently-shaped
  `Outcome` (`id, slug, label`) nested under a page-builder block. Not the same document type as this
  one; modeled as a separate `OutcomeTag` object pending your confirmation.

### Intent

**Kind:** Document

Implemented (2026-09-25). `label` made an internationalized array rather than a plain string —
treated like `NewsCategory.label`/`Link.label` (a short, reusable, locale-facing tag), not like a
document-internationalized type — since the same Intent (e.g. "Youth Employment") is expected to be
reused across many Outcomes/Interventions rather than authored once per locale.

| Field | Type | Notes |
|---|---|---|
| label | internationalizedArray<string> | Required. One entry per language. |
| color | -> ColorToken | Required. |

### Associate

**Kind:** Document

Not built in this pass — out of scope for the Intervention graph work (2026-09-25). Spec unchanged.

| Field | Type | Notes |
|---|---|---|
| name | string | |
| logo | image | |
| link | -> Link | Renamed from `url` (plain string) to `link` (`-> Link`) per the 2026-09-01 sketch's field name — no reference arrow was actually drawn for it though, so this is inferred from the name matching the `Link` entity. Confirm; could just be a renamed plain `url` string. |

### FocusArea

**Kind:** Document

**Reused, not rebuilt (2026-09-25).** The graph's `FocusArea` (`name`, `excerpt`, `color -> ColorToken`)
turned out to be the same concept as the `focusAreas` document already implemented for the
`FocusAreasList` marketing block — confirmed explicitly rather than assumed. `Intervention.focusAreas`
and `Intervention.primaryFocusArea` both point at the **existing** `focusAreas` document type, field
names kept as they already are (`description`, `backgroundColor`) rather than renamed to match this
sketch's `excerpt`/`color` — same concept, no functional reason to rename and break the existing
`FocusAreasList` block/query.

| Field (as actually implemented) | Type | Notes |
|---|---|---|
| name | string | Required. |
| description | text | Sketch calls this `excerpt` — kept as `description`, see above. |
| backgroundColor | -> ColorToken | Sketch calls this `color` — kept as `backgroundColor`, see above. |

### Actor

**Kind:** Document

**Reused, not rebuilt (2026-09-25).** The graph's `Actor` (`name`, `type -> ActorType`) is **not** a
new document — it's the existing `actors` document (already implemented for footer partner logos:
`name`, `image`, `type`, `showInFooter`), with `type` changed in place. Confirmed explicitly after
flagging the collision: `actors.type` was `array of string` (`[implementer, cofounder]`); it's now
`array of reference -> ActorType`, kept as an **array** (not the single reference the sketch draws) so
an actor can carry more than one type value if needed.

| Field | Type | Notes |
|---|---|---|
| name | string | |
| image | image | |
| type | Array<-> ActorType> | Was `array of string` (`[implementer, cofounder]`); implementer/cofounder now become `ActorType` documents like any other type (government, civil, international-org), created by hand in Studio. |
| showInFooter | boolean | Unchanged. |

**Notes:**
- **Migration required, not yet run:** the one existing `actors` document ("UNDP") still has
  `type: ["implementer"]` as raw strings — that no longer matches the new reference-array schema. Once
  the `implementer`/`cofounder`/etc. `ActorType` documents exist in Studio, that document's `type`
  field needs migrating to reference them (same shape of one-off migration as `scripts/migrate-to-i18n.ts`
  earlier in this project).

### ActorType

**Kind:** Document

Implemented (2026-09-25) — the "unresolved conflict" flagged in the prior review is now resolved:
`label` is **open-ended**, not the locked 3-option enum. Confirmed by the actual decision made this
session: `implementer`/`cofounder` need to coexist as `ActorType` values alongside
`government`/`civil`/`international-org`, which only works if new types can be added without a schema
change. `label` is an internationalized array, same reasoning as [Intent.label](#intent) — a short,
reusable, locale-facing tag.

| Field | Type | Notes |
|---|---|---|
| label | internationalizedArray<string> | Required. One entry per language. Open-ended — not a fixed `select`. |
| slug | slug | Added 2026-09-25, after content review — with `label` translated 3 ways, code needs a stable, non-translated key. Source defaults to the English `label` value. `Footer.tsx`'s implementer/cofounder split reads this, not the label text; `getActors()` resolves `type[]->slug.current`. |
| color | -> ColorToken | Required. |

**Notes:**
- The sketch's cut-off sticky note next to ActorType ("Actor exis...") was never retyped/resolved — not
  revisited in this session either, since it didn't come up as blocking. Ask again if it turns out to
  matter.
- The existing `cofounder` document doesn't have its slug filled in yet (`implementer`'s does) — open
  it in Studio and hit Generate.

### InterventionsList

**Kind:** Object (Block variant)

Implemented (2026-09-25). The first block fed by Intervention data — a curated (not auto-filtered:
confirmed explicitly, no `status`-based filtering) list of Interventions beside a title/content panel.
Nothing in the block links anywhere yet (no Intervention detail page/route exists).

| Field | Type | Notes |
|---|---|---|
| eyebrow | string | Optional. Small label above the list, e.g. "New interventions". |
| interventions | Array<-> Intervention> | Required, at least one. Manually curated and ordered by the editor — not automatic. |
| title | string | Required. Heading in the colored panel. |
| content | text | Optional. |
| backgroundColor | -> ColorToken | Required. Applies to the panel only, not the full block width (unlike most other blocks' `backgroundColor`). |

### ShiftsInLogic

**Kind:** Object (Block variant)

Implemented (2026-09-26). A title/content intro, a full-width lead-in line, then a stack of
pill-shaped rows each describing one "from X to Y" shift. Named `shiftsInLogic` rather than anything
containing just "shift" or "portfolio" — both [Shift](#shift) (the unrelated activities/from/to
domain document) and [PortfolioApproach](#portfolioapproach) already exist.

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| content | text | Optional. Paragraph beside the title. |
| leadIn | text | Optional. The line between the intro and the rows. Confirmed as a **single** field — the "A shift in logic:" prefix is authored as part of the same string, not a separate label. |
| rows | Array<Object: ShiftInLogicRow> | Required, at least one. |

### ShiftInLogicRow

**Kind:** Object

Inline object (like [StatCard](#statcard)/`PortfolioApproachCard`), not a reference — these rows
belong to their block, they aren't a reusable content library.

| Field | Type | Notes |
|---|---|---|
| label | string | Required. e.g. "From fragmentation to Coherence". |
| image | image | Optional. The diagram between label and content. Confirmed as a per-row **upload**, not a fixed set of hardcoded SVGs, so new row types don't need a code change. |
| content | text | Optional. |
| color | -> ColorToken | Required. This row's own background color. |

### Territory

**Kind:** Object (Block variant)

Implemented (2026-09-26). A title/content panel beside a vector map of São Tomé and Príncipe.

Map points are **not curated on the block** — every [Intervention](#intervention) in the current
locale with a `localization` geopoint is plotted automatically, so adding a located intervention is
all it takes to put it on the map. Each point takes its colour from that intervention's
`primaryFocusArea`, and shows the intervention name on hover/focus.

| Field | Type | Notes |
|---|---|---|
| title | string | Required. |
| content | text | Optional. |
| backgroundColor | -> ColorToken | Required. Applies to the title/content panel, not the map side. |

**Implementation notes:**
- **MapLibre GL + OpenFreeMap** (`tiles.openfreemap.org/styles/positron`) — a real vector basemap,
  free with no API key and no signup. Replaced an earlier hand-rolled `d3-geo` + Natural Earth SVG
  approach (2026-09-26) on request for a real, simplified map.
- **Checked and rejected: CARTO Positron.** Its tiles still return HTTP 200, but the image content is
  now an "API KEY REQUIRED" watermark — a status-code check alone does not catch this. Also rejected
  OSM standard raster (too busy, and their tile policy discourages production sites).
- **Attribution is set explicitly** in `TerritoryMap.tsx`. OpenStreetMap data is ODbL-licensed so
  credit is legally required, and the OpenFreeMap style does not declare it on its sources, so
  MapLibre cannot pick it up automatically. Do not remove it.
- **The map is locked** (`interactive: false`) — no pan, zoom or rotate. Framed on fixed bounds
  covering both islands. This also means it can never hijack page scroll.
- `maplibre-gl` is imported *inside* `useEffect`, not at module scope: it touches `window` on import,
  which would break server rendering of the component shell. v6 has **no default export** — use named
  imports (`Map`, `Marker`, `Popup`, `AttributionControl`).
- Points are plain lat/lng; MapLibre handles projection. A geopoint outside the frame simply falls
  outside the visible bounds.
- Trade-off accepted: this adds a third-party runtime dependency (visitors' browsers fetch tiles from
  OpenFreeMap), where the previous SVG approach was fully self-contained.

---

## Open items

- **OutcomesBlock vs Outcome**: same name in the sketch, incompatible field sets. Needs an explicit
  call — separate type (current assumption, named `OutcomeTag`) vs. the block referencing the real
  `Outcome` document and only previewing `slug`/`label`. (Unrelated to the 2026-09-25 Intervention
  build — that page-builder block was never built either.)
- ~~ActorType.label: free text vs. fixed 3-option select~~ — **Resolved (2026-09-25):** open-ended,
  confirmed. See [ActorType](#actortype).
- ~~Intervention.color / Intervention.mainPhoto~~ — **Resolved (2026-09-25):** `mainPhoto` kept on
  Intervention; no `color` field (never came up as needed). See [Intervention](#intervention).
- ~~Shift not referenced from Intervention~~ — **Resolved (2026-09-25), confirmed intentional:** they're
  joined only indirectly, through shared Activity references. See [Shift](#shift).
- **backgroundColor fields on News / Banner / FocusAreasBlock**: assumed `-> ColorToken` for consistency
  with Theme and ChartSection.color, but no reference arrow was actually drawn for these three in the
  sketch.
- **Associate.link**: assumed `-> Link` based on the field being renamed to match the Link entity's
  name; no arrow confirms it — could just be a renamed `url` string.
- **Connection**: deferred by explicit choice (2026-09-25), not an oversight — "a bit complicated,
  leave that for later." Still not referenced from Intervention or PageData when it is picked up.
- **Associate**: still not built, not referenced from Intervention or PageData — attachment point
  undefined. Out of scope for the 2026-09-25 Intervention build.
- **Sticky note near ActorType**: illegible ("Actor exis...") — still unresolved, didn't come up as
  blocking this session.
