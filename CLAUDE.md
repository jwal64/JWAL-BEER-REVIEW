# JWAL Beer Review - Development Guide

## Where things live

The site is static — `index.html` loads `data.js`, then `app.js`, then
`style.css`. There is no build step.

| File | Holds |
|------|-------|
| `data.js` | **All data**: `beers[]`, `breweries[]`, `drunkLocs[]`, `WANT_TO_TRY[]`, `BRAND_DOMAINS`, `FLAGS`/`CNAMES`, the Untappd averages |
| `app.js` | **All behaviour**: statistics, rendering, charts, maps, search. No beer data. |
| `style.css` | The design system. `:root` is the only place a colour is written. |
| `data/` | Generated JSON/CSV copies of `data.js`. Never edit by hand — `npm run export` writes them. |
| `tools/` | Zero-dependency Node scripts (validate, export, SRI, smoke test). |

Add data to `data.js` only. A review added to `app.js` would be invisible to
`npm run check` and to everything in `data/`.

## Standard Operating Procedure: Adding New Beers

When adding a new beer entry to `data.js`, **every beer must have its brewery location and language data tracked**. Follow these steps in order:

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

These codes already exist in `FLAGS` and `CNAMES` in `data.js`. The plain `GB` code and
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

### Step 2.5: Add the Brand Domain (REQUIRED)

Every beer must have an entry in `BRAND_DOMAINS` in `data.js`, or it
renders the 🍺 placeholder forever — there is no name-based guess behind it:

```js
"Radeberger Pilsner":"radeberger.de",
```

A value is one domain, or an array of domains tried in order:

```js
"Pilsner Urquell":["pilsnerurquell.com","prazdroj.cz"],
```

Use the array form for a brand that lives at more than one address (brand site vs.
the brewery that owns it, `.com` vs. the local TLD) so a miss on the first still
resolves a real logo.

**Every domain listed against a beer must belong to that brand.** A parent
company's domain is not a fallback — Heineken's logo on an Almaza is a
confidently wrong answer, which is worse than no logo. Leave the beer with one
domain and let it fall through to the placeholder instead.

Nothing in the repo can verify a domain: only a browser that can reach the CDNs
can. See "Verifying logos" below.

### Step 2.6: Optional — Local Logo Override

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
5. **Country maps**: Ensure the brewery's country code exists in `FLAGS` and `CNAMES` at the top of `data.js`. If not, add it.

### Step 4: Update Consumption Location (if new)

If the beer was consumed in a new city, add it to the `drunkLocs[]` array:

```js
{city:"CityName", region:"RegionName", country:"CountryName", cc:"XX", lat:00.0000, lng:-00.0000}
```

### Step 5: Validate

```sh
npm run check     # enforces every rule below
npm run export    # refresh data/ to match, and commit it
```

`npm run check` needs nothing installed, and runs in CI on every push. It fails on:

- a beer entry with a missing or wrong-typed field
- a rating that isn't 0–5 in quarter steps, or a `monthN` that disagrees with `month`
- an `origin` or `cc` with no entry in `FLAGS` **and** `CNAMES`, or a `country` that
  doesn't match `CNAMES[cc]`
- a `style` with no colour in the `sC` map in `app.js`
- a beer no brewery in `breweries[]` lists
- a brewery whose `beers` and `ratings` are different lengths, or whose rating
  matches no review of that beer
- a beer with no `BRAND_DOMAINS` entry (it would render the 🍺 placeholder forever)
- a consumption city missing from `drunkLocs[]`
- an `UNTAPPD_GLOBAL_AVGS` key that matches no beer
- `data/` being out of step with `data.js`

Two things it cannot check, because they need a browser and the open internet:

- [ ] `auditLogos()` in the console resolves a real logo, not a `PLACEHOLDER` or a
      favicon-sized `suspect` (see "Verifying Logos" below)
- [ ] `nativeName` added if the native-language name differs from the marketed name

`npm run smoke` (needs `npm install`) opens the page in a real browser and checks
every tab, the modal, the map and the command palette still render.

## Standard Operating Procedure: The Want-To-Try Shortlist

`WANT_TO_TRY` in `data.js` is the standing list of beers not yet drunk. The
"What to try" sub-section of Insights renders it, and `predictRating()` scores
each entry against my taste so far.

### Nothing is ever removed from it

An entry is not deleted when the beer gets drunk. `drawWantToTry()` looks for a
review of each entry on every render, and the answer decides which half of the
section it appears in:

- **no review** → it stays on the shortlist, ranked by predicted rating
- **a review** → it leaves the shortlist and appears under "Crossed off",
  where the guess made beforehand is scored against the rating given after

So the only data-entry step when you finally drink something on the list is the
normal one: add the review to `beers[]`. The section updates itself, the KPI
counts move, and the calibration chart gains a bar. Deleting the entry instead
would throw away the prediction, which is the only thing that makes the
scorecard worth having.

### Adding an entry

```js
{beer:'Tsingtao', style:'Lager', origin:'CN', abv:4.7, region:'Qingdao, Shandong', untappd:3.29, method:'Bottle'},
```

Same rules as a beer: `style` needs a colour in `sC`, `origin` needs `FLAGS` +
`CNAMES` (UK split by nation as everywhere else), `method` is one of the four,
and the beer needs a `BRAND_DOMAINS` entry — a shortlist card renders a logo
like anything else. `untappd` is the world's average, from the same source as
`UNTAPPD_GLOBAL_AVGS`.

### `as` — when the shelf name isn't the logged name

Crossing off is done by name, through `wtNorm()` in `app.js`: case, accents,
apostrophes and punctuation are flattened, and what's left has to match word for
word. That is deliberately strict — a looser rule would let *Peroni Original*
cross off *Peroni Nastro Azzurro*.

When a beer really is logged under a different name, say so:

```js
{beer:'Paulaner Hefe', ..., as:['Paulaner Hefe-Weißbier']},
```

`npm run check` warns when a shortlist entry looks like an already-reviewed beer
under another name ("still on the shortlist, but "…" is already reviewed"). Read
that warning as a prompt to add an `as` — or, if they are genuinely different
beers, to leave it alone.

### The prediction

`predictRating(style, origin, untappd, method)` blends 50% world consensus, 25%
style bias, 15% country bias, 10% base anchor and a serving-method nudge. It is
recomputed on every render, so a guess shifts as the rest of the data does — an
already-crossed-off beer's guess is not frozen at the value it had on the day.
The `MIN_N` rule applies: a style or country average under three reviews falls
back to the global average rather than bending the prediction toward one pour.

## Rendering Rule: `esc()` Everything

`app.js` builds HTML with template literals and `innerHTML`. **Every value that
comes from the data goes through `esc()` first** — beer names, brewery names,
cities, regions, styles, methods:

```js
`<div class="beer-card" data-beer="${esc(b.beer)}">${esc(b.beer)}</div>`
```

Not decoration: a beer named `Smithwick's` or a brewery with a `<` in its name
closes the attribute early and takes the rest of the row with it. `esc()` handles
`& < > " '` and stringifies whatever it's given, so wrapping a number is never
wrong — when in doubt, wrap.

Two exceptions, both deliberate:

- **Canvas text** — Chart.js labels and tooltips are drawn, not parsed. Escaping
  there renders a literal `&amp;`.
- **Values that are already HTML** — `logoImg(...)`, a nested `.map(...).join('')`,
  a `cond ? '<span>' : ''`. Escaping those prints the tags.

Leaflet's `bindTooltip` / `bindPopup` **do** parse HTML: escape there.

## CDN Rule: Pin and Hash

Chart.js and Leaflet load from jsDelivr at an exact version with an `integrity`
hash. Changing either version means re-deriving the hash:

```sh
npm run sri -- --write
```

`npm run sri` takes the hash from the npm registry, not from the CDN, and
verifies the download against the integrity npm published for that version. A
wrong hash means the browser refuses the file and the charts or the map simply
never appear — so never hand-write one.

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
`app.js` by `computeCanonLoc()` / the `CANON_LOC` map (recomputed in `refreshStats()`),
so it stays correct automatically as data changes. Ensure any consumption city involved
exists in `drunkLocs[]` as usual.

> Note: as of the latest data, every beer is reviewed in exactly one city, so this rule is
> currently dormant and changes nothing visible; it activates automatically the first time a
> beer is logged in a second city.

## Ranking Rule: Minimum Sample Size (`MIN_N`)

A group needs **at least `MIN_N` reviews (currently 3)** before its average is allowed to
win or lose a ranking. Without this, a country visited once tops the table on a single
generous pour, and a style tried once becomes "my weakest".

`MIN_N` and its helpers live at the top of the stats section in `app.js`:

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
- **What to try** (`predictRating()` + the rationale chips on a shortlist card): a style
  or country average only counts as signal at `MIN_N`+; below that the term falls back to
  the global average and the chip claiming "I like X" is not written at all.

### What it does not affect

Nothing is hidden or dropped. Thin groups still chart, still list, and still count toward
the totals — they sort to the tail and render muted (`.rank-thin` / `.rb-thin` in
`style.css`). Per-beer views (the beers table, the detail modal, the contrarian chart,
best/worst pour of a month) are single observations, not averages, so the rule never
touches them.

### Changing the threshold

Edit `MIN_N` in `app.js` and everything follows, including the on-screen captions —
they are generated from the constant via `data-minn`, so no text needs updating. Do **not**
hardcode "3" in HTML or CSS.

## Verifying Logos

Beers render their real brand logo at runtime through a four-tier chain, tried in
order until one answers:

**local `logos/` override → Brandfetch CDN → Google favicons → Icon Horse → 🍺**

The chain is tiered by *source*, not by domain: every domain a beer lists is tried
at each tier before dropping to the next, because a real Brandfetch logo for a
beer's second domain beats a 16px favicon for its first.

A domain being *present* proves nothing — whether a real logo sits behind it needs
a browser that can reach those CDNs. Four things do the checking:

| What | When | Catches |
|------|------|---------|
| `npm run check` | on every push, in CI | beers with no `BRAND_DOMAINS` entry at all, across `beers[]` and `WANT_TO_TRY`, plus domains that aren't bare domains |
| `[DOMAIN CHECK]` console warning | automatically on load | the same gap, in the browser |
| `npm run logos` | run it yourself, and monthly in CI | what each beer *actually* resolves to |
| `auditLogos()` in the console | run it manually | the same, from inside a page you already have open |

`npm run logos` (`tools/audit-logos.mjs`) drives `auditLogos()` in headless
Chromium and exits non-zero on anything that didn't resolve, so the answer stops
depending on somebody remembering to open a console. The **Logo audit** workflow
runs it on the 1st of each month and opens a `logo-audit` issue listing what
fell through, closing it once everything resolves again — a logo can break with
no change to this repo, when a brand moves domain or a service drops it.

Either way, read the result for two things:

- **`PLACEHOLDER`** — no source answered; the beer shows 🍺.
- **`suspect`** — something answered, but at favicon size (≤32px), which usually
  means a generic globe standing in for a domain the service doesn't know.

Both mean the domain needs correcting in `BRAND_DOMAINS`. If a brand simply isn't
in any of the services, save the logo into `logos/` and point the beer's `logo`
field at it (Step 2.6) — that is the only way to make a logo certain. A `logo`
that is a remote URL rather than a file in `logos/` is a hotlink to someone
else's server: it works until it doesn't, and `npm run check` warns about it.

The placeholder is also what you see with no network, or behind a proxy that
blocks those CDNs — which is why `npm run logos` probes a few brands that
certainly have logos before auditing anything, and reports the connection rather
than printing a hundred false failures. It exits 0 on that (a skip, not a pass);
`--strict` makes it a failure instead, which is what CI uses so a run that
checked nothing can't read as all-clear.

## Design System: Dark

A calm, modern dark product surface — deep neutral charcoal ground, softly
elevated cards, one honey accent, rich (never neon) data color. Hierarchy comes
from size, weight and muted text. Set throughout in **Plus Jakarta Sans**, one
family, sentence case.

Three things are deliberately absent, because together they read as a trading
terminal rather than a product: **monospace type**, **all-caps tracked labels**,
and **glow**. Don't reintroduce them.

### Where a color is written

**`:root` in `style.css` is the only place.** Do not hardcode a hex anywhere else
— not in CSS rules, not in inline styles in `app.js`.

`app.js` reads the tokens off `:root` at boot through `cssVar()` and freezes
them into `THEME` (canvas and Leaflet can't resolve CSS variables). So changing a
token in `style.css` retints the charts, map markers and passport stamps too, with
nothing to keep in sync by hand. The literals in the `THEME` object are fallbacks
for the case where the stylesheet hasn't landed — update them alongside the CSS.

| Token | Role |
|-------|------|
| `--bg` | the charcoal ground |
| `--surface` | cards and panels, one step up |
| `--surface-2` / `-3` / `-4` | hovers, wells, tracks |
| `--border` / `--border-strong` | hairlines; `-strong` for fields and edges |
| `--text` / `--text-2` / `--text-3` | body, secondary, captions |
| `--accent` / `--accent-hi` | honey: `--accent` fills and draws, `--accent-hi` is the lighter cut for text |
| `--on-accent` | the near-black ink for text sitting *on* the accent |
| `--pos` `--neg` `--warn` `--info` `--purple` | semantics |
| `--edge` | the whisper of a top edge on raised surfaces |
| `--glow` | a soft focus ring — *not* a bloom |

`--edge` is **composed, never replaced**: a rule that adds a shadow on hover must
restate it (`box-shadow: var(--edge), var(--shadow-md)`) or the card goes flat.

### Type

One family, one rule worth knowing: Plus Jakarta Sans ships an unusually narrow
word space (~0.16em against a typical 0.25em) which closes up entirely at caption
sizes — "Average rating" renders as one word. `body` sets `word-spacing: 0.075em`
to correct it, and body tracking stays at normal so nothing eats back into it.
Negative tracking belongs only on large type (`.kpi-val`, `.tb-title`,
`.merged-section-head`).

`--fs-label` (12px) is the caption size: tile labels, table heads, section
markers. Sentence case, in `--text-3`.

### Categorical palettes (`app.js`)

Rich, evenly spaced hues held deliberately short of neon — full saturation on a
dark ground is what tips a chart into looking like a trading screen. A new entry
should sit at the same middle brightness.

| Constant | Covers |
|----------|--------|
| `sC` | beer style → color (add a color here for any new `style`; `npm run check` fails without it) |
| `rC(r)` | rating → color ramp; mirrors the `.r5`…`.r2` badges in `style.css` |
| `MONTH_COLORS`, `BUMP_COLORS`, `LANG_COLORS`, `STAMP_INKS` | month, bump-chart, brewing-language and passport series |

`barFill(hex, n)` dims an under-`MIN_N` bar to 70% of its own color — no further.
Alpha over a dark ground darkens toward mud, and the sort order, the `(n)` in the
label and the tooltip already carry the "not ranked" reading.

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
