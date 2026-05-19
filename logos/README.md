# logos/

Every beer's logo is hardcoded here as a local file. The site loads
`logos/manifest.js` (generated, mapping beer name → file path) **before**
`script.js`, so logos render synchronously from the repo with no runtime
CDN dependency.

## Adding a logo (CI does it)

The `.github/workflows/fetch-beer-logos.yml` workflow watches `script.js`,
`scripts/fetch-logos.mjs`, and `scripts/logo-overrides.json`. When you push
a branch that adds a beer to `BRAND_DOMAINS`, the workflow runs
`node scripts/fetch-logos.mjs` on a CI runner, downloads the new logo
(Brandfetch → Google favicons → Icon Horse, or a manual URL from
`scripts/logo-overrides.json`), saves it as `logos/<slug>.<ext>` (extension
picked from the response content-type), regenerates `logos/manifest.js`,
and commits the result back to your branch with `[skip-logo-fetch]` in the
message.

`git pull` after the workflow finishes to grab the new files.

If the job summary reports a beer as `FAIL`, find a working image URL
(Wikipedia, the brewery's press kit, the importer's site), add it to
`scripts/logo-overrides.json` keyed by the exact beer name, commit and
push. The override is tried before the Brandfetch chain.

## Local fast loop (optional)

If you have Node 20+ locally and want to skip CI:

```sh
node scripts/fetch-logos.mjs                 # fill in anything missing
node scripts/fetch-logos.mjs --force         # re-download everything
node scripts/fetch-logos.mjs "New Beer Name" # fetch just one
```

## Manual override on a single beer

You can still pin a specific file by adding `logo:"logos/<file>"` as the
last field on that beer's entry in `beers[]`. It takes precedence over the
manifest. Useful when the auto-fetched logo is wrong or you want to ship a
custom asset.

## Runtime fallback

If a local file is missing at request time (e.g. you forgot to commit it),
the existing Brandfetch → Google favicons → Icon Horse → 🍺 emoji chain
still kicks in.
