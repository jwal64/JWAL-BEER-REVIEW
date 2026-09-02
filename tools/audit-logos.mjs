#!/usr/bin/env node
// Runs auditLogos() — the browser-side logo audit in app.js — from the command
// line, so "does every beer actually resolve a logo" stops being a question
// somebody has to remember to answer by hand in a console.
//
// `npm run check` sees whether a beer has a BRAND_DOMAINS entry and whether the
// logo file named in BRAND_LOGOS is on disk. Whether that file — or, for a beer
// that has none, the domain behind it — actually renders is a question only a
// browser can answer, which is what this does.
//
//     npm install && npx playwright install chromium
//     npm run logos
//
// Exit codes:
//   0  every beer resolved a real logo (or nothing could be concluded because
//      the CDNs were unreachable — pass --strict to make that a failure)
//   1  at least one beer showed the placeholder or resolved at favicon size
//
// Every beer's logo is a file served from this very process, so a clean run is
// clean whatever the internet is doing — which is what makes this worth
// running on a laptop on a train, or in a sandbox whose egress policy blocks
// the logo CDNs. The connection is only questioned when something *fails*: a
// beer with no committed file falls through to the remote tiers, and offline
// that is the network's answer rather than the data's.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { ROOT } from './load-data.mjs';

const STRICT = process.argv.includes('--strict');
const JSON_OUT = process.argv.includes('--json');

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('\nplaywright is not installed — run `npm install && npx playwright install chromium`.\n'); process.exit(1); }

const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png',
  '.jpg':'image/jpeg', '.webp':'image/webp' };

const server = createServer(async (req, res) => {
  const rel = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const path = join(ROOT, rel === '/' ? 'index.html' : rel);
  try {
    if (!(await stat(path)).isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(await readFile(path));
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const page = await browser.newPage();

// The audit only needs data.js and app.js to have run; Chart.js and Leaflet
// come off a CDN and their absence doesn't stop logoSources() from working.
await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof auditLogos === 'function', null, { timeout: 20000 });

// ── The audit ─────────────────────────────────────────────────
const rows = await page.evaluate(() => auditLogos({ timeout: 15000, concurrency: 8 }));

const bad = rows.filter(r => r.result === 'PLACEHOLDER' || r.result === 'NO DOMAIN');
const suspect = rows.filter(r => r.suspect);

// ── Was the network the problem? ──────────────────────────────
// Only worth asking when something failed. Every beer's logo is a file served
// from this very process, so a clean run is clean whatever the internet is
// doing — and that is the point of holding the files: `npm run logos` now
// means something on a laptop on a train, and in a sandbox whose egress policy
// blocks the logo CDNs, which is where this project's agents live.
//
// When something did fail, the connection has to be ruled out before the data
// is blamed. Three brands large enough that all three services know them: if
// not one of the nine requests answers, the problem is the connection.
if (bad.length || suspect.length) {
  const reachable = await page.evaluate(() => {
    const tryOne = url => new Promise(res => {
      const img = new Image();
      const done = ok => { clearTimeout(t); img.onload = img.onerror = null; res(ok); };
      const t = setTimeout(() => done(false), 12000);
      img.onload = () => done(img.naturalWidth > 0);
      img.onerror = () => done(false);
      img.src = url;
    });
    const urls = ['heineken.com', 'guinness.com', 'carlsberg.com'].flatMap(d =>
      [logoURL(d), logoFallbackURL(d), logoFallback2URL(d)]);
    return Promise.all(urls.map(tryOne)).then(r => r.some(Boolean));
  });

  if (!reachable) {
    const msg = `${bad.length + suspect.length} beer(s) did not resolve, and the logo CDNs ` +
      '(Google, Icon Horse, DuckDuckGo) are unreachable from here — so those are the beers ' +
      'with no committed file, failing for a reason that is the network rather than the data. ' +
      'Run this somewhere with open internet, or `npm run fetch-logos` to give them a file.';
    await browser.close(); server.close();
    if (STRICT) { console.error(`\nLogo audit inconclusive: ${msg}\n`); process.exit(1); }
    console.log(`\nLogo audit inconclusive — ${msg}\n`);
    process.exit(0);
  }
}

await browser.close();
server.close();

if (JSON_OUT) {
  console.log(JSON.stringify({ total: rows.length, bad, suspect, rows }, null, 2));
} else {
  const by = rows.reduce((m, r) => ((m[r.result] = (m[r.result] || 0) + 1), m), {});
  console.log(`\n${rows.length} beers audited — ` +
    Object.entries(by).map(([k, v]) => `${k}: ${v}`).join(' · '));

  if (bad.length) {
    console.log(`\n${bad.length} showing the 🍺 placeholder — no source answered:`);
    for (const r of bad) console.log(`  ✗ ${r.beer} — ${r.domains}`);
  }
  if (suspect.length) {
    console.log(`\n${suspect.length} resolved at favicon size (${'≤32px'}), which usually means a`);
    console.log(`generic icon standing in for a domain the service doesn't know:`);
    for (const r of suspect) console.log(`  ? ${r.beer} — ${r.size}, ${r.domains}`);
  }
  if (!bad.length && !suspect.length) console.log('\nEvery beer resolved a real logo.\n');
  else console.log('\nEvery beer should have a committed file in logos/ — run `npm run fetch-logos`,\n' +
    'then `npm run logo-sheet` and look at what came back (CLAUDE.md, "Logos").\n');
}

process.exit(bad.length || suspect.length ? 1 : 0);
