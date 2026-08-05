#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// PDF REPORT GENERATOR
// Reads the dashboard's data straight out of script.js, rebuilds the same
// aggregates the dashboard shows, and renders a plain-English printable
// report to report/JWAL-Brew-Reviews-Report.pdf
//
//   node tools/generate-report.mjs
//
// Chromium (headless) does the HTML → PDF step. No npm dependencies.
// ══════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'report');
const OUT_PDF = path.join(OUT_DIR, 'JWAL-Brew-Reviews-Report.pdf');

// ── 1. Pull the data arrays out of script.js ──────────────────
// script.js is a browser script (touches document/localStorage), so we slice
// out just the literal arrays and evaluate those rather than importing it.
const SRC = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');

function literal(decl, name) {
  const start = SRC.indexOf(`${decl} ${name}=[`);
  if (start < 0) throw new Error(`could not find "${decl} ${name}=[" in script.js`);
  const open = SRC.indexOf('[', start);
  const end = SRC.indexOf('\n];', open);
  if (end < 0) throw new Error(`could not find the end of ${name}[] in script.js`);
  return SRC.slice(open, end + 2);
}
function objectLiteral(name) {
  const start = SRC.indexOf(`const ${name}={`);
  if (start < 0) throw new Error(`could not find "const ${name}={" in script.js`);
  const end = SRC.indexOf('};', start);
  return SRC.slice(SRC.indexOf('{', start), end + 1);
}

const beers = eval(literal('let', 'beers'));
const breweries = eval(literal('let', 'breweries'));
const CNAMES = eval('(' + objectLiteral('CNAMES') + ')');

// ── 2. Rebuild the dashboard's aggregates ─────────────────────
// Canonical location (see CLAUDE.md): a beer reviewed in more than one city is
// attributed to its rarest-visited city for location aggregation only.
const HOME_CITIES = new Set(['New Rochelle', 'New York']);
function computeCanonLoc() {
  const cityCount = {}, byBeer = {};
  for (const b of beers) {
    cityCount[b.city] = (cityCount[b.city] || 0) + 1;
    const m = byBeer[b.beer] || (byBeer[b.beer] = {});
    if (!m[b.city]) m[b.city] = { city: b.city, region: b.region, country: b.country, cc: b.cc };
  }
  const out = new Map();
  for (const beer in byBeer) {
    const cities = Object.values(byBeer[beer]);
    if (cities.length < 2) continue;
    out.set(beer, cities.reduce((a, c) => {
      const ha = HOME_CITIES.has(a.city) ? 1 : 0, hc = HOME_CITIES.has(c.city) ? 1 : 0;
      const cmp = (hc - ha) || (cityCount[c.city] - cityCount[a.city]) ||
                  (c.city < a.city ? -1 : c.city > a.city ? 1 : 0);
      return cmp < 0 ? c : a;
    }));
  }
  return out;
}
const CANON_LOC = computeCanonLoc();

const BREWERY_OF = {};   // beer name → brewery record
for (const br of breweries) {
  for (const raw of br.beers.split(' · ')) {
    const n = raw.trim();
    if (!BREWERY_OF[n]) BREWERY_OF[n] = br;
  }
}

const avg = a => a.reduce((s, v) => s + v, 0) / a.length;
const group = (rows, key) => {
  const m = new Map();
  for (const r of rows) {
    const k = key(r);
    let g = m.get(k);
    if (!g) m.set(k, g = { key: k, rows: [] });
    g.rows.push(r);
  }
  return [...m.values()].map(g => ({
    key: g.key, rows: g.rows, count: g.rows.length, avg: avg(g.rows.map(r => r.rating))
  }));
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const byRating = [...beers].sort((a, b) => b.rating - a.rating || a.beer.localeCompare(b.beer));
const byDate = [...beers].sort((a, b) => a.year - b.year || a.monthN - b.monthN || a.beer.localeCompare(b.beer));

const overall = avg(beers.map(b => b.rating));
const abvs = beers.map(b => b.abv);
const hits = beers.filter(b => b.rating >= 3).length;
const styles = group(beers, b => b.style).sort((a, b) => b.avg - a.avg);
const methods = group(beers, b => b.method).sort((a, b) => b.count - a.count);
const origins = group(beers, b => CNAMES[b.origin] || b.origin).sort((a, b) => b.count - a.count || b.avg - a.avg);
const cities = group(beers, b => (CANON_LOC.get(b.beer) || b).city).sort((a, b) => b.count - a.count || b.avg - a.avg);
const months = group(beers, b => `${b.year}-${String(b.monthN).padStart(2, '0')}`).sort((a, b) => a.key.localeCompare(b.key));
const breweryRows = group(beers, b => (BREWERY_OF[b.beer] || {}).name || 'Unlisted brewery')
  .sort((a, b) => b.count - a.count || b.avg - a.avg || a.key.localeCompare(b.key));

// Rating histogram, half-star buckets from 1.0 to 5.0
const BUCKETS = [];
for (let v = 1; v <= 5; v += 0.5) BUCKETS.push(v);
const hist = BUCKETS.map(v => ({
  label: v.toFixed(1),
  count: beers.filter(b => b.rating >= v && b.rating < v + 0.5).length
}));

const first = byDate[0], last = byDate[byDate.length - 1];
const coverage = `${MONTHS_LONG[first.monthN - 1]} ${first.year} – ${MONTHS_LONG[last.monthN - 1]} ${last.year}`;
const generated = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// ── 3. Render the HTML ────────────────────────────────────────
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const n2 = v => v.toFixed(2);
const pct = (v, max) => max ? Math.round(v / max * 100) : 0;

// A labelled row with a proportional bar — used by every ranking table.
function bar(width, tone = 'accent') {
  return `<span class="bar"><span class="bar-fill ${tone}" style="width:${Math.max(width, 2)}%"></span></span>`;
}

function rankTable(rows, { label, unit = 'beers', note }) {
  const maxCount = Math.max(...rows.map(r => r.count));
  return `
  <table class="rank">
    <thead><tr>
      <th class="c-name">${esc(label)}</th>
      <th class="c-num">${esc(unit)}</th>
      <th class="c-bar">share of all reviews</th>
      <th class="c-num">avg rating</th>
    </tr></thead>
    <tbody>
      ${rows.map(r => `<tr>
        <td class="c-name">${esc(r.key)}</td>
        <td class="c-num">${r.count}</td>
        <td class="c-bar">${bar(pct(r.count, maxCount))}<span class="bar-tag">${pct(r.count, beers.length)}%</span></td>
        <td class="c-num strong">${n2(r.avg)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  ${note ? `<p class="note">${note}</p>` : ''}`;
}

const tile = (value, label, sub) => `
  <div class="tile">
    <div class="tile-val">${esc(value)}</div>
    <div class="tile-lbl">${esc(label)}</div>
    ${sub ? `<div class="tile-sub">${esc(sub)}</div>` : ''}
  </div>`;

const leaderRow = (b, i, tone) => `
  <tr>
    <td class="c-rank">${i + 1}</td>
    <td class="c-name">${esc(b.beer)}<span class="sub">${esc(b.style)} · ${esc(CNAMES[b.origin] || b.origin)}</span></td>
    <td class="c-num strong ${tone}">${n2(b.rating)}</td>
  </tr>`;

const maxMonth = Math.max(...months.map(m => m.count));
const maxHist = Math.max(...hist.map(h => h.count));

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Jwal's Brew Reviews — Report</title>
<style>
  :root{
    --ink:#14181f; --body:#333a45; --muted:#6b7480; --rule:#dde2e9; --rule-soft:#eef1f5;
    --accent:#b4762a; --accent-soft:#f0dcc0; --good:#2f7d51; --bad:#b03b3b; --panel:#f7f8fa;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    font-family:"Liberation Sans","DejaVu Sans",Arial,sans-serif;
    font-size:9.6pt; line-height:1.45; color:var(--body);
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
  }
  h1,h2,h3{color:var(--ink); margin:0; font-weight:700}
  h1{font-size:23pt; line-height:1.15; letter-spacing:-.4pt}
  h2{font-size:13pt; letter-spacing:-.2pt}
  h3{font-size:10pt; letter-spacing:.2pt; text-transform:uppercase}
  p{margin:0 0 8pt}
  .mono{font-family:"DejaVu Sans Mono","Liberation Mono",monospace}

  /* ── Cover ─────────────────────────────────────────── */
  .cover{border-bottom:2.5pt solid var(--ink); padding-bottom:12pt; margin-bottom:16pt}
  .eyebrow{font-size:8pt; letter-spacing:1.6pt; text-transform:uppercase; color:var(--accent); font-weight:700; margin-bottom:6pt}
  .cover .lede{font-size:10.5pt; color:var(--body); max-width:150mm; margin-top:8pt}
  .cover-meta{margin-top:10pt; font-size:8.5pt; color:var(--muted); display:flex; gap:18pt; flex-wrap:wrap}
  .cover-meta b{color:var(--ink); font-weight:600}
  .contents{font-size:8.2pt; color:var(--muted); margin:0 0 14pt; line-height:1.6}
  .contents b{font-family:"DejaVu Sans Mono",monospace; color:var(--accent); font-weight:700}

  /* ── Sections ──────────────────────────────────────── */
  section{margin-bottom:15pt; break-inside:auto}
  .sec-head{display:flex; align-items:baseline; gap:8pt; border-bottom:1pt solid var(--rule);
            padding-bottom:4pt; margin-bottom:9pt; break-after:avoid}
  .sec-num{font-size:8.5pt; font-weight:700; color:var(--accent); letter-spacing:1pt}
  .sec-sub{margin-left:auto; font-size:8.5pt; color:var(--muted)}
  .intro{font-size:9.2pt; color:var(--muted); margin:-3pt 0 9pt}

  /* ── Headline tiles ────────────────────────────────── */
  .tiles{display:grid; grid-template-columns:repeat(3,1fr); gap:7pt; margin-bottom:14pt}
  .tile{border:1pt solid var(--rule); border-left:2.5pt solid var(--accent); background:var(--panel);
        padding:7pt 9pt; break-inside:avoid}
  .tile-val{font-size:17pt; font-weight:700; color:var(--ink); line-height:1.1;
            font-family:"DejaVu Sans Mono","Liberation Mono",monospace}
  .tile-lbl{font-size:7.6pt; letter-spacing:.9pt; text-transform:uppercase; color:var(--ink); font-weight:700; margin-top:3pt}
  .tile-sub{font-size:8pt; color:var(--muted); margin-top:1pt}

  /* ── Tables ────────────────────────────────────────── */
  table{width:100%; border-collapse:collapse}
  th{font-size:7.6pt; letter-spacing:.8pt; text-transform:uppercase; color:var(--muted);
     font-weight:700; text-align:left; padding:0 5pt 4pt; border-bottom:1pt solid var(--rule)}
  td{padding:3.4pt 5pt; border-bottom:.6pt solid var(--rule-soft); vertical-align:baseline}
  tbody tr:last-child td{border-bottom:none}
  .c-num{text-align:right; white-space:nowrap; font-family:"DejaVu Sans Mono","Liberation Mono",monospace; font-size:9pt}
  .c-rank{width:16pt; text-align:right; color:var(--muted); font-family:"DejaVu Sans Mono",monospace; font-size:8.5pt}
  .c-name{color:var(--ink); font-weight:600}
  .c-name .sub{display:block; font-weight:400; font-size:8pt; color:var(--muted)}
  .c-bar{width:38%}
  .strong{font-weight:700; color:var(--ink)}
  .good{color:var(--good)} .bad{color:var(--bad)}
  .note{font-size:8.2pt; color:var(--muted); margin:5pt 0 0}

  /* ── Bars ──────────────────────────────────────────── */
  .bar{display:inline-block; width:calc(100% - 26pt); height:6pt; background:var(--rule-soft);
       vertical-align:middle; border-radius:1pt; overflow:hidden}
  .bar-fill{display:block; height:100%; background:var(--accent); border-radius:1pt}
  .bar-fill.soft{background:var(--accent-soft)}
  .bar-tag{display:inline-block; width:24pt; text-align:right; font-size:7.8pt; color:var(--muted);
           font-family:"DejaVu Sans Mono",monospace; vertical-align:middle}

  /* ── Two-column blocks ─────────────────────────────── */
  .cols{display:grid; grid-template-columns:1fr 1fr; gap:16pt}
  .cols > div{break-inside:avoid}
  .col-head{font-size:8.4pt; letter-spacing:.9pt; text-transform:uppercase; font-weight:700;
            color:var(--ink); margin-bottom:5pt}

  /* ── Histogram / timeline ──────────────────────────── */
  .chart{display:flex; align-items:flex-end; gap:5pt; height:76pt; padding-top:4pt; break-inside:avoid}
  .chart .col{flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; height:100%}
  .chart .col-bar{width:100%; background:var(--accent); border-radius:1pt 1pt 0 0; min-height:1.2pt}
  .chart .col-bar.soft{background:var(--accent-soft)}
  .chart .col-n{font-size:8pt; font-weight:700; color:var(--ink); margin-bottom:2pt;
                font-family:"DejaVu Sans Mono",monospace}
  .chart-axis{display:flex; gap:5pt; border-top:1pt solid var(--rule); padding-top:3pt; margin-bottom:2pt}
  .chart-axis span{flex:1; text-align:center; font-size:7.8pt; color:var(--muted);
                   font-family:"DejaVu Sans Mono",monospace}
  .chart-axis .sub{display:block; font-size:7.2pt; color:var(--muted)}

  /* ── Full log ──────────────────────────────────────── */
  .log{font-size:8.4pt}
  .log th{font-size:7.2pt}
  .log td{padding:2.6pt 4pt}
  .log .c-name{font-size:8.6pt}
  .log tbody tr:last-child td{border-bottom:.6pt solid var(--rule-soft)}
  .log .month-row td{background:var(--panel); font-weight:700; color:var(--ink); font-size:7.8pt;
                     letter-spacing:.9pt; text-transform:uppercase; padding:4pt 4pt 3.4pt;
                     border-bottom:1pt solid var(--rule)}
  .page-break{break-before:page}
  thead{display:table-header-group}
  tr{break-inside:avoid}
</style>
</head>
<body>

<div class="cover">
  <div class="eyebrow">Jwal's Brew Reviews</div>
  <h1>Beer Review Report</h1>
  <p class="lede">Everything logged on the dashboard, summarised in one place: what was drunk,
  how it scored, where it came from and where it was drunk. Ratings are out of 5.00.</p>
  <div class="cover-meta">
    <span>Covering <b>${esc(coverage)}</b></span>
    <span>Generated <b>${esc(generated)}</b></span>
    <span><b>${beers.length}</b> reviews</span>
  </div>
</div>

<p class="contents">
  <b>01</b> Headline numbers &nbsp; <b>02</b> Rating spread &nbsp; <b>03</b> Best and worst &nbsp;
  <b>04</b> By style &nbsp; <b>05</b> By serving &nbsp; <b>06</b> Where the beer comes from &nbsp;
  <b>07</b> Where it was drunk &nbsp; <b>08</b> Month by month &nbsp; <b>09</b> Repeat breweries &nbsp;
  <b>10</b> Every review, in order
</p>

<section>
  <div class="sec-head"><span class="sec-num">01</span><h2>The headline numbers</h2></div>
  <div class="tiles">
    ${tile(String(beers.length), 'Reviews logged', `${new Set(beers.map(b => b.beer)).size} different beers`)}
    ${tile(n2(overall), 'Average rating', 'out of 5.00')}
    ${tile(`${Math.round(hits / beers.length * 100)}%`, 'Hit rate', `${hits} scored 3.00 or better`)}
    ${tile(String(breweryRows.length), 'Breweries', `across ${origins.length} countries`)}
    ${tile(String(cities.length), 'Places drunk in', `${new Set(beers.map(b => (CANON_LOC.get(b.beer) || b).country)).size} countries`)}
    ${tile(`${avg(abvs).toFixed(1)}%`, 'Average ABV', `range ${Math.min(...abvs).toFixed(1)}% – ${Math.max(...abvs).toFixed(1)}%`)}
  </div>
  <table class="rank">
    <tbody>
      <tr><td class="c-name">Best rated</td>
          <td class="c-name">${esc(byRating[0].beer)}<span class="sub">${esc(byRating[0].style)} · ${esc(CNAMES[byRating[0].origin] || byRating[0].origin)} · drunk in ${esc(byRating[0].city)}</span></td>
          <td class="c-num strong good">${n2(byRating[0].rating)}</td></tr>
      <tr><td class="c-name">Lowest rated</td>
          <td class="c-name">${esc(byRating[byRating.length - 1].beer)}<span class="sub">${esc(byRating[byRating.length - 1].style)} · ${esc(CNAMES[byRating[byRating.length - 1].origin] || byRating[byRating.length - 1].origin)} · drunk in ${esc(byRating[byRating.length - 1].city)}</span></td>
          <td class="c-num strong bad">${n2(byRating[byRating.length - 1].rating)}</td></tr>
      <tr><td class="c-name">Most reviewed style</td>
          <td class="c-name">${esc(styles.slice().sort((a, b) => b.count - a.count)[0].key)}<span class="sub">${styles.slice().sort((a, b) => b.count - a.count)[0].count} reviews, averaging ${n2(styles.slice().sort((a, b) => b.count - a.count)[0].avg)}</span></td>
          <td class="c-num strong">${styles.slice().sort((a, b) => b.count - a.count)[0].count}</td></tr>
      <tr><td class="c-name">Busiest month</td>
          <td class="c-name">${esc(MONTHS_LONG[+months.slice().sort((a, b) => b.count - a.count)[0].key.slice(5) - 1])} ${esc(months.slice().sort((a, b) => b.count - a.count)[0].key.slice(0, 4))}<span class="sub">averaging ${n2(months.slice().sort((a, b) => b.count - a.count)[0].avg)}</span></td>
          <td class="c-num strong">${months.slice().sort((a, b) => b.count - a.count)[0].count}</td></tr>
    </tbody>
  </table>
</section>

<section>
  <div class="sec-head"><span class="sec-num">02</span><h2>How the ratings spread out</h2>
    <span class="sec-sub">${beers.length} reviews, half-star bands</span></div>
  <p class="intro">Each bar counts the reviews falling in that half-star band — so "3.5" covers everything scored 3.50 to 3.75.</p>
  <div class="chart">
    ${hist.map(h => `<div class="col">
      <div class="col-n">${h.count || ''}</div>
      <div class="col-bar" style="height:${h.count ? Math.max(pct(h.count, maxHist), 3) : 0}%"></div>
    </div>`).join('')}
  </div>
  <div class="chart-axis">${hist.map(h => `<span>${h.label}</span>`).join('')}</div>
  <p class="note">Median ${n2(byRating[Math.floor(beers.length / 2)].rating)} · ${hits} of ${beers.length} reviews (${Math.round(hits / beers.length * 100)}%) came in at 3.00 or above.</p>
</section>

<section>
  <div class="sec-head"><span class="sec-num">03</span><h2>Best and worst</h2>
    <span class="sec-sub">ranked by rating</span></div>
  <div class="cols">
    <div>
      <div class="col-head">Top 10 — highest first</div>
      <table><tbody>${byRating.slice(0, 10).map((b, i) => leaderRow(b, i, 'good')).join('')}</tbody></table>
    </div>
    <div>
      <div class="col-head">Bottom 10 — lowest first</div>
      <table><tbody>${byRating.slice(-10).reverse().map((b, i) => leaderRow(b, i, 'bad')).join('')}</tbody></table>
    </div>
  </div>
</section>

<section>
  <div class="sec-head"><span class="sec-num">04</span><h2>By style</h2>
    <span class="sec-sub">best-rated style first</span></div>
  ${rankTable(styles, { label: 'Style', unit: 'reviews' })}
</section>

<section>
  <div class="sec-head"><span class="sec-num">05</span><h2>By serving</h2>
    <span class="sec-sub">how it was poured</span></div>
  ${rankTable(methods, { label: 'Served as', unit: 'reviews' })}
</section>

<section>
  <div class="sec-head"><span class="sec-num">06</span><h2>Where the beer comes from</h2>
    <span class="sec-sub">${origins.length} brewing countries</span></div>
  <p class="intro">The brewery's home country — not where the beer was drunk.</p>
  ${rankTable(origins, { label: 'Brewed in', unit: 'reviews' })}
</section>

<section>
  <div class="sec-head"><span class="sec-num">07</span><h2>Where it was drunk</h2>
    <span class="sec-sub">${cities.length} places</span></div>
  ${rankTable(cities, { label: 'City', unit: 'reviews',
    note: 'A beer reviewed in more than one city is counted under its rarest-visited city, matching the dashboard\'s map and market totals.' })}
</section>

<section>
  <div class="sec-head"><span class="sec-num">08</span><h2>Month by month</h2>
    <span class="sec-sub">${months.length} months</span></div>
  <div class="chart">
    ${months.map(m => `<div class="col">
      <div class="col-n">${m.count}</div>
      <div class="col-bar" style="height:${Math.max(pct(m.count, maxMonth), 3)}%"></div>
    </div>`).join('')}
  </div>
  <div class="chart-axis">${months.map(m => `<span>${MONTHS[+m.key.slice(5) - 1]}<span class="sub">${n2(m.avg)}</span></span>`).join('')}</div>
  <p class="note">Bar height is the number of reviews that month; the figure under each month is its average rating.</p>
</section>

<section>
  <div class="sec-head"><span class="sec-num">09</span><h2>Breweries with more than one beer</h2>
    <span class="sec-sub">${breweryRows.filter(b => b.count > 1).length} of ${breweryRows.length} breweries</span></div>
  ${breweryRows.filter(b => b.count > 1).length
    ? rankTable(breweryRows.filter(b => b.count > 1), { label: 'Brewery', unit: 'reviews',
        note: `The other ${breweryRows.filter(b => b.count === 1).length} breweries are represented by a single beer each — all of them are listed in the full log.` })
    : '<p class="note">Every brewery so far is represented by exactly one beer.</p>'}
</section>

<section class="page-break">
  <div class="sec-head"><span class="sec-num">10</span><h2>Every review, in order</h2>
    <span class="sec-sub">${beers.length} entries, oldest first</span></div>
  <table class="log">
    <thead><tr>
      <th class="c-name">Beer</th>
      <th>Brewery</th>
      <th>Style</th>
      <th class="c-num">ABV</th>
      <th>Brewed in</th>
      <th>Drunk in</th>
      <th>Serve</th>
      <th class="c-num">Rating</th>
    </tr></thead>
    <tbody>
      ${(() => {
        let out = '', currentMonth = '';
        for (const b of byDate) {
          const key = `${b.year}-${b.monthN}`;
          if (key !== currentMonth) {
            currentMonth = key;
            out += `<tr class="month-row"><td colspan="8">${MONTHS_LONG[b.monthN - 1]} ${b.year}</td></tr>`;
          }
          const br = BREWERY_OF[b.beer];
          out += `<tr>
            <td class="c-name">${esc(b.beer)}</td>
            <td>${esc(br ? br.name : '—')}</td>
            <td>${esc(b.style)}</td>
            <td class="c-num">${b.abv.toFixed(1)}%</td>
            <td>${esc(CNAMES[b.origin] || b.origin)}</td>
            <td>${esc(b.city)}, ${esc(b.country)}</td>
            <td>${esc(b.method)}</td>
            <td class="c-num strong">${n2(b.rating)}</td>
          </tr>`;
        }
        return out;
      })()}
    </tbody>
  </table>
  <p class="note">"Drunk in" is the true place of each individual review, exactly as logged.</p>
</section>

</body>
</html>`;

// ── 4. HTML → PDF via headless Chromium over the DevTools protocol ──
const CHROME = process.env.CHROME_PATH || [
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
].find(p => fs.existsSync(p));
if (!CHROME) {
  console.error('No Chromium found. Set CHROME_PATH to a Chrome/Chromium binary.');
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'brew-report-'));
const htmlPath = path.join(work, 'report.html');
fs.writeFileSync(htmlPath, html);

const profile = path.join(work, 'profile');
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  '--hide-scrollbars', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
chrome.stderr.on('data', () => {});

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function devtoolsPort() {
  const file = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 600; i++) {   // Chromium's cold start can take a while
    if (fs.existsSync(file)) {
      const port = fs.readFileSync(file, 'utf8').split('\n')[0].trim();
      if (port) return port;
    }
    await sleep(100);
  }
  throw new Error('Chromium did not start (no DevToolsActivePort)');
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  });
  return (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const m = { id: ++id, method, params };
    if (sessionId) m.sessionId = sessionId;
    pending.set(m.id, { resolve, reject });
    ws.send(JSON.stringify(m));
  });
}

const footer = `
  <div style="width:100%;font-family:Arial,sans-serif;font-size:7pt;color:#8a9099;
              padding:0 14mm;display:flex;justify-content:space-between;">
    <span>Jwal's Brew Reviews — Beer Review Report</span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  </div>`;
const header = '<div></div>';

try {
  const port = await devtoolsPort();
  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const send = cdp(ws);

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  const loaded = new Promise(res => {
    ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.method === 'Page.loadEventFired' && m.sessionId === sessionId) res();
    });
  });
  await send('Page.navigate', { url: 'file://' + htmlPath }, sessionId);
  await loaded;
  await sleep(400); // let fonts settle before paginating

  const { data } = await send('Page.printToPDF', {
    printBackground: true,
    paperWidth: 8.27, paperHeight: 11.69,          // A4 portrait
    marginTop: 0.55, marginBottom: 0.6, marginLeft: 0.55, marginRight: 0.55,
    displayHeaderFooter: true, headerTemplate: header, footerTemplate: footer,
    preferCSSPageSize: false,
  }, sessionId);

  fs.writeFileSync(OUT_PDF, Buffer.from(data, 'base64'));
  ws.close();
  console.log(`Wrote ${path.relative(ROOT, OUT_PDF)} — ${beers.length} reviews, ${(fs.statSync(OUT_PDF).size / 1024).toFixed(0)} KB`);
} finally {
  chrome.kill();
  fs.rmSync(work, { recursive: true, force: true });
}
