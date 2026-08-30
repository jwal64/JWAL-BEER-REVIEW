#!/usr/bin/env node
// Runs auditLogos() — the browser-side logo audit in app.js — from the command
// line, so "does every beer actually resolve a logo" stops being a question
// somebody has to remember to answer by hand in a console.
//
// `npm run check` can only see whether a beer has a BRAND_DOMAINS entry at all.
// Whether there is a real logo behind that domain is a question only a browser
// that can reach Brandfetch, Google and Icon Horse can answer, which is what
// this does.
//
//     npm install && npx playwright install chromium
//     npm run logos
//
// Exit codes:
//   0  every beer resolved a real logo (or the CDNs were unreachable — see
//      below; pass --strict to make that a failure instead)
//   1  at least one beer showed the placeholder or resolved at favicon size
//
// Offline or behind a proxy that blocks those CDNs, every beer "fails" for a
// reason that has nothing to do with the data. So before auditing anything the
// run probes a handful of domains that certainly have logos, and if none of
// them answer it reports the network and stops rather than printing a hundred
// false positives.
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

// ── Is the network even there? ────────────────────────────────
// Three brands large enough that all three services know them. If not one of
// the nine requests answers, the problem is the connection, not the data.
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
  const msg = 'the logo CDNs (Brandfetch, Google, Icon Horse) are unreachable from here — ' +
    'nothing was audited. Run this somewhere with open internet.';
  await browser.close(); server.close();
  if (STRICT) { console.error(`\nLogo audit could not run: ${msg}\n`); process.exit(1); }
  console.log(`\nLogo audit skipped — ${msg}\n`);
  process.exit(0);
}

// ── The audit ─────────────────────────────────────────────────
const rows = await page.evaluate(() => auditLogos({ timeout: 15000, concurrency: 8 }));
await browser.close();
server.close();

const bad = rows.filter(r => r.result === 'PLACEHOLDER' || r.result === 'NO DOMAIN');
const suspect = rows.filter(r => r.suspect);

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
  else console.log('\nFix these in BRAND_DOMAINS in data.js, or save the logo into logos/ and\n' +
    'point the beer\'s `logo` field at it (CLAUDE.md, "Verifying Logos").\n');
}

process.exit(bad.length || suspect.length ? 1 : 0);
