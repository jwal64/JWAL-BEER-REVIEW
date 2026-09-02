#!/usr/bin/env node
// Writes data/ — the same reviews as data.js, in formats something other than
// this site can read. A host that wants the data in a database imports the
// JSON; a spreadsheet opens the CSV.
//
// data.js stays the source of truth. Everything under data/ is generated:
// edit data.js, then run `npm run export`. `npm run check` fails if the two
// have drifted.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadData, loadAppConst, ROOT } from './load-data.mjs';

const OUT = join(ROOT, 'data');
const splitBeers = s => String(s || '').split('·').map(v => v.trim()).filter(Boolean);

const D = loadData();

// ── Shapes ────────────────────────────────────────────────────
// One row per pour, exactly as reviewed. `beer` is not unique: the same beer
// drunk twice is two rows, which is what the ratings are averages of.
const beers = D.beers.map(b => ({
  beer: b.beer, style: b.style, origin: b.origin, originCountry: D.CNAMES[b.origin] ?? null,
  abv: b.abv, method: b.method,
  city: b.city, region: b.region, country: b.country, cc: b.cc,
  rating: b.rating, isNew: b.isNew, month: b.month, monthN: b.monthN, year: b.year,
  ...(b.logo ? { logo: b.logo } : {}),
}));

// One row per brewery. `beers` and `ratings` are positional pairs in data.js;
// here they are one list of {beer, rating} so the pairing can't be lost.
const breweries = D.breweries.map(br => {
  const names = splitBeers(br.beers);
  return {
    name: br.name, location: br.location, country: br.country, cc: br.cc, lang: br.lang,
    ...(br.nativeName ? { nativeName: br.nativeName } : {}),
    lat: br.lat, lng: br.lng,
    beers: names.map((beer, i) => ({ beer, rating: br.ratings?.[i] ?? null })),
  };
});

const locations = D.drunkLocs.map(l => ({ ...l }));

// Where each beer's logo comes from: the file committed for the brand, and
// the domains the runtime chain falls back to when there isn't one.
const brandDomains = Object.entries(D.BRAND_DOMAINS)
  .map(([beer, d]) => ({ beer, domains: Array.isArray(d) ? d : [d],
                         logo: (D.BRAND_LOGOS ?? {})[beer] ?? null }));

const untappd = {
  lastRefreshed: D.UNTAPPD_LAST_REFRESHED,
  refreshIntervalDays: D.UNTAPPD_REFRESH_INTERVAL_DAYS,
  averages: Object.entries(D.UNTAPPD_GLOBAL_AVGS).map(([beer, untappdAvg]) => ({ beer, untappdAvg })),
};

// The shortlist, plus whether each entry has been drunk yet — the same
// crossing-off the page does, so a consumer of data/ doesn't have to re-derive
// it by matching names against beers.json.
const wtNorm = loadAppConst('wtNorm');
const reviewedByName = new Map(D.beers.map(b => [wtNorm(b.beer), b.beer]));
const wantToTry = D.WANT_TO_TRY.map(e => {
  const reviewedAs = [e.beer, ...(e.as || [])]
    .map(n => reviewedByName.get(wtNorm(n))).find(Boolean) || null;
  return { ...e, as: e.as || [], tried: reviewedAs !== null, reviewedAs };
});

// ── CSV ───────────────────────────────────────────────────────
const cell = v => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCSV = (rows, cols) =>
  [cols.join(','), ...rows.map(r => cols.map(c => cell(r[c])).join(','))].join('\n') + '\n';

// ── Write ─────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
const written = [];
function write(name, contents) {
  const path = join(OUT, name);
  const next = typeof contents === 'string' ? contents : JSON.stringify(contents, null, 2) + '\n';
  const changed = !existsSync(path) || readFileSync(path, 'utf8') !== next;
  writeFileSync(path, next);
  written.push({ name, changed });
}

write('beers.json', beers);
write('breweries.json', breweries);
write('locations.json', locations);
write('brand-domains.json', brandDomains);
write('untappd-averages.json', untappd);
write('want-to-try.json', wantToTry);

write('beers.csv', toCSV(beers, ['beer','style','origin','originCountry','abv','method','city','region','country','cc','rating','isNew','month','monthN','year']));
write('breweries.csv', toCSV(
  breweries.map(b => ({ ...b, beers: b.beers.map(x => x.beer).join(' · '), ratings: b.beers.map(x => x.rating).join(' · ') })),
  ['name','location','country','cc','lang','nativeName','lat','lng','beers','ratings']));
write('locations.csv', toCSV(locations, ['city','region','country','cc','lat','lng']));

const changed = written.filter(w => w.changed);
console.log(`\nExported ${written.length} file(s) to data/ — ${beers.length} reviews, ${breweries.length} breweries, ${locations.length} locations.`);
if (changed.length) console.log(`Updated: ${changed.map(c => c.name).join(', ')}\n`);
else console.log('Everything was already up to date.\n');

// `--check` is the CI mode: fail rather than write when data/ is stale.
if (process.argv.includes('--check') && changed.length) {
  console.error(`data/ is out of date with data.js. Run \`npm run export\` and commit the result.\n`);
  process.exit(1);
}
