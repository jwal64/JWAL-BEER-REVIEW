# JWAL Beer Review - Development Guide

## Standard Operating Procedure: Adding New Beers

When adding a new beer entry to `script.js`, **every beer must have its brewery location and language data tracked**. Follow these steps in order:

### Step 1: Add the Beer Entry to the `beers[]` Array

Each entry in the `beers[]` array requires these fields:

```js
{
  beer: "BeerName",           // Marketed/displayed beer name
  style: "Category",          // One of: Lager, Pilsner, Wheat Beer, Belgian Ale, IPA, Pale Ale, Stout, Brown Ale, Red Ale, Shandy / Radler
  origin: "XX",              // ISO 3166-1 alpha-2 country code of the BREWERY's home country (see UK exception below)
  abv: 5.0,                  // Alcohol by volume (number)
  method: "Bottle",          // "Bottle", "Can", "Draft", or "Nitro"
  city: "CityName",          // City where the beer was CONSUMED (not brewed)
  region: "RegionName",      // Region/state where consumed
  country: "CountryName",    // Country where consumed (full name)
  cc: "XX",                  // ISO 3166-1 alpha-2 of consumption country
  rating: 3.50,              // Rating out of 5.00 (quarter increments)
  isNew: true,               // true if this beer has never been reviewed before
  month: "Mar",              // 3-letter month abbreviation
  monthN: 3,                 // Month number (1-12)
  year: 2026                 // 4-digit year
}
```

### UK Exception: Split GB by Constituent Country

For breweries based in the United Kingdom, do **not** use the plain `GB` code. Use the
specific constituent-country code instead, based on where the brewery is actually located:

| Constituent Country | `origin`/`cc` code | Full `country` name |
|----------------------|---------------------|----------------------|
| England              | `GB-ENG`            | England              |
| Scotland             | `GB-SCT`            | Scotland             |
| Wales                | `GB-WLS`            | Wales                |
| Northern Ireland     | `GB-NIR`            | Northern Ireland     |

These codes already exist in `FLAGS` and `CNAMES` in `script.js`. The plain `GB` code and
"Great Britain" label are only a fallback for the rare case where the specific UK nation
can't be determined — always prefer the specific code when known. This applies to the
`origin` field on beer entries and the `cc`/`country` fields on brewery entries; `lang`
stays `"en"` for all four.

### Step 2: Add or Update the `breweries[]` Array (REQUIRED)

**Every unique brewery must have an entry** in the `breweries[]` array. Before adding a new beer, check if its brewery already exists.

Required brewery fields:

```js
{
  name: "Brewery Name",           // Official brewery/company name
  location: "City, Region",       // Brewery's physical location (city and region)
  country: "CountryName",         // Brewery's country (full name)
  cc: "XX",                       // ISO 3166-1 alpha-2 country code
  lang: "xx",                     // ISO 639-1 language code (e.g. "de", "ja", "pl", "cs")
  beers: "Beer1 · Beer2",         // All beers from this brewery, separated by " · "
  lat: 49.6853,                   // Latitude of brewery location
  lng: 19.1925,                   // Longitude of brewery location
  ratings: [3.50],                // Array of all ratings for beers from this brewery
  // OPTIONAL - only include if the native name differs from the marketed name:
  nativeName: "NativeBeerName"    // Beer name in the brewery's native language/script
}
```

### Step 2.5: Optional — Local Logo Override

Beers normally render their real brand logo from Brandfetch's CDN at runtime, with Google favicons and Icon Horse as fallbacks. If you want a specific beer to use a local file you've placed in `logos/` (for offline reliability, custom artwork, or to bypass a misidentified Brandfetch match):

1. Save the file as `logos/<anything>.svg` (or `.png`/`.webp`/`.jpg`).
2. Add `logo:"logos/<filename>"` as the last field of the beer's entry in `beers[]`.

The local file becomes the primary source for that beer. The Brandfetch chain remains as automatic fallback if the local file is missing. Beers without a `logo` field continue to use Brandfetch normally.

### Step 3: Research Checklist (for each new beer)

Before adding any beer, research and confirm:

1. **Brewery location**: Find the brewery's city, region, and country. Use the original/founding brewery location, not a satellite plant.
2. **Coordinates**: Look up latitude/longitude for the brewery city.
3. **Language code**: Determine the primary language of the brewery's home country/region:
   - `de` = German, `nl` = Dutch, `fr` = French, `es` = Spanish, `it` = Italian
   - `ja` = Japanese, `cs` = Czech, `pl` = Polish, `da` = Danish, `pt` = Portuguese
   - `en` = English, `sv` = Swedish, `no` = Norwegian, `zh` = Chinese
4. **Native name**: If the beer's name in its native language differs from the marketed English name (e.g. Pilsner Urquell -> Plzeňský Prazdroj, Sapporo -> サッポロビール), record the `nativeName`.
5. **Country maps**: Ensure the brewery's country code exists in `FLAGS` and `CNAMES` at the top of `script.js`. If not, add it.

### Step 4: Update Consumption Location (if new)

If the beer was consumed in a new city, add it to the `drunkLocs[]` array:

```js
{city:"CityName", region:"RegionName", country:"CountryName", cc:"XX", lat:00.0000, lng:-00.0000}
```

### Step 5: Validate

After adding a new beer, verify:
- [ ] Beer entry has all required fields (no missing commas, correct types)
- [ ] `origin` code matches the brewery's country code
- [ ] Brewery exists in `breweries[]` with `lang` field set
- [ ] `nativeName` added if the native-language name differs from the marketed name
- [ ] If beer is from a new brewery, a full brewery entry was added
- [ ] If beer is from an existing brewery, update its `beers` and `ratings` fields
- [ ] Consumption city exists in `drunkLocs[]`
- [ ] Country code exists in `FLAGS` and `CNAMES`
- [ ] If the beer introduces a brand-new `style`, that style has a color in the `sC` map in `script.js`

## Location Rule: Canonical / Most-Unique Location

When the **same beer** (same `beer` name) has been reviewed in **more than one
consumption city**, all location-based **aggregation/display** attributes that beer to a
single **canonical location** — its **most unique** city.

- **Most unique = rarest-visited**: the city with the **fewest total reviews** in the
  database wins. All of the beer's reviews are folded into (merged onto) that one city.
- **Home bases are never canonical when an alternative exists**: **New Rochelle** and
  **New York, New York** are home markets and are never chosen as the canonical location
  for a beer as long as that beer has any other consumption city. (If a beer's only cities
  are both home cities, the standard rarest-visited metric decides between them.)
- **Tie-breaking** is deterministic: `[homePenalty, rawReviewCount, cityName]` — non-home
  beats home, then fewest reviews, then alphabetical.

### What this affects (and what it doesn't)

- **Relabeled (aggregate views)**: CITY tab chart/cards, the "drunk" map (dots, legend,
  table), the **markets** count, and TOP MARKET. A folded home-city contribution may cause
  the markets count to drop — this is intended.
- **Left honest (per-session logs)**: the main beers table rows, the beer-detail modal's
  "ALL SESSIONS" list, and the "LATEST" activity readout still show each session's **true**
  consumption city. The rule never rewrites where an individual pour actually happened.

### Data-entry implication

Keep recording each review's **real** consumption city/region/country/cc in `beers[]` as
normal — do **not** pre-apply this rule when adding data. It is enforced at display time in
`script.js` by `computeCanonLoc()` / the `CANON_LOC` map (recomputed in `refreshStats()`),
so it stays correct automatically as data changes. Ensure any consumption city involved
exists in `drunkLocs[]` as usual.

> Note: as of the latest data, every beer is reviewed in exactly one city, so this rule is
> currently dormant and changes nothing visible; it activates automatically the first time a
> beer is logged in a second city.

## Ranking Rule: Minimum Sample Size (`MIN_N`)

A group needs **at least `MIN_N` reviews (currently 3)** before its average is allowed to
win or lose a ranking. Without this, a country visited once tops the table on a single
generous pour, and a style tried once becomes "my weakest".

`MIN_N` and its helpers live at the top of the stats section in `script.js`:

| Helper | What it does |
|--------|--------------|
| `MIN_N` | The threshold. **The only place the number is written.** |
| `thin(n)` | `true` when a count is below the threshold |
| `rankBy(avgFn, countFn)` | Sort comparator: qualified groups first (best average first), thin ones after |
| `rankable(list, countFn)` | The slice that may be called best/worst; falls back to the whole list if nothing qualifies |
| `barFill(hex, n)` | Mutes a chart bar's color when the group is thin |
| `nLabel(n)` | `"(6)"` — the sample size appended to a chart label |
| `ttWithN(n)` | Chart tooltip that states the sample size and flags thin groups |
| `stampMinNHints()` | Writes "3+ reviews to rank" into every `[data-minn]` caption |

### What this affects

- **Ordering**: style, country, city, brewing-language and brewery lists sort qualified
  first, then thin. `STATS.styleRanked[0]` etc. are therefore always a real result.
- **Headline callouts** (Highlights panel): best/worst style, top country, top city and
  best serving method are picked from the qualified subset only.
- **Country rankings over time** (bump chart): ranks the **running average** through each
  month, and a country enters the chart the month its cumulative count reaches `MIN_N`.
- **Seasonal heatmap**: cells under `MIN_N` are left uncolored — the color reads as a
  verdict, so it's withheld until the sample supports one.
- **Taste profile**: a trait below `MIN_N` shows "n reviews · need 3" instead of a bar.
- **Recommendations** (`predictRating()` + rationale chips): a style or country average
  only counts as signal at `MIN_N`+; below that the term falls back to the global average.

### What it does not affect

Nothing is hidden or dropped. Thin groups still chart, still list, and still count toward
the totals — they sort to the tail and render muted (`.rank-thin` / `.rb-thin` in
`style.css`). Per-beer views (the beers table, the detail modal, the contrarian chart,
best/worst pour of a month) are single observations, not averages, so the rule never
touches them.

### Changing the threshold

Edit `MIN_N` in `script.js` and everything follows, including the on-screen captions —
they are generated from the constant via `data-minn`, so no text needs updating. Do **not**
hardcode "3" in HTML or CSS.

## Design System: Console

The UI is a dark instrument panel — near-black ground, raised cards with a lit top
edge, electric amber, and data colors pitched to burn against the black. Two faces
divide the work: **Space Grotesk** for words, **JetBrains Mono** for every number
and every label.

### Where a color is written

**`:root` in `style.css` is the only place.** Do not hardcode a hex anywhere else
— not in CSS rules, not in inline styles in `script.js`.

`script.js` reads the tokens off `:root` at boot through `cssVar()` and freezes
them into `THEME` (canvas and Leaflet can't resolve CSS variables). So changing a
token in `style.css` retints the charts, map markers and passport stamps too, with
nothing to keep in sync by hand. The literals in the `THEME` object are fallbacks
for the case where the stylesheet hasn't landed — update them alongside the CSS.

| Token | Role |
|-------|------|
| `--bg` | the near-black chassis |
| `--surface` | raised cards and panels |
| `--surface-2` / `-3` / `-4` | wells, hovers, tracks |
| `--border` / `--border-strong` | hairlines; `-strong` for fields and edges |
| `--text` / `--text-2` / `--text-3` | near-white body, secondary, captions |
| `--accent` / `--accent-hi` | electric amber: `--accent` fills and draws, `--accent-hi` is the brighter cut for text and active states |
| `--pos` `--neg` `--warn` `--info` `--purple` | luminous semantics |
| `--edge` | the lit top edge every raised surface carries |
| `--glow` | the bloom an accent throws |

`--edge` and `--glow` are **composed, never replaced**: a rule that adds a shadow
on hover must restate the edge (`box-shadow: var(--edge), var(--shadow-md)`) or
the card goes flat.

### The two repeated marks

1. **The micro-label** — `--fs-label` + `--tr-label`, uppercase, in the mono face.
   One pair of rules at the top of `style.css` assigns the mono face to every
   label and every readout; add a new class to those selector lists rather than
   setting a font anywhere else.
2. **The lit leading edge** — a 2–3px accent bar on the leading edge of a thing
   that is active or hovered: `.bb-panel-head::before`, `.nav-item.active`,
   `.bb-table tbody tr:hover`, `.feed-row:hover`, `.cmd-item.cmd-focused`,
   `.map-mode.active`. It is the design's signature, so don't spend that shape on
   anything else.

Glow stays on **small** marks — ticks, icons, focus rings. It was tried on the KPI
numerals and removed: a colored bloom in `currentColor` smears the glyph edges and
costs more legibility than it buys. `.kpi-val` uses a neutral white bloom instead.

### Categorical palettes (`script.js`)

Luminous, evenly spaced hues, all pitched bright enough to burn against near-black.
A new entry has to carry the same brightness or it reads as a disabled bar.

| Constant | Covers |
|----------|--------|
| `sC` | beer style → color (add a color here for any new `style`) |
| `rC(r)` | rating → color ramp; mirrors the `.r5`…`.r2` badges in `style.css` |
| `MONTH_COLORS`, `BUMP_COLORS`, `LANG_COLORS`, `STAMP_INKS` | month, bump-chart, brewing-language and passport series |

`barFill(hex, n)` dims an under-`MIN_N` bar to 70% of its own color — no further.
Alpha over black darkens toward mud, and the sort order, the `(n)` in the label and
the tooltip already carry the "not ranked" reading.

## Language Code Reference

| Code | Language       | Countries                      |
|------|----------------|--------------------------------|
| `en` | English        | US, IE, JM, GB, AU, SG        |
| `de` | German         | DE                             |
| `nl` | Dutch          | NL, BE (Flemish)               |
| `fr` | French         | FR, BE (Wallonia), CA (Quebec) |
| `es` | Spanish        | ES, MX, AR                     |
| `it` | Italian        | IT                             |
| `ja` | Japanese       | JP                             |
| `cs` | Czech          | CZ                             |
| `pl` | Polish         | PL                             |
| `da` | Danish         | DK                             |
| `pt` | Portuguese     | PT, BR                         |
| `sv` | Swedish        | SE                             |
| `no` | Norwegian      | NO                             |
| `zh` | Chinese        | CN                             |
| `th` | Thai           | TH                             |
| `el` | Greek          | GR                             |
| `af` | Afrikaans      | ZA                             |
| `ar` | Arabic         | LB                             |

## Notable Native Beer Names

These beers have native-language names that differ from their marketed names:

| Marketed Name           | Native Name        | Language |
|-------------------------|--------------------|----------|
| Pilsner Urquell         | Plzeňský Prazdroj  | Czech    |
| Sapporo Premium         | サッポロビール        | Japanese |
| Kirin Ichiban           | キリン一番搾り        | Japanese |
| Birra Moretti           | Birra Moretti      | Italian  |
| Erdinger Weißbier       | Erdinger Weißbier  | German   |
| Hofbräu Münchner Weiße  | Hofbräu Münchner Weiße | German |
| Almaza Pilsener         | ألمازة             | Arabic   |
