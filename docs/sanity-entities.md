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
| theme | -> Theme | Implemented (2026-09-01). Optional (not required) — if unset, the site falls back to Tailwind's default palette in `app/globals.css`. |
| navLinks | Array<-> PageData \| -> Link> | Polymorphic reference (2026-09-01): each item is either a Page (linked by its `urlSlug`) or a Link (custom/external URL). Order controls navbar order. |

## PageData

**Kind:** Document

Renamed from `Page` (2026-09-01 sketch): `blocks` → `sections`, `friendlyUrl` → `urlSlug`.

| Field | Type | Notes |
|---|---|---|
| name | string | |
| sections | Array<Object (Block variant)> | See [Block Schemas](#block-schemas). |
| showNavbar | boolean | |
| urlSlug | slug | |

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

### News

**Kind:** Object (Block variant)

| Field | Type | Notes |
|---|---|---|
| category | -> NewsCategory | |
| title | string | |
| url | string | |
| image | image | |
| date | date | |
| backgroundColor | -> ColorToken | No reference arrow was drawn in the sketch for this field; assumed `-> ColorToken` for consistency with Theme/ChartSection. Confirm. |

### NewsCategory

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| slug | slug | |
| label | string | |

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
| label | string | |
| url | string | |
| type | [external, internal] | |

---

## Domain

### Intervention

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| name | string | |
| slug | slug | |
| status | [started, non-started] | Value renamed from `not-started` to match the 2026-09-01 sketch — confirm this wasn't a spelling slip. |
| focusAreas | Array<-> FocusArea> | |
| primaryActor | -> Actor | |
| secondaryActors | Array<-> Actor> | |
| localization | geopoint | Original text draft called this "global-coordinates". |
| outcomes | Array<-> Outcome> | |
| activities | Array<-> Activity> | |

**Notes:**
- `color` and `mainPhoto` were on Intervention in the original text draft but do **not** appear on this
  entity in the 2026-09-01 sketch (`mainPhoto` now lives on `Connection` instead). Removed here on the
  assumption the sketch is authoritative — confirm if this was actually just a sketch omission and
  Intervention should keep one or both.

### Connection

**Kind:** Document

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

| Field | Type | Notes |
|---|---|---|
| activities | Array<-> Activity> | |
| from | date | |
| to | date | |

**Notes:**
- Open: relationship to Intervention still not shown in either the text draft or the sketch (Shift
  isn't referenced from Intervention).

### Activity

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| name | string | |
| date | date | |
| url | string | |
| image | image | |
| excerpt | string | |

### Outcome

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| intents | Array<-> Intent> | |
| type | [pill, circle] | |
| size | [small, large] | |
| content | [text, video] | Selects which of `text` / `videoUrl` is used for display. |
| videoUrl | string | Shown only if `content` = `video` (marked `*`/optional in sketch). |
| numericValue | number | |
| text | richText | Assumed shown only if `content` = `text` — not explicitly stated, confirm before building. |

**Notes:**
- See [OutcomesBlock](#outcomesblock) — the sketch also shows a same-named, differently-shaped
  `Outcome` (`id, slug, label`) nested under a page-builder block. Not the same document type as this
  one; modeled as a separate `OutcomeTag` object pending your confirmation.

### Intent

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| label | string | |
| color | -> ColorToken | |

### Associate

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| name | string | |
| logo | image | |
| link | -> Link | Renamed from `url` (plain string) to `link` (`-> Link`) per the 2026-09-01 sketch's field name — no reference arrow was actually drawn for it though, so this is inferred from the name matching the `Link` entity. Confirm; could just be a renamed plain `url` string. |

### FocusArea

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| name | string | |
| excerpt | string | |
| color | -> ColorToken | Added per 2026-09-01 sketch. Confirmed to reference ColorToken, not a raw hexcode (the sketch's `[hexcode]` annotation was a sketch slip). |

### Actor

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| name | string | |
| type | -> ActorType | |

### ActorType

**Kind:** Document

| Field | Type | Notes |
|---|---|---|
| label | string | **Unresolved conflict.** Earlier spec review (previous session) explicitly changed this from a fixed `select` [government, civil, international-org] to free text, specifically so new actor types can be added later without a schema change. The 2026-09-01 sketch redraws `label` as that same fixed select again. Kept as `string` here (not silently reverted) — needs an explicit decision from you: keep it open-ended, or lock it back to the 3-option enum? |
| color | -> ColorToken | |

**Notes:**
- A sticky note next to ActorType in the sketch is cut off ("Actor exis...") and still unread — ask
  again if it matters, or paste/retype it here.

---

## Open items

- **OutcomesBlock vs Outcome**: same name in the sketch, incompatible field sets. Needs an explicit
  call — separate type (current assumption, named `OutcomeTag`) vs. the block referencing the real
  `Outcome` document and only previewing `slug`/`label`.
- **ActorType.label**: free text (current, from prior session) vs. fixed 3-option select (per new
  sketch) — direct conflict, unresolved.
- **Intervention.color / Intervention.mainPhoto**: dropped per the new sketch (mainPhoto moved to
  Connection) — confirm this wasn't a sketch omission.
- **backgroundColor fields on News / Banner / FocusAreasBlock**: assumed `-> ColorToken` for consistency
  with Theme and ChartSection.color, but no reference arrow was actually drawn for these three in the
  sketch.
- **Associate.link**: assumed `-> Link` based on the field being renamed to match the Link entity's
  name; no arrow confirms it — could just be a renamed `url` string.
- **Connection**: still not referenced from Intervention or PageData — attachment point undefined.
- **Shift / Associate**: still not referenced from Intervention or PageData — attachment point
  undefined.
- **Sticky note near ActorType**: illegible ("Actor exis...") — unresolved.
