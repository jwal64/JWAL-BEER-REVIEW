# logos/

Every beer's logo is hardcoded here as a local file. The site loads
`logos/manifest.js` (generated, mapping beer name → file path) **before**
`script.js`, so logos render synchronously from the repo with no runtime
CDN dependency.

## Adding a logo (run the script)

When you add a new beer to `script.js` (and to `BRAND_DOMAINS`), pull its
logo down with:

```sh
node scripts/fetch-logos.mjs                 # fill in anything missing
node scripts/fetch-logos.mjs --force         # re-download everything
node scripts/fetch-logos.mjs "New Beer Name" # fetch just one
```

The script tries, in order: a manual URL from `scripts/logo-overrides.json`,
then Brandfetch, then Google favicons, then Icon Horse. It saves the result
as `logos/<slug>.<ext>` (extension picked from the response content-type)
and rewrites `logos/manifest.js`. Commit both the new image and the updated
manifest.

If the script reports a beer as FAIL, find a working logo URL, add it to
`scripts/logo-overrides.json` keyed by the exact beer name, and re-run.

## Manual override on a single beer

You can still pin a specific file by adding `logo:"logos/<file>"` as the
last field on that beer's entry in `beers[]`. It takes precedence over the
manifest. Useful when the auto-fetched logo is wrong or you want to ship a
custom asset.

## Runtime fallback

If a local file is missing at request time (e.g. you forgot to commit it),
the existing Brandfetch → Google favicons → Icon Horse → 🍺 emoji chain
still kicks in.
