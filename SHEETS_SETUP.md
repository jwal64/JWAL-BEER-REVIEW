# Google Sheets Integration — Setup Guide

Manage your beer data from a Google Sheet instead of editing `script.js` directly. No PRs needed to add beers!

## Master Data Sheet

The live master data sheet is:
https://docs.google.com/spreadsheets/d/1vxm8-QfSdWzztdlKts692Zc0t-nCTojLzrL0J1yGDAM/edit

Sheet ID: `1vxm8-QfSdWzztdlKts692Zc0t-nCTojLzrL0J1yGDAM` — already wired into `SHEETS_CONFIG` in `script.js`. The sheet must have three tabs named `Beers`, `Breweries`, and `Locations`, and be published to the web (File → Share → Publish to web → Entire Document → CSV) so the gviz CSV endpoint can read it.

## Quick Start (5 minutes)

### 1. Create Your Google Sheet

Create a new Google Sheet with **3 tabs** (named exactly):

- **Beers**
- **Breweries**
- **Locations**

### 2. Set Up Column Headers

#### Beers tab
| beer | style | origin | abv | method | city | region | country | cc | rating | isNew | month | monthN | year |
|------|-------|--------|-----|--------|------|--------|---------|-----|--------|-------|-------|--------|------|
| Grolsch | Pilsner-Other | NL | 5.0 | Bottle | Hengelo | Overijssel | Netherlands | NL | 3.50 | false | Jan | 1 | 2026 |

#### Breweries tab
| name | location | country | cc | lang | beers | lat | lng | ratings | nativeName |
|------|----------|---------|-----|------|-------|-----|-----|---------|------------|
| Grolsch | Enschede, Overijssel | Netherlands | NL | nl | Grolsch · Grolsch Puur Weizen | 52.2215 | 6.8937 | 3.50,5.00 | |

> **ratings** column: comma-separated numbers (e.g. `3.50,5.00,4.25`)
> **nativeName** column: leave blank if the native name matches the marketed name

#### Locations tab
| city | region | country | cc | lat | lng |
|------|--------|---------|-----|-----|-----|
| New York | New York | USA | US | 40.7128 | -74.0060 |

### 3. Publish the Sheet

1. Open your Google Sheet
2. Go to **File → Share → Publish to web**
3. Select **Entire Document** and **CSV** format
4. Click **Publish**
5. Copy the URL — you need the **Sheet ID** from it

The Sheet ID is the long string in the URL between `/d/` and `/edit`:
```
https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SHEET_ID/edit
```

### 4. Enable in script.js

Open `script.js` and update `SHEETS_CONFIG` at the top:

```js
const SHEETS_CONFIG = {
  enabled: true,                           // ← Change to true
  sheetId: 'YOUR_SHEET_ID_HERE',           // ← Paste your Sheet ID
  beersTab: 'Beers',
  breweriesTab: 'Breweries',
  locationsTab: 'Locations'
};
```

That's it! The site will now load live data from your Google Sheet.

## How It Works

- On page load, the site fetches CSV data from all 3 tabs in parallel
- Data is parsed and replaces the hardcoded arrays
- All stats, charts, and maps are recomputed with the fresh data
- If the sheet is unavailable (offline, private, etc.), the hardcoded data in `script.js` is used as fallback
- User-added beers from `localStorage` are still merged in after sheet data loads

## Tips

- **Adding a beer**: Just add a new row to the Beers tab. Refresh the site to see it.
- **No deploy needed**: Since the sheet is fetched live, changes appear on refresh.
- **Bulk edits**: Use Sheet features like filters, sorting, and data validation to manage your data.
- **Backup**: The hardcoded data in `script.js` always serves as a fallback.
- **Column order**: Doesn't matter — the loader matches by header name, not position.
- **Tab names**: Must match exactly what's in `SHEETS_CONFIG` (default: Beers, Breweries, Locations).

## Template Sheet

To get started quickly, you can copy all your existing data from `script.js` into the sheet. The current dataset has:
- **51 beers** in the Beers tab
- **25 breweries** in the Breweries tab
- **11 locations** in the Locations tab

## Field Reference

See `CLAUDE.md` for the full field reference, including:
- Valid style formats
- ISO country codes and language codes
- Native name conventions
- Required vs optional fields
