# logos/

Drop brewery/beer logo files here to override the runtime Brandfetch fetch for specific beers.

## Workflow

1. Save a logo file in this directory, e.g. `logos/heineken.svg` (any image format browsers support works: `.svg`, `.png`, `.webp`, `.jpg`).
2. In `data.js`, add a `logo` field to that beer's entry in `beers[]`:
   ```js
   {beer:"Heineken", ..., year:2026, logo:"logos/heineken.svg"},
   ```
   A beer that has not been drunk yet has no `beers[]` row, so its override goes
   on its `WANT_TO_TRY` entry instead — a "What to try" card renders a logo like
   anything else. `rebuildLocalLogos()` reads the shortlist first and reviews
   second, so a beer that is both resolves to what its review says.
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

## What is in here now

Fifteen files, and eleven of them arrived together. That eleven is worth
reading about, because it says something about this directory's whole premise.

The runtime chain this directory overrides is **the one that failed**.
Brandfetch began answering 403 to the public client ID the page embeds — every
domain, every URL shape — so its first tier resolves nothing for anybody, and
what is left is Google's favicon service and Icon Horse. Both answer for the
big brands and shrug at the rest. That is the whole reason
`jwal64/beer-review-buddy` stopped fetching logos at page load and committed a
file for every beer instead.

These eleven are the real brand marks, ported from that repo, where they
replaced drawn approximations and thin favicons:

`guinness-draught` · `newcastle-brown-ale` · `singha` · `smithwicks` ·
`pacifico-clara` · `estrella-jalisco` · `sol` · `pub-ale` ·
`michelob-ultra` · `zywiec` · `negra-modelo`

Two of them — `estrella-jalisco` and `pacifico-clara` — replace **hotlinks**,
not missing logos: their `logo` fields pointed at `pennbeer.com` and
`upload.wikimedia.org`, someone else's servers, which is the failure mode this
file's own note warns about. One hotlink is left, on Dos Equis, pointing at a
WordPress blog's JPEG.

Three of them — `newcastle-brown-ale`, `singha` and `sol` — are on the
shortlist rather than in `beers[]`, which is why the override now reads
`WANT_TO_TRY` too.

**What this does not fix.** Every other beer still resolves through the broken
chain at page load. If the site is showing grey globes, that is why, and the
answer is the one the other repo already took: commit a file per beer. This
eleven is a patch on the worst of it, not the cure.

## Where a real mark can come from when nothing is reachable

A Claude session here has no egress to any logo source — brand domains, Google,
Icon Horse, DuckDuckGo and both Wikimedia hosts all answer `403` at `CONNECT`.
Anonymous git reads of public GitHub repositories *are* served, and these eleven
came from `detain/svg-logos`, 120,484 brand SVGs traced from vector originals.
Two things have to be done to anything taken from it, both presentation rather
than redrawing: the opaque full-bleed plate every file carries comes off
(`d="M0 0h192.756v192.756H0V0z"`, always the first path), and a vector too heavy
for a 64px render is better stored as a 256px WebP.
