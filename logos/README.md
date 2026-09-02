# logos/

Every beer's logo, one file per beer name. This directory is not an override
mechanism any more — it is where logos live.

A beer's file is named in `BRAND_LOGOS` in `../data.js`. `npm run check` fails on a beer that
has neither.

## Why they are here rather than fetched

They used to be fetched at page load from Brandfetch, then Google, then Icon
Horse. Brandfetch began answering 403 to the public client ID the site
embedded — every domain, every URL shape — so the first tier resolved nothing,
and 97 of 101 beers fell through to Google's *default* 16px favicon. The site
rendered a hundred identical grey globes for a month. Nothing in the repo had
changed, and nothing in it could have noticed.

A file we hold cannot be withdrawn by the service that was lending it. The
remote chain is still there, as the fallback for a beer added through a beer whose logo has not been fetched yet.

## Getting one

```sh
npm run fetch-logos                        # everything with no file yet
npm run fetch-logos -- --force --only "Sol"
npm run logo-sheet                         # then look at the result
```

`tools/fetch-logos.mjs` takes the first tier that answers for the beer's brand
domains: the icons the site declares, then the logo drawn in its header, then
the favicon services, then a square-ish `og:image`. Rasters land as WebP at the
image's own longest edge, capped at 256px; SVG is written through untouched.

## Putting one here by hand

For a brand no source has, save the file yourself — any format a browser
renders (`.svg`, `.png`, `.webp`, `.jpg`) — as `<beer-name-slugified>.<ext>`,
and add its entry to `BRAND_LOGOS`. `logos/daura.svg` is the worked example.

**A file the fetcher did not write is never replaced**, `--force` included: it
knows which files are its own from `logo-fetch-report.json`, and leaves the
rest alone.

## What to check before trusting one

`npm run logo-sheet` draws every logo on a half-light, half-dark tile. Look at
it. Nothing automated can tell a brand's mark from a photograph of a bottle or
from a generated grey letter — all three load, are the right size, and pass
every check there is.
