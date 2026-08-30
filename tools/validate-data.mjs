#!/usr/bin/env node
// Checks every rule CLAUDE.md states about the data, so a missing country code
// or an unlisted brewery fails here instead of rendering as a blank flag or a
// 🍺 placeholder that nobody notices for a month.
//
// Zero dependencies, nothing to install: `node tools/validate-data.mjs`.
// Errors fail the run; warnings are printed and tolerated.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadData, loadStyleColors, loadAppConst, ROOT } from './load-data.mjs';

const METHODS = ['Bottle', 'Can', 'Draft', 'Nitro'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOMAIN_RE = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i;

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const isStr = v => typeof v === 'string' && v.trim() !== '';
const isNum = v => typeof v === 'number' && Number.isFinite(v);
const isQuarter = v => isNum(v) && v >= 0 && v <= 5 && Math.round(v * 4) === v * 4;

const D = loadData();
const sC = loadStyleColors();
// app.js's own name normaliser — the one the page uses to decide whether a
// shortlist entry has already been drunk. Loaded rather than copied so the two
// can never disagree about it.
const wtNorm = loadAppConst('wtNorm');
const { FLAGS, CNAMES, beers, drunkLocs, breweries, BRAND_DOMAINS,
        UNTAPPD_GLOBAL_AVGS, UNTAPPD_LAST_REFRESHED, UNTAPPD_REFRESH_INTERVAL_DAYS,
        WANT_TO_TRY } = D;

// A country code has to carry both a flag and a display name — one without the
// other renders a blank or the literal code.
function checkCC(where, field, cc) {
  if (!isStr(cc)) return err(where, `${field} is missing`);
  if (!FLAGS[cc]) err(where, `${field} "${cc}" has no flag in FLAGS`);
  if (!CNAMES[cc]) err(where, `${field} "${cc}" has no name in CNAMES`);
}

// ── BEERS ─────────────────────────────────────────────────────
const beerNames = new Set(beers.map(b => b.beer));
const locKey = (city, cc) => `${city}|${cc}`;
const knownLocs = new Set(drunkLocs.map(l => locKey(l.city, l.cc)));
const brewedBeers = new Map();   // beer name → brewery that claims it
for (const br of breweries)
  for (const n of String(br.beers || '').split('·').map(s => s.trim()).filter(Boolean))
    brewedBeers.set(n, br.name);

beers.forEach((b, i) => {
  const where = `beers[${i}] ${b.beer || '(unnamed)'}`;
  if (!isStr(b.beer)) err(where, 'beer name is missing');
  if (!isStr(b.style)) err(where, 'style is missing');
  else if (!sC[b.style]) err(where, `style "${b.style}" has no colour in the sC map in app.js`);
  checkCC(where, 'origin', b.origin);
  if (!isNum(b.abv) || b.abv <= 0 || b.abv > 20) err(where, `abv ${b.abv} is not a plausible number`);
  if (!METHODS.includes(b.method)) err(where, `method "${b.method}" is not one of ${METHODS.join(', ')}`);
  if (!isQuarter(b.rating)) err(where, `rating ${b.rating} is not 0–5 in quarter steps`);
  if (typeof b.isNew !== 'boolean') err(where, 'isNew must be true or false');
  const mi = MONTHS.indexOf(b.month);
  if (mi === -1) err(where, `month "${b.month}" is not a 3-letter abbreviation`);
  else if (b.monthN !== mi + 1) err(where, `monthN ${b.monthN} does not match month "${b.month}"`);
  if (!Number.isInteger(b.year) || b.year < 2000 || b.year > 2100) err(where, `year ${b.year} is out of range`);

  // Consumption location
  checkCC(where, 'cc', b.cc);
  if (!isStr(b.city)) err(where, 'city is missing');
  if (!isStr(b.region)) err(where, 'region is missing');
  if (CNAMES[b.cc] && b.country !== CNAMES[b.cc])
    err(where, `country "${b.country}" does not match CNAMES.${b.cc} ("${CNAMES[b.cc]}")`);
  if (isStr(b.city) && isStr(b.cc) && !knownLocs.has(locKey(b.city, b.cc)))
    err(where, `consumption city "${b.city}" (${b.cc}) is not in drunkLocs[] — the maps would drop it`);

  // Provenance and rendering
  if (!brewedBeers.has(b.beer))
    err(where, 'no brewery in breweries[] lists this beer, so it has no origin story or map pin');
  if (!BRAND_DOMAINS[b.beer])
    err(where, 'no BRAND_DOMAINS entry, so it renders the 🍺 placeholder');
  // A logo override is normally a file in logos/. A remote URL works too, but
  // it is a hotlink to someone else's server: it can 404 or change without
  // notice, so it is called out rather than trusted.
  if (b.logo !== undefined) {
    if (!isStr(b.logo)) err(where, 'logo override must be a path string');
    else if (/^https?:\/\//.test(b.logo)) warn(where, `logo override hotlinks ${new URL(b.logo).host} — save the file into logos/ instead to make it reliable`);
    else if (!existsSync(join(ROOT, b.logo))) err(where, `logo override "${b.logo}" does not exist`);
  }
});

// ── BREWERIES ─────────────────────────────────────────────────
const seenBrewery = new Set();
breweries.forEach((br, i) => {
  const where = `breweries[${i}] ${br.name || '(unnamed)'}`;
  if (!isStr(br.name)) err(where, 'name is missing');
  else if (seenBrewery.has(br.name)) err(where, 'duplicate brewery entry');
  else seenBrewery.add(br.name);
  if (!isStr(br.location)) err(where, 'location is missing');
  checkCC(where, 'cc', br.cc);
  if (CNAMES[br.cc] && br.country !== CNAMES[br.cc])
    err(where, `country "${br.country}" does not match CNAMES.${br.cc} ("${CNAMES[br.cc]}")`);
  if (!isStr(br.lang) || !/^[a-z]{2}$/.test(br.lang))
    err(where, `lang "${br.lang}" is not a 2-letter ISO 639-1 code`);
  if (!isNum(br.lat) || br.lat < -90 || br.lat > 90) err(where, `lat ${br.lat} is out of range`);
  if (!isNum(br.lng) || br.lng < -180 || br.lng > 180) err(where, `lng ${br.lng} is out of range`);

  const listed = String(br.beers || '').split('·').map(s => s.trim()).filter(Boolean);
  if (!listed.length) err(where, 'beers field is empty');
  if (!Array.isArray(br.ratings) || !br.ratings.every(isQuarter))
    err(where, 'ratings must be an array of 0–5 values in quarter steps');
  else if (br.ratings.length !== listed.length)
    err(where, `${listed.length} beer(s) listed but ${br.ratings.length} rating(s) — they are read as a pair`);
  listed.forEach((n, j) => {
    if (!beerNames.has(n)) return warn(where, `lists "${n}", which has no review in beers[] yet`);
    // The brewery's ratings mirror the reviews; a drift means one was edited alone.
    const reviews = beers.filter(b => b.beer === n).map(b => b.rating);
    const claimed = br.ratings[j];
    if (claimed !== undefined && !reviews.includes(claimed))
      err(where, `rating ${claimed} for "${n}" matches no review of it (${reviews.join(', ') || 'none'})`);
  });
});

// ── LOCATIONS ─────────────────────────────────────────────────
const usedLocs = new Set(beers.map(b => locKey(b.city, b.cc)));
const seenLoc = new Set();
drunkLocs.forEach((l, i) => {
  const where = `drunkLocs[${i}] ${l.city || '(unnamed)'}`;
  if (!isStr(l.city)) err(where, 'city is missing');
  if (!isStr(l.region)) err(where, 'region is missing');
  checkCC(where, 'cc', l.cc);
  if (CNAMES[l.cc] && l.country !== CNAMES[l.cc])
    err(where, `country "${l.country}" does not match CNAMES.${l.cc} ("${CNAMES[l.cc]}")`);
  if (!isNum(l.lat) || l.lat < -90 || l.lat > 90) err(where, `lat ${l.lat} is out of range`);
  if (!isNum(l.lng) || l.lng < -180 || l.lng > 180) err(where, `lng ${l.lng} is out of range`);
  const k = locKey(l.city, l.cc);
  if (seenLoc.has(k)) err(where, 'duplicate location entry');
  seenLoc.add(k);
  if (!usedLocs.has(k)) warn(where, 'no review was logged here');
});

// ── BRAND DOMAINS ─────────────────────────────────────────────
const logoBeers = new Set([...beerNames, ...WANT_TO_TRY.map(e => e.beer)]);
for (const [name, value] of Object.entries(BRAND_DOMAINS)) {
  const where = `BRAND_DOMAINS["${name}"]`;
  const list = Array.isArray(value) ? value : [value];
  if (!list.length) err(where, 'has no domain');
  for (const d of list) {
    if (!isStr(d)) err(where, 'domain must be a non-empty string');
    else if (!DOMAIN_RE.test(d)) err(where, `"${d}" is not a bare domain (no scheme or path)`);
  }
  if (!logoBeers.has(name)) warn(where, 'no beer or shortlist entry uses this domain');
}
for (const name of logoBeers)
  if (!BRAND_DOMAINS[name]) err(`BRAND_DOMAINS`, `"${name}" renders a logo but has no entry`);

// ── UNTAPPD CONSENSUS ─────────────────────────────────────────
for (const [name, v] of Object.entries(UNTAPPD_GLOBAL_AVGS)) {
  const where = `UNTAPPD_GLOBAL_AVGS["${name}"]`;
  if (!isNum(v) || v < 0 || v > 5) err(where, `${v} is not a 0–5 rating`);
  if (!beerNames.has(name)) err(where, 'matches no beer in beers[] — the contrarian chart silently drops it');
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(String(UNTAPPD_LAST_REFRESHED)))
  err('UNTAPPD_LAST_REFRESHED', `"${UNTAPPD_LAST_REFRESHED}" is not YYYY-MM-DD`);
if (!Number.isInteger(UNTAPPD_REFRESH_INTERVAL_DAYS) || UNTAPPD_REFRESH_INTERVAL_DAYS < 1)
  err('UNTAPPD_REFRESH_INTERVAL_DAYS', 'must be a positive whole number of days');

// ── WANT TO TRY ───────────────────────────────────────────────
// Crossing an entry off is done by name: a review whose beer matches the
// entry's name (or one of its `as` names) retires it from the shortlist. So a
// name that agrees with nothing is not a cosmetic problem — it leaves a beer
// sitting on the "still to drink" list that was drunk months ago.
const normBeerNames = new Map([...beerNames].map(n => [wtNorm(n), n]));
const tokens = k => new Set(k.split(' ').filter(Boolean));
const subset = (a, b) => [...a].every(t => b.has(t));
const seenWant = new Set();
WANT_TO_TRY.forEach((e, i) => {
  const where = `WANT_TO_TRY[${i}] ${e.beer || '(unnamed)'}`;
  if (!isStr(e.beer)) return err(where, 'beer name is missing');
  if (!sC[e.style]) err(where, `style "${e.style}" has no colour in the sC map in app.js`);
  checkCC(where, 'origin', e.origin);
  if (!isStr(e.region)) err(where, 'region is missing');
  if (!isNum(e.abv) || e.abv <= 0 || e.abv > 20) err(where, `abv ${e.abv} is not a plausible number`);
  if (!isNum(e.untappd) || e.untappd < 0 || e.untappd > 5) err(where, `untappd ${e.untappd} is not a 0–5 rating`);
  if (!METHODS.includes(e.method)) err(where, `method "${e.method}" is not one of ${METHODS.join(', ')}`);

  const names = [e.beer, ...(e.as || [])];
  if (e.as !== undefined && (!Array.isArray(e.as) || !e.as.length || !e.as.every(isStr)))
    err(where, 'as must be a non-empty array of other names this beer is logged under');
  for (const n of e.as || [])
    if (wtNorm(n) === wtNorm(e.beer)) err(where, `as lists "${n}", which is the entry's own name`);

  const key = wtNorm(e.beer);
  if (seenWant.has(key)) err(where, 'is on the shortlist twice');
  seenWant.add(key);

  // Already drunk? Then nothing more to check — the entry has crossed itself
  // off and now scores its own prediction.
  if (names.some(n => normBeerNames.has(wtNorm(n)))) return;
  // Not drunk, as far as the names say. Warn on the near-misses, which are
  // where a shelf name and a logged name have quietly drifted apart.
  const near = [...normBeerNames].filter(([k]) => {
    const a = tokens(key), b = tokens(k);
    return k !== key && (subset(a, b) || subset(b, a));
  }).map(([, n]) => `"${n}"`);
  if (near.length)
    warn(where, `still on the shortlist, but ${near.join(' / ')} is already reviewed — add as:[…] if it is the same beer`);
});

// ── REPORT ────────────────────────────────────────────────────
const wantPending = WANT_TO_TRY.filter(e =>
  ![e.beer, ...(e.as || [])].some(n => normBeerNames.has(wtNorm(n)))).length;
const counts = `${beers.length} reviews · ${breweries.length} breweries · ${drunkLocs.length} locations · ${Object.keys(BRAND_DOMAINS).length} brand domains · ${wantPending}/${WANT_TO_TRY.length} still to try`;
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  · ${w}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\nData check failed (${counts}).\n`);
  process.exit(1);
}
console.log(`\nData check passed — ${counts}.\n`);
