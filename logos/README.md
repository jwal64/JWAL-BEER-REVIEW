# logos/

Local logo files. A file here is the **only** logo source that can't 404,
rate-limit, or quietly start returning a different brand's mark — and it is the
only one that works with no network at all.

## Filling it automatically

```sh
npm run logos                       # what does each beer resolve to, and how big?
npm run logos -- --save             # download the best source for every beer into
                                    # logos/ and point its `logo` field at the file
npm run logos -- --save --relink    # …replacing logos that are already set, too
```

`--save` writes `logos/<beer-slug>.<ext>` and adds `logo:"logos/…"` to that
beer's entries in `data.js`. Run `npm run check` and read the diff afterwards.

**A beer that already has a `logo` field is left alone.** Those were chosen by
hand — a local file, or a particular image someone picked — so `--save` never
overwrites one; it lists what it skipped instead. `--relink` is how you say you
meant to replace them.

Both need the open internet — they request the same URLs the page does.

## Adding one by hand

1. Save the file here, e.g. `logos/heineken.svg` (`.svg`, `.png`, `.webp`, `.jpg`).
   Prefer SVG: a vector is sharp at every size the site draws it.
2. Add a `logo` field to that beer's entries in `beers[]` in `data.js`:
   ```js
   {beer:"Heineken", ..., year:2026, logo:"logos/heineken.svg"},
   ```

That file becomes the beer's first source. The Brandfetch → favicon → Icon Horse
chain stays behind it as fallback if the file is ever missing or renamed.

## Notes

- A `logo` field pointing at a **remote URL** works, but it is a hotlink to
  someone else's server. `npm run check` warns about those; `--save` turns them
  into local files.
- Files here are not auto-discovered — a beer uses one only via its `logo` field.
- A local override does **not** remove the need for a `BRAND_DOMAINS` entry: the
  remote chain is still the fallback.
- Anything below `LOGO_MIN_PX` (128px, set in `app.js`) is treated as a favicon
  rather than a logo, so a small file here will be skipped in favour of a larger
  remote one.
