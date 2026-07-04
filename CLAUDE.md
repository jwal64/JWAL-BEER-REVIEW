# JWAL Beer Review - Development Guide

## Standard Operating Procedure: Adding New Beers

When adding a new beer entry to `script.js`, **every beer must have its brewery location and language data tracked**. Follow these steps in order:

### Step 1: Add the Beer Entry to the `beers[]` Array

Each entry in the `beers[]` array requires these fields:

```js
{
  beer: "BeerName",           // Marketed/displayed beer name
  style: "Category",          // One of: Lager, Pilsner, Wheat Beer, Belgian Ale, IPA, Pale Ale, Stout, Brown Ale, Red Ale
  origin: "XX",              // ISO 3166-1 alpha-2 country code of the BREWERY's home country
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

- **Relabeled (aggregate views)**: the "Where I drank" map view (dots and popups) and the
  **cities** count in the hero stat row. A folded home-city contribution may cause the
  cities count to drop — this is intended.
- **Left honest (per-session logs)**: the beer-detail modal's "Every time I've had it"
  list still shows each session's **true** consumption city. The rule never rewrites where
  an individual pour actually happened.

### Data-entry implication

Keep recording each review's **real** consumption city/region/country/cc in `beers[]` as
normal — do **not** pre-apply this rule when adding data. It is enforced at display time in
`script.js` by `computeCanonLoc()` / the `CANON_LOC` map (recomputed in `refreshStats()`),
so it stays correct automatically as data changes. Ensure any consumption city involved
exists in `drunkLocs[]` as usual.

> Note: as of the latest data, every beer is reviewed in exactly one city, so this rule is
> currently dormant and changes nothing visible; it activates automatically the first time a
> beer is logged in a second city.

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
