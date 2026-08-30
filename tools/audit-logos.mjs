#!/usr/bin/env node
// Asks, for every beer that renders a logo anywhere in the app: what does its
// source chain actually return, and is it big enough to be the real logo?
//
//   node tools/audit-logos.mjs            report
//   node tools/audit-logos.mjs --save     also save the best source into logos/
//                                         and point the beer's `logo` field at it
//   … --save --relink                     replace `logo` fields that are already
//                                         set, which --save otherwise leaves alone
//
// Needs the open internet — it requests the same URLs the page does. Behind a
// proxy that blocks the logo CDNs every beer reports MISSING, which says
// nothing about the domains; run it somewhere the browser could reach them.
//
// `--save` is how a beer's logo becomes permanent: a file in logos/ is the only
// source that can't 404, rate-limit or quietly change to a different brand's
// mark, and it keeps working with no network at all.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadData, loadLogoConfig, ROOT } from './load-data.mjs';
import { imageSize, extFor } from './image-size.mjs';

const SAVE = process.argv.includes('--save');
const RELINK = process.argv.includes('--relink');
const ONLY = process.argv.find(a => a.startsWith('--only='))?.slice(7);
const TIMEOUT = 15000;

const D = loadData();
const { logoURL, logoFallbackURL, logoFallback2URL, LOGO_MIN_PX } = loadLogoConfig();

const localLogo = new Map(D.beers.filter(b => b.logo).map(b => [b.beer, b.logo]));
const domainsOf = name => {
  const d = D.BRAND_DOMAINS[name];
  return d ? (Array.isArray(d) ? d : [d]) : [];
};

// Same order as logoSources() in app.js: every domain at each tier before
// dropping to the next, because a real logo for a beer's second domain beats a
// favicon for its first.
function sourcesFor(name) {
  const out = [];
  const local = localLogo.get(name);
  if (local) out.push({ tier: 'local', url: /^https?:/.test(local) ? local : `file:${join(ROOT, local)}` });
  const doms = domainsOf(name);
  for (const d of doms) out.push({ tier: 'brandfetch', url: logoURL(d) });
  for (const d of doms) out.push({ tier: 'favicon', url: logoFallbackURL(d) });
  for (const d of doms) out.push({ tier: 'iconhorse', url: logoFallback2URL(d) });
  return out;
}

async function fetchImage(url) {
  if (url.startsWith('file:')) {
    const path = url.slice(5);
    return existsSync(path) ? { buf: readFileSync(path) } : { error: 'missing' };
  }
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: ac.signal, redirect: 'follow' });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length ? { buf } : { error: 'empty' };
  } catch (e) {
    return { error: e.name === 'AbortError' ? 'timeout' : (e.cause?.code ?? e.message) };
  } finally { clearTimeout(timer); }
}

// Walk a beer's sources the way the browser does: keep the first that comes
// back at LOGO_MIN_PX or better, remember the largest seen in case none does.
async function resolve(name) {
  const sources = sourcesFor(name);
  if (!sources.length) return { beer: name, result: 'NO DOMAIN' };
  let best = null;
  for (const s of sources) {
    const { buf, error } = await fetchImage(s.url);
    if (error) continue;
    const size = imageSize(buf);
    if (!size) continue;
    const hd = size.w >= LOGO_MIN_PX;
    const candidate = { beer: name, result: s.tier, size, url: s.url, buf, hd };
    if (hd) return candidate;
    if (!best || size.w > best.size.w) best = candidate;
  }
  return best ? { ...best, result: `${best.result} (small)` } : { beer: name, result: 'MISSING' };
}

const slug = name => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Adds `logo:"logos/…"` to a beer's entry in data.js, or repoints an existing
// one. Matched on the entry's own `beer:"…"` key so only that line changes.
// Adds `logo:"logos/…"` to a beer's entries in data.js, or repoints existing
// ones. Anchored on the entry's own `beer:"…"` key, so only the lines for that
// beer change — and every one of them does, since the same beer can appear in
// several months.
function setLogoField(name, path) {
  const file = join(ROOT, 'data.js');
  const src = readFileSync(file, 'utf8');
  const lit = JSON.stringify(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const line = new RegExp(`^\\s*\\{beer:${lit},.*$`, 'gm');
  let hits = 0;
  const out = src.replace(line, entry => {
    hits++;
    return entry
      .replace(/,\s*logo:"[^"]*"(?=\s*\})/, '')          // drop the old override
      .replace(/\}(,?)\s*$/, `,logo:"${path}"}$1`);       // add the new one
  });
  if (hits) writeFileSync(file, out);
  return hits;
}

const names = [...new Set([...D.beers.map(b => b.beer),
  ...D.IPO_WATCHLIST.map(e => e.beer), ...D.IPO_CANDIDATES.map(e => e.beer)])]
  .filter(n => !ONLY || n.toLowerCase().includes(ONLY.toLowerCase())).sort();

console.log(`\nChecking ${names.length} beers against the logo chain (HD = ${LOGO_MIN_PX}px or better)…\n`);

const rows = [];
const LANES = 6;
const queue = [...names];
await Promise.all(Array.from({ length: LANES }, async () => {
  while (queue.length) {
    const r = await resolve(queue.shift());
    rows.push(r);
    const dim = r.size ? (r.size.w === Infinity ? 'vector' : `${r.size.w}×${r.size.h}`) : '—';
    console.log(`  ${r.hd || r.size?.w === Infinity ? 'HD  ' : '    '} ${r.beer.padEnd(34)} ${String(r.result).padEnd(20)} ${dim}`);
  }
}));

rows.sort((a, b) => a.beer.localeCompare(b.beer));
const missing = rows.filter(r => r.result === 'MISSING' || r.result === 'NO DOMAIN');
const small = rows.filter(r => r.result.endsWith('(small)'));
const hd = rows.filter(r => r.hd);

console.log(`\n${hd.length}/${rows.length} in high definition.`);
if (small.length) {
  console.log(`\n${small.length} resolved below ${LOGO_MIN_PX}px — a favicon, not the brand's logo:`);
  for (const r of small) console.log(`  · ${r.beer} (${r.size.w}×${r.size.h}, ${domainsOf(r.beer).join(', ')})`);
}
if (missing.length) {
  console.log(`\n${missing.length} resolved nothing and render the 🍺 placeholder:`);
  for (const r of missing) console.log(`  · ${r.beer} (${domainsOf(r.beer).join(', ') || 'no domain'})`);
}
// Everything failing at once says more about the network than about the data:
// a blocked or offline run looks exactly like every domain being wrong.
const allGone = missing.length === rows.length && rows.length > 1;
if (allGone)
  console.log(`\nNot one source answered. That is what a blocked proxy or an offline run looks\nlike — check the network before changing any domain.`);
else if (small.length || missing.length)
  console.log(`\nFix the domain in BRAND_DOMAINS, or re-run with --save to store what did resolve.`);

if (SAVE) {
  const dir = join(ROOT, 'logos');
  mkdirSync(dir, { recursive: true });
  let saved = 0;
  const kept = [];
  for (const r of rows) {
    if (!r.buf) continue;
    const beerHasEntry = D.beers.some(b => b.beer === r.beer);
    if (!beerHasEntry) continue;                          // watchlist-only: nothing to point at
    // A beer that already has a `logo` field was chosen by hand — a local file,
    // or a URL someone picked deliberately. Leave it alone; --relink is how you
    // say you meant to replace it.
    if (localLogo.has(r.beer) && !RELINK) { kept.push(r.beer); continue; }
    const name = slug(r.beer) + extFor(r.size);
    writeFileSync(join(dir, name), r.buf);
    if (setLogoField(r.beer, `logos/${name}`)) saved++;
  }
  console.log(`\nSaved ${saved} logo(s) into logos/ and pointed data.js at them.`);
  if (kept.length) {
    console.log(`Left ${kept.length} beer(s) with a logo already set untouched:`);
    for (const n of kept) console.log(`  · ${n} → ${localLogo.get(n)}`);
    console.log(`Pass --relink to replace those too.`);
  }
  console.log(`Run \`npm run check\` and review the diff before committing.\n`);
} else {
  console.log('');
}

process.exit(missing.length ? 1 : 0);
