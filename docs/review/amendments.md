# Client Review — Iteration 1 Amendments

Raw notes (Spanish, shorthand) from [`v1_it1.md`](./v1_it1.md) refined into
actionable items through a grilling session on 2026-11-10. Each item carries
the original note, the resolved decision (including clarifications given
during grilling), and concrete work pointers. One item is explicitly deferred
to a later pass — see the bottom section.

## Home

### 1. Replace the MarqueeBanner image with the Initiatives graph, linked to `/initiatives`
> Original: "Poner el grafico en el apartado de interventions in motion. Si
> aprietas una iniciativas vas a la pagina de iniciativas."

**Decision:** "Interventions in motion" is the `MarqueeBanner` block
(`components/common/MarqueeBanner.tsx`) — confirmed during grilling. Its
current right-hand `image` slot is replaced with an `InitiativesGraph`
instance in **non-interactive, decorative mode** (no hover tooltips, no
dot-click selection — `onSelect`/`selectedId` both omitted, matching the
component's existing "omit both to disable dot interaction" contract). The
**whole graph area becomes a single link to `/initiatives`** (not per-dot
navigation) — same pattern the component already uses for its bottom
marquee track (`marqueeHref`/`marqueeExternal`, wrapped in `<Link>`/`<a>`).

**Work:**
- `components/common/MarqueeBanner.tsx`: swap the `image &&` block (lines
  74–86) for an `InitiativesGraph` wrapped in a `Link` to
  `/${locale}/initiatives` (needs `locale` threaded in as a new prop).
- `components/blocks/MarqueeBanner.tsx`: the block wrapper currently has no
  access to focus-area/initiative data — add a query for
  `focusAreaOptions`/`initiatives` (same shape `InitiativesExplorer` already
  queries) so the graph has something to render. Confirm with the client
  whether this should be the *same* full initiative set as the Initiatives
  page, or a curated subset — not specified in the raw note.
- `sanity/schemaTypes/objects/marqueeBanner.ts` (if `image` is a required
  field there): make it optional/remove it, since the graph replaces it.

---

### 2. Five Focus Areas: 2-column grid on mobile, smaller cards
> Original: "Five focus areas hacerlas mas chiquitas. En gird. De dos
> columnas"

**Decision:** **Supersedes** the single-column mobile fix from the v1 pass
(`components/common/FocusAreasList.tsx` is currently `grid-cols-1
lg:grid-cols-5`) — confirmed during grilling that this new instruction wins.
Change to **`grid-cols-2 lg:grid-cols-5`**. Since 5 cards don't divide evenly
into 2 columns, the 5th card falls alone into the first column of its own
row — accepted as the natural grid behavior unless flagged otherwise once
it's live.

**Work:**
- `components/common/FocusAreasList.tsx`: grid wrapper → `grid-cols-2
  lg:grid-cols-5`.
- Same file, the card itself (`className="bg-white px-8 py-10 rounded-lg
  odd:rounded-full aspect-square ..."`) needs a smaller mobile treatment to
  read as "más chiquitas" at half the previous per-card width — reduce
  padding (e.g. `px-4 py-5 lg:px-8 lg:py-10`) and the title's `text-[18px]`
  (e.g. `text-sm lg:text-[18px]`), `lg:`-gated so desktop (already 5-column)
  is untouched.

---

## Initiatives

### 3. Graph tooltip tag shouldn't scale up with the zoom
> Original: "En el gráfico: Mejorar tag para cuando se hace zoom quede más
> chico que ahora."

**Decision:** Root cause found — `InitiativesGraph.tsx`'s active-dot label
(the pill `<rect>`/`<text>` at lines 414–431) is drawn in the same SVG
coordinate space as the dots, so when the parent `<g>` zooms in
(`ZOOM_SCALE = 2.1`, applied whenever an initiative is selected), the tag's
rect/text balloon up by the same 2.1× factor. Fix: counter-scale the tag's
group by `1 / ZOOM_SCALE` whenever zoomed, so it reads at a constant
on-screen size regardless of zoom state.

**Work:**
- `components/common/InitiativesGraph.tsx` lines 414–431: wrap the tag's
  `<g>` in an inverse-scale transform keyed to whether a zoom is active
  (`selectedId` truthy), centered on the dot's own `(x, y)` so it doesn't
  drift while shrinking.

### 4. Mobile: show the graph, small, same interactivity as desktop
> Original: "Mobile: Poner el gráfico chiquito"

**Decision:** Confirmed during grilling — currently the graph column is
fully `hidden lg:flex` on `/initiatives`
(`components/common/InitiativesExplorer.tsx` lines 91–93), by deliberate
design (desktop's fixed-viewport two-column scroll layout doesn't translate
to mobile). New treatment: show a **smaller graph in normal page flow**
(not the fixed-viewport pinned layout), with the **same dot-click → select →
syncs with the list/detail below** behavior as desktop — reusing the exact
same `selectedId`/`onSelect` wiring already passed to `InitiativesGraph`,
just at a smaller, non-pinned size.

**Work:**
- `components/common/InitiativesExplorer.tsx` lines 91–125: remove `hidden`
  from the graph wrapper (keep `lg:` sizing as-is), give it a mobile-only
  fixed height (e.g. `h-80 lg:h-full`) instead of relying on the desktop
  fixed-viewport section height, and drop it above the
  title/filter/list column instead of beside it below `lg`.
- Verify the dropdown ("Visualize by") and `graphTagline` footer don't look
  cramped at the smaller mobile height — trim/hide if needed.

### 5. Amendment: Add Outcomes per initiative
> Original: "Agregar outcomes por cada initiative"

**Decision:** The `Intervention` schema already has an `outcomes` field
(`sanity/schemaTypes/documents/intervention.ts` line 87–92, array of
references to the `outcome` document type) — it's just never queried or
rendered anywhere. Query it and show it in the Initiatives Explorer detail
view. Note: `outcome` documents have a richer shape (`content: "text" |
"video"`, `numericValue` + portable-text `text`, or `videoUrl`) than the
unrelated `OutcomeCard` used by the Home page's `OutcomesSection` block
(which uses its own inline `title`/`content`/`color` shape) — this needs a
**new** small rendering component, not a reuse of `OutcomeCard`.

**Work:**
- `lib/sanity/queries.ts` ~line 850 (inside the `initiatives` projection):
  add `"outcomes": coalesce(outcomes[]->{_id, content, numericValue, text,
  videoUrl}, [])`.
- `components/common/InitiativesExplorerTypes.ts`: add `outcomes` to
  `ExplorerInitiative`.
- `components/common/InitiativesExplorerDetail.tsx`: new section between
  "about" (line 81–86) and "activities" (line 88) rendering each outcome —
  number + portable text, or a video embed. Visual treatment not specified
  in the source note — default to a simple stat-card look consistent with
  the existing "about"/"activities" `h3`-headed sections; revisit once
  visible.

### 6. Amendment: Add a map per initiative
> Original: "Mapa por cada initiative"

**Decision:** `Intervention` already has a `localization` geopoint field
(`sanity/schemaTypes/documents/intervention.ts` line 83–86), already queried
today for the site-wide Territory map
(`lib/sanity/queries.ts` ~line 776–781) but never surfaced per-initiative.
Reuse the existing `TerritoryMap` component with a **single point** (this
initiative only) in the detail view.

**Work:**
- `lib/sanity/queries.ts` (initiatives projection): add `"localization":
  defined(localization) => {"lat": localization.lat, "lng":
  localization.lng}`.
- `components/common/InitiativesExplorerTypes.ts`: add optional
  `localization: { lat: number; lng: number }` to `ExplorerInitiative`.
- `components/common/InitiativesExplorerDetail.tsx`: render `<TerritoryMap
  points={[...]} />` (single-point array) when `localization` is present —
  placed after `mainPhoto`, before "about". Exact placement/heading is a
  judgment call; adjust once visible.

### 7. Amendment: "Implemented" / "New intervention" graph tag + legend
> Original: "Agregar un tag de 'implemented' o 'new_intervention'. La
> new_intervention aparece en el chart con el color de la focus area pero
> solo borde, sin fill. Y actualizar la leyenda."

**Decision:** **Repurpose the existing `Intervention.status` field**
(`sanity/schemaTypes/documents/intervention.ts` lines 40–52, currently
`"funded" | "looking-for-partners"`) rather than adding a second field —
confirmed during grilling. Mapping, confirmed during grilling:
- `funded` → **implemented** → solid fill (current dot behavior, unchanged).
- `looking-for-partners` → **new_intervention** → outline only, stroked in
  the focus area's color, no fill.

This field already drives the "Funded"/"Looking for partners" badge on the
Focus Areas Breakdown panel's initiative mini-cards
(`FocusAreaBreakdownPanel.tsx`'s `StatusBadge`) — that badge's own labels
stay as "Funded"/"Looking for partners" (unchanged); only the **Initiatives
page's main graph** gets the new fill/outline treatment, since that's where
the raw note's "en el chart" points (the same graph discussed in items #3–4
above). **The Focus Areas Breakdown's own graph instance (Collaborate page)
is out of scope for this item** — it currently doesn't even carry `status`
through to its flattened initiative list
(`FocusAreasBreakdown.tsx`'s `flatInitiatives` drops it), and extending it
there wasn't part of the request.

**Work:**
- `lib/sanity/queries.ts` (initiatives projection, ~line 816): add `status`.
- `components/common/InitiativesExplorerTypes.ts`: add `status: "funded" |
  "looking-for-partners"` to `ExplorerInitiative`.
- `components/common/InitiativesGraph.tsx` lines 404–413: when
  `initiative.status === "looking-for-partners"`, render the dot with
  `fill="none"` and `stroke={initiative.primaryFocusArea?.color}` instead of
  a solid fill.
- Add a small new legend (doesn't exist yet — the component's only current
  legend is the two ring labels, `focusAreasLabel`/`initiativesLabel`) near
  the graph: a filled-dot swatch labeled "Implemented" and an outline-dot
  swatch labeled "New intervention". New dictionary keys needed (e.g.
  `implementedLabel`/`newInterventionLabel`) in
  `lib/dictionaries/*.json` under `initiativesExplorer`.

---

## Results

### 8. Focus Areas Detail modal: z-index bug + header/body color split
> Original: "Mejorar la parte de From understanding to action. La etiqueta
> de Abundant futures queda arriba del texto." + Amendment: "Pop-up nuevos"

**Decision:** Both raw bullets turned out to be the **same bug/request** on
the same component, confirmed during grilling — "From Understanding to
Action"/"Abundant Futures" is `FocusAreasDetail.tsx` (the shape-cluster +
Insight/Opportunity/Actions block), and "Pop-up nuevos" is elaborating on its
read-more modal, not a separate ask. Two fixes:

1. **Z-index bug:** the selected shape's wrapper can reach `zIndex: 100`
   (`SPOTLIGHT.z`, `FocusAreasDetail.tsx` line 80), which renders *above*
   the modal backdrop (`z-50`, line 282) — exactly what the attached
   screenshot shows ("Abundant Futures" circle overlapping the open "3.
   Actions" modal). Fix: raise the modal's z-index comfortably past any
   shape z-value (e.g. `z-[200]`).
2. **Color split:** the modal box currently uses a single
   `selected?.backgroundColor` (the Focus Area's own color) for its entire
   body (line 286–290). Split into a **header** (keeps the Focus Area
   color — title + close button) and a **body** (switches to the **"Off
   White" color token** from CMS — `sanity/schemaTypes/documents/colorToken.ts`
   — instead of the Focus Area color).

**Work:**
- `components/common/FocusAreasDetail.tsx` line 282: bump the backdrop's
  `z-50` to something above `100` (e.g. `z-[200]`).
- Lines 280–309 (the modal markup): restructure into two stacked sections —
  a colored header strip (current `<h3>` + close `<button>`, keeps
  `selected?.backgroundColor`) and a body wrapper (the `PortableText`
  content) with its own background set to the Off White token's hex.
- New field needed: `sanity/schemaTypes/objects/focusAreasDetail.ts` doesn't
  currently have any background-color field — add one (reference to
  `colorToken`, following the same pattern as every other block's
  `backgroundColor` prop) so editors can set/change it, defaulting to "Off
  White". Thread it through `lib/sanity/queries.ts` and
  `FocusAreasDetailProps` the same way other blocks' `backgroundColor` is
  resolved (`"modalBackgroundColor": modalBackgroundColor->value.hex`).

---

## Collaborate

### 9. Mobile: show the "What's already happening" graph
> Original: "+ Que el gráfico de 'What's already happening' aparezca"

**Decision:** Currently fully hidden below `lg`
(`components/common/FocusAreasBreakdown.tsx` line 170, `<div className=
"hidden lg:block">` wrapping the `InitiativesGraph` instance) — unhide it
with a sensible mobile height. No specific height/behavior was requested
beyond "make it appear," so defaulting to a fixed mobile height (e.g.
`h-80`) stacked above the `FocusAreaBreakdownPanel` rather than beside it;
revisit once visible on a real device.

**Work:**
- `components/common/FocusAreasBreakdown.tsx` line 170: change `hidden
  lg:block` → remove `hidden`, add a mobile height class, keep existing
  `lg:` sizing untouched.
- The grid wrapper around it (line 166, currently `lg:grid-cols-2`) needs
  its mobile column order considered — the panel (`FocusAreaBreakdownPanel`)
  currently renders second in source order; confirm whether the graph
  should sit above or below the panel on mobile once both are visible
  (not specified in the raw note).

### 10. Mobile: show the Territory map
> Original: "+ Agregar el mapa"

**Decision:** Currently fully hidden below `lg`
(`components/common/Territory.tsx` line 38, `<div className="hidden
border-l lg:block">` wrapping `TerritoryMap`) — unhide it with a sensible
mobile height, same reasoning as #9.

**Work:**
- `components/common/Territory.tsx` line 38: remove `hidden`, add a mobile
  height (e.g. `h-80`), keep `lg:block`'s sizing untouched. The map itself
  (`TerritoryMap`) already renders at `h-150 w-full` regardless of
  container — confirm it still reads fine constrained to a shorter mobile
  box, or give it a mobile-specific height override too.

---

## Deferred to a later pass

### "New communication section, no photos"
> Original: "Nueva sección de comunicación sin fotos"

**Status:** Explicitly deferred during grilling — client will work on this
later, not part of this amendments pass. Likely related to (but not
confirmed as identical to) the News/Medium integration already tracked in
[`v2.md`](./v2.md) ("Results: News/Medium integration" — blocked on both
Maqui's design and a decision on whether News syncs automatically from
Medium or is a manual reference link, plus "Noticias solo con título"
suggesting a title-only card). Revisit and re-scope once picked up — don't
assume it's the same item without re-confirming.
