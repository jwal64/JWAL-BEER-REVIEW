// Writes data.js from the values the database holds.
//
// The file it produces is the same plain browser JavaScript it has always
// been — top-level `let`/`const` declarations, no imports, no build step — so
// index.html, app.js, tools/load-data.mjs and every check keep working exactly
// as before. What changed is who writes it.
//
// Columns are padded to line up because the file is still read by people: a
// diff after a sync should show the review that was added, not eighty lines
// that shifted a space.

const q = s => JSON.stringify(String(s));
const fixed = (n, dp) => (n === null || n === undefined ? 'null' : Number(n).toFixed(dp));
const pad = (s, w) => s + ' '.repeat(Math.max(0, w - s.length));
const widest = (rows, f) => rows.reduce((w, r) => Math.max(w, f(r).length), 0);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// An object literal written on one line, each field padded to the width of the
// widest value in its column.
function table(rows, spec) {
  const widths = spec.map(([, render]) => widest(rows, render));
  return rows.map(r =>
    '  {' + spec.map(([, render], i) =>
      pad(render(r), i === spec.length - 1 ? 0 : widths[i])).join('') + '},');
}

export function renderDataJs(D) {
  const out = [];
  const push = (...lines) => out.push(...lines);
  const rule = '// ══════════════════════════════════════════════════════════════';

  push(
    rule,
    '// DATA — the store',
    rule,
    '// GENERATED FILE — do not edit by hand.',
    '//',
    '// Every review, brewery, location, brand domain, Untappd average and',
    '// want-to-try entry is written from the Supabase database behind the',
    '// beer-review-buddy app, which is the source of truth. Add a beer there,',
    '// and `npm run sync` — or the Sync from Supabase workflow, which runs it',
    '// nightly — rewrites this file from what the database holds. An edit made',
    '// here is lost at the next sync.',
    '//',
    '// It is still plain browser JavaScript loaded by a <script> tag before',
    '// app.js — no imports, no build step. `beers`, `breweries` and `drunkLocs`',
    '// are `let` so a host that stores the data elsewhere can replace their',
    '// contents and call reloadData() (app.js) to repaint.',
    '//',
    '// Two brewery fields have no column behind them and are derived here from',
    '// the reviews: `beers` (the beers that brewery makes) and `ratings` (what',
    '// each scored). See tools/supabase-rows.mjs.',
    rule,
    '',
  );

  // ── Country maps
  const entries = obj => Object.entries(obj)
    .map(([k, v]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k)}:${q(v)}`).join(',');
  push(
    `const FLAGS={${entries(D.FLAGS)}};`,
    `const CNAMES={${entries(D.CNAMES)}};`,
    '',
  );

  // ── Reviews, grouped by the month they were logged in
  push('// ── REVIEWS — one entry per pour, in the order they were drunk', 'let beers=[');
  const beerLines = table(D.beers, [
    ['beer',    b => `beer:${q(b.beer)},`],
    ['style',   b => `style:${q(b.style)},`],
    ['origin',  b => `origin:${q(b.origin)},`],
    ['abv',     b => `abv:${fixed(b.abv, 1)},`],
    ['method',  b => `method:${q(b.method)},`],
    ['city',    b => `city:${q(b.city)},`],
    ['region',  b => `region:${q(b.region)},`],
    ['country', b => `country:${q(b.country)},`],
    ['cc',      b => `cc:${q(b.cc)},`],
    ['rating',  b => `rating:${fixed(b.rating, 2)},`],
    ['isNew',   b => `isNew:${b.isNew},`],
    ['when',    b => `month:${q(b.month)},monthN:${b.monthN},year:${b.year}` +
                     (b.logo ? `,logo:${q(b.logo)}` : '')],
  ]);
  let group = null;
  D.beers.forEach((b, i) => {
    const key = `${b.year}-${b.monthN}`;
    if (key !== group) {
      group = key;
      const n = D.beers.filter(x => x.year === b.year && x.monthN === b.monthN).length;
      push(`  // ${MONTHS[b.monthN - 1].toUpperCase()} ${b.year} (${n} review${n === 1 ? '' : 's'})`);
    }
    push(beerLines[i]);
  });
  push('];', '');

  // ── Consumption locations
  push('// ── CONSUMPTION LOCATIONS — every city a review was logged in', 'let drunkLocs=[');
  push(...table(D.drunkLocs, [
    ['city',    l => `city:${q(l.city)},`],
    ['region',  l => `region:${q(l.region)},`],
    ['country', l => `country:${q(l.country)},`],
    ['cc',      l => `cc:${q(l.cc)},`],
    ['latlng',  l => `lat:${fixed(l.lat, 4)},lng:${fixed(l.lng, 4)}`],
  ]));
  push('];', '');

  // ── Breweries
  push('// ── BREWERIES — where each beer is actually made', 'let breweries=[');
  push(...table(D.breweries, [
    ['name',     b => `name:${q(b.name)},`],
    ['location', b => `location:${q(b.location)},`],
    ['country',  b => `country:${q(b.country)},`],
    ['cc',       b => `cc:${q(b.cc)},`],
    ['lang',     b => `lang:${q(b.lang)},`],
    ['beers',    b => `beers:${q(b.beers)},`],
    ['native',   b => (b.nativeName ? `nativeName:${q(b.nativeName)},` : '')],
    ['latlng',   b => `lat:${fixed(b.lat, 4)},lng:${fixed(b.lng, 4)},`],
    ['ratings',  b => `ratings:[${b.ratings.map(r => fixed(r, 2)).join(',')}]`],
  ]));
  push('];', '');

  // ── Brand domains
  push(
    rule,
    '// BRAND DOMAINS — where each beer\'s logo is looked up',
    rule,
    '// A beer with no entry here renders the 🍺 placeholder forever; there is no',
    '// name-based guess behind it. A value is one domain, or several tried in',
    '// order for a brand that lives at more than one address.',
    '//',
    '// A domain being present proves nothing about what sits behind it — run',
    '// `npm run logos` (or auditLogos() in the console) to see what each beer',
    '// actually resolves to.',
    rule,
    'const BRAND_DOMAINS = {',
  );
  for (const [name, v] of Object.entries(D.BRAND_DOMAINS))
    push(`${q(name)}:${Array.isArray(v) ? `[${v.map(q).join(',')}]` : q(v)},`);
  push('};', '');

  // ── Untappd consensus
  push(
    rule,
    "// UNTAPPD CONSENSUS — the world's average, for the contrarian index",
    rule,
    '// The refresh-untappd-reminder GitHub Action opens an issue every 2 weeks',
    '// when this stamp gets stale. Re-verify the ratings in the app, not here.',
    `const UNTAPPD_LAST_REFRESHED=${q(D.UNTAPPD_LAST_REFRESHED)};`,
    `const UNTAPPD_REFRESH_INTERVAL_DAYS=${D.UNTAPPD_REFRESH_INTERVAL_DAYS};`,
    '',
    '// Keys MUST match the exact beer names in beers[] (case + diacritics);',
    '// `npm run check` fails on a key that matches no beer.',
    'const UNTAPPD_GLOBAL_AVGS={',
  );
  const avgs = Object.entries(D.UNTAPPD_GLOBAL_AVGS).map(([n, v]) => `${q(n)}:${fixed(v, 2)}`);
  for (let i = 0; i < avgs.length; i += 3) push('  ' + avgs.slice(i, i + 3).join(',') + ',');
  push('};', '');

  // ── Want to try
  push(
    rule,
    '// WANT TO TRY — the standing shortlist of beers not yet drunk',
    rule,
    '// Nothing is ever removed. An entry with a review in beers[] crosses itself',
    '// off and moves to "Crossed off", where the prediction made beforehand is',
    '// scored against the rating given after — so deleting it would throw away',
    '// the only thing that makes the scorecard worth having.',
    '//',
    '// `as` lists the other names a beer is logged under in beers[], for when',
    '// the shelf name differs from the name here.',
    rule,
    'const WANT_TO_TRY=[',
  );
  push(...table(D.WANT_TO_TRY, [
    ['beer',    e => `beer:${q(e.beer)},`],
    ['style',   e => `style:${q(e.style)},`],
    ['origin',  e => `origin:${q(e.origin)},`],
    ['abv',     e => `abv:${fixed(e.abv, 1)},`],
    ['region',  e => `region:${q(e.region)},`],
    ['untappd', e => `untappd:${fixed(e.untappd, 2)},`],
    ['method',  e => `method:${q(e.method)}`],
    ['as',      e => (e.as ? `,as:[${e.as.map(q).join(',')}]` : '')],
  ]));
  push('];');

  return out.join('\n') + '\n';
}
