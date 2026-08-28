# logos/

Drop brewery/beer logo files here to override the runtime Brandfetch fetch for specific beers.

## Workflow

1. Save a logo file in this directory, e.g. `logos/heineken.svg` (any image format browsers support works: `.svg`, `.png`, `.webp`, `.jpg`).
2. In `script.js`, add a `logo` field to that beer's entry in `beers[]`:
   ```js
   {beer:"Heineken", ..., year:2026, logo:"logos/heineken.svg"},
   ```
3. That beer now uses your local file as the primary logo source. If the file 404s for any reason, the existing Brandfetch → Google favicons → Icon Horse → 🍺 fallback chain still kicks in.

## When to reach for this

A local file is the only way to make a logo *certain*. Use it when `auditLogos()`
(run in the browser console) reports a beer as `PLACEHOLDER` or `suspect` and no
correct brand domain exists in `BRAND_DOMAINS` to fix it — some small breweries
simply aren't in Brandfetch or the favicon services.

## Notes

- Beers without a `logo` field keep using the Brandfetch chain (real brand logos online, 🍺 offline).
- The filename is up to you. The slug suggested by the original SOP is `lowercase-with-hyphens` but anything works.
- Files in this directory aren't auto-discovered — you must add the `logo` field on the beer entry for the override to take effect.
- A local override does **not** remove the need for a `BRAND_DOMAINS` entry: the remote chain is still the fallback if the file is ever missing or renamed.
