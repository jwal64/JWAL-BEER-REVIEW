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

### Step 2.5: Add the Beer Logo SVG (REQUIRED — no fallbacks exist)

Every beer must ship with a local SVG badge in `logos/`. There is no remote fallback and no emoji safety net — if the file is missing or the slug doesn't match, the beer renders a broken image icon.

1. Compute the beer's **slug** (must match `slugify()` in `script.js` and `scripts/build-logos.mjs`):
   - NFD-normalize the name and strip combining marks (ż→z, ü→u, é→e, ñ→n).
   - Map ß→ss, Ø→o, Æ→ae, Œ→oe, Đ→d, Ł→l, Þ→th.
   - Lowercase, replace non-`[a-z0-9]` runs with `-`, trim leading/trailing `-`.
   - Strip a trailing single-letter `-s` segment (e.g. `Smithwick's` → `smithwick`).
2. Add `logo:"logos/<slug>.svg"` as the LAST field in the beer entry.
3. Confirm the beer's `style` exists in `sC` and its `origin` country code exists in `BADGE_BG` (both near the top of `script.js`). If `BADGE_BG` lacks the code, add it; mirror the same entry in `scripts/build-logos.mjs`.
4. Run `node scripts/build-logos.mjs` from the repo root to generate the SVG. The script fails loudly if anything is missing.
5. Commit BOTH the `script.js` change AND the new `logos/<slug>.svg` file.

Verification: reload the page with DevTools open. `[LOGO CHECK]` must be silent. Throttle Network to "Offline" and reload — every beer's badge must render.

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
- [ ] `logo` field added; value equals `"logos/" + slugify(beer name) + ".svg"`
- [ ] `logos/<slug>.svg` exists in the repo (regenerated via `node scripts/build-logos.mjs`)
- [ ] `origin` code exists in `BADGE_BG` and `style` exists in `sC`

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
