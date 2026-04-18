# Simplified Data-Entry Sheet

A streamlined Google Sheet / Excel workbook that lets you add a new beer review by filling **only 6 cells**. Everything else (style, ABV, origin, region, country, country code, `monthN`, `isNew`) is looked up by formula from the reference tabs.

## The 6 cells you type

| Column  | Example     | Notes                                    |
|---------|-------------|------------------------------------------|
| beer    | `Grolsch`   | Must match the name used in `Breweries`  |
| rating  | `3.50`      | 0.00 - 5.00 in 0.25 increments           |
| method  | `Bottle`    | `Bottle`, `Can`, `Draft`, or `Nitro`     |
| city    | `Hengelo`   | Must match a city in `Locations`         |
| month   | `Jan`       | 3-letter abbreviation                    |
| year    | `2026`      | 4 digits                                 |

Starter template: [`sheets/entry-template.csv`](entry-template.csv)

## Workbook layout

Create one Google Sheet with **4 tabs**:

| Tab         | Purpose                                  | Seed file                      |
|-------------|------------------------------------------|--------------------------------|
| `Entry`     | The 6-column form you type into          | `sheets/entry-template.csv`    |
| `Beers`     | Auto-generated full rows (what the site reads) | formulas only            |
| `Breweries` | Reference: beer -> style, abv, origin, coords | `sheets/breweries.csv`    |
| `Locations` | Reference: city -> region, country, cc, coords | `sheets/locations.csv`   |

## Entry tab - column layout

Put these as headers in row 1 of `Entry`:

```
A: beer | B: rating | C: method | D: city | E: month | F: year
```

That's it - only A through F get typed values.

## Beers tab - formulas (paste into row 2, then drag down)

This tab mirrors what `script.js` expects. It pulls everything from `Entry` plus the two reference tabs.

Headers (row 1):

```
A: beer | B: style | C: origin | D: abv | E: method | F: city | G: region | H: country | I: cc | J: rating | K: isNew | L: month | M: monthN | N: year
```

Row 2 formulas (Google Sheets syntax - Excel users: swap `;` / `,` per locale, and `IFERROR` works the same):

```
A2: =Entry!A2
B2: =IFERROR(VLOOKUP(A2, Breweries!F:F, 1, FALSE), "")    // style lookup - see note below
C2: =IFERROR(VLOOKUP(A2, Breweries!F:D, -3, FALSE), "")    // origin (cc of brewery)
D2: =""                                                     // abv - fill in manually the first time
E2: =Entry!C2
F2: =Entry!D2
G2: =IFERROR(VLOOKUP(F2, Locations!A:F, 2, FALSE), "")
H2: =IFERROR(VLOOKUP(F2, Locations!A:F, 3, FALSE), "")
I2: =IFERROR(VLOOKUP(F2, Locations!A:F, 4, FALSE), "")
J2: =Entry!B2
K2: =IF(COUNTIF($A$1:A1, A2)=0, TRUE, FALSE)
L2: =Entry!E2
M2: =MATCH(L2, {"Jan";"Feb";"Mar";"Apr";"May";"Jun";"Jul";"Aug";"Sep";"Oct";"Nov";"Dec"}, 0)
N2: =Entry!F2
```

### Style / ABV / origin lookup

The existing `Breweries` tab doesn't list per-beer style or ABV - it lists the brewery. Easiest fix: **add two columns** to `Breweries`, `beerStyle` and `beerAbv`, keyed on beer name. Or just keep a small `BeerCatalog` tab:

```
beer, style, abv, origin
Grolsch, Pilsner, 5.0, NL
Hertog Jan, Pilsner, 5.1, NL
...
```

Then:

```
B2: =IFERROR(VLOOKUP(A2, BeerCatalog!A:D, 2, FALSE), "")   // style
C2: =IFERROR(VLOOKUP(A2, BeerCatalog!A:D, 4, FALSE), "")   // origin
D2: =IFERROR(VLOOKUP(A2, BeerCatalog!A:D, 3, FALSE), "")   // abv
```

That way adding a **new** beer only takes one extra row in `BeerCatalog`, and every consumption row afterwards is 6 cells.

## Adding a new beer - workflow

1. Is the beer already in `BeerCatalog`? If no, add one row: `name, style, abv, origin`.
2. Is the city already in `Locations`? If no, add one row with its coords.
3. Go to `Entry`, fill 6 cells in the next empty row. Done.

## Publishing to the site

Follow `SHEETS_SETUP.md`:
- The published tab must be named `Beers` (the formula-filled tab), not `Entry`.
- `File -> Share -> Publish to web -> CSV`.
- Drop the Sheet ID into `SHEETS_CONFIG` in `script.js`.

## Data-validation niceties (optional, Google Sheets)

- `Entry!C` (method): Data validation -> list of items -> `Bottle, Can, Draft, Nitro`.
- `Entry!E` (month): list -> `Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec`.
- `Entry!B` (rating): number between 0 and 5, increment 0.25.
- `Entry!A` (beer) and `Entry!D` (city): dropdown from the reference tabs to avoid typos.
