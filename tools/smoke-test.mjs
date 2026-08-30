#!/usr/bin/env node
// Opens the real page in a real browser and checks it still works: both scripts
// load in the right order, every tab renders, the modal and the command palette
// open, and a beer name containing quotes and a tag is rendered as text rather
// than as markup.
//
// Optional — the only thing here that needs an install:
//     npm install && npx playwright install chromium
//     npm run smoke
//
// Offline or behind a proxy that blocks the CDNs, point it at local copies of
// the two libraries (a node_modules with chart.js and leaflet in it will do):
//     SMOKE_LIB_DIR=./node_modules npm run smoke
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { ROOT } from './load-data.mjs';

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { console.error('\nplaywright is not installed — run `npm install && npx playwright install chromium`.\n'); process.exit(1); }

const LIB = process.env.SMOKE_LIB_DIR;
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg' };

// A static server, so the page runs over http:// exactly as it will when hosted.
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

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [], failed = [];

if (LIB) {
  // Registered first, so the specific library routes below take precedence:
  // everything else off-origin fails immediately instead of hanging.
  await page.route(url => !url.href.startsWith(base), r => r.abort());
  const serve = (glob, file, type) => page.route(glob, async r =>
    existsSync(file) ? r.fulfill({ contentType: type, body: await readFile(file) }) : r.abort());
  await serve('**/chart.umd.js', join(LIB, 'chart.js/dist/chart.umd.js'), 'text/javascript');
  await serve('**/leaflet.js', join(LIB, 'leaflet/dist/leaflet.js'), 'text/javascript');
  await serve('**/leaflet.css', join(LIB, 'leaflet/dist/leaflet.css'), 'text/css');
}
// Logos, fonts and map tiles are decoration: the page is expected to render
// without them, so failures there are not the test's business.
const DECORATION = /brandfetch|google|icon\.horse|tile|cartocdn|fonts|wikimedia|\.png|\.jpg/;
const NOISE = /Failed to load resource|ERR_FAILED|ERR_TUNNEL|ERR_NAME_NOT_RESOLVED/;

page.on('console', m => { if (m.type() === 'error' && !NOISE.test(m.text())) errors.push(m.text()); });
page.on('pageerror', e => errors.push('uncaught: ' + e.message));
page.on('requestfailed', r => { if (!DECORATION.test(r.url())) failed.push(r.url()); });

let pass = true;
const check = async (label, fn) => {
  let ok = false, note = '';
  try { const v = await fn(); ok = !!v; note = v && v !== true ? ` — ${v}` : ''; }
  catch (e) { note = ` — ${e.message.split('\n')[0]}`; }
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${note}`);
  pass = ok && pass;
};

// Not `networkidle`: logos and map tiles keep the network busy (or hang, when
// they're blocked). The app is ready once app.js has finished its boot pass.
await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof STATS !== 'undefined' && document.querySelector('#beerBody tr'), null, { timeout: 15000 });

await check('both libraries loaded', () => page.evaluate(() => typeof Chart === 'function' && typeof L === 'object'));
await check('data.js loaded before app.js', () => page.evaluate(() =>
  `${beers.length} reviews · ${breweries.length} breweries · ${Object.keys(BRAND_DOMAINS).length} domains`));
await check('statistics computed', () => page.evaluate(() => STATS.styleRanked.length > 0 && `avg ${STATS.globalAvg.toFixed(2)}`));
await check('header totals rendered', async () => (await page.locator('#hdr-subtitle .tb-stat').count()) > 0);
await check('recent activity feed', async () => `${await page.locator('#recentFeed .feed-row').count()} rows`);

await page.click('.nav-item[data-tab="beers"]');
await check('beers table', async () => `${await page.locator('#beerBody tr').count()} rows`);
await check('beer grid', async () => `${await page.locator('#beerGrid .beer-card').count()} cards`);

await page.click('#beerBody tr >> nth=0');
await page.waitForTimeout(200);
await check('beer detail modal', () => page.evaluate(() =>
  document.getElementById('beerModal').classList.contains('open') &&
  document.getElementById('beerModalTitle').textContent));
await page.keyboard.press('Escape');

await page.click('.nav-item[data-tab="maps"]');
await page.waitForTimeout(600);
await check('map rendered', () => page.evaluate(() => !!document.querySelector('.leaflet-container')));

await page.click('.nav-item[data-tab="insights"]');
await page.waitForTimeout(400);
await check('insight charts drawn', () => page.evaluate(() => {
  const drawn = Object.values(_charts).filter(c => c && c.data.datasets.length).length;
  return drawn > 4 && `${drawn} charts`;
}));

// What to try: the shortlist has to render, and — the part with no other way
// of being checked — an entry has to cross itself off the moment a review of
// it lands. Nothing marks the entry as drunk; the page works it out.
await page.click('#insights .subtab[data-subtab="markets"]');
await page.waitForTimeout(300);
await check('want-to-try shortlist', async () => {
  const cards = await page.locator('#wtPicks .wt-card').count();
  const done = await page.locator('#wtDoneBody tr').count();
  return cards > 0 && done > 0 && `${cards} to try · ${done} crossed off`;
});
await check('trying a shortlisted beer crosses it off', () => page.evaluate(() => {
  const before = document.querySelectorAll('#wtPicks .wt-card').length;
  const pick = WANT_TO_TRY.find(e => !wtReviews(e));
  if (!pick) return 'nothing left on the shortlist to test with';
  beers.push({ beer: pick.beer, style: pick.style, origin: pick.origin, abv: pick.abv,
    method: pick.method, city: 'New Rochelle', region: 'New York', country: 'USA',
    cc: 'US', rating: 4, isNew: false, month: 'Aug', monthN: 8, year: 2026 });
  reloadData();
  const after = document.querySelectorAll('#wtPicks .wt-card').length;
  const scored = [...document.querySelectorAll('#wtDoneBody tr')]
    .some(r => r.dataset.beer === pick.beer);
  beers.pop(); reloadData();
  const restored = document.querySelectorAll('#wtPicks .wt-card').length;
  return after === before - 1 && scored && restored === before &&
    `${pick.beer} left the list and scored its guess`;
}));

await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.keyboard.press('Control+k');
await page.waitForTimeout(200);
await page.fill('#cmd-input', 'duvel');
await page.waitForTimeout(200);
await check('command palette search', async () => `${await page.locator('#cmd-results .cmd-item').count()} results`);
await page.keyboard.press('Escape');

// esc(): a name that is markup must reach the page as text, and must still
// round-trip through the data-beer attribute the click handler reads.
await check('a name containing markup renders as text', () => page.evaluate(() => {
  const name = 'Test "<img src=x onerror=alert(1)>\' Ale';
  beers.push({ beer: name, style: 'Lager', origin: 'US', abv: 5, method: 'Can',
    city: 'New Rochelle', region: 'New York', country: 'USA', cc: 'US',
    rating: 3, isNew: false, month: 'Aug', monthN: 8, year: 2026 });
  reloadData();
  const row = [...document.querySelectorAll('#beerBody tr')].some(r => r.dataset.beer === name);
  const injected = document.querySelectorAll('#beerBody img[src="x"], #beerGrid img[src="x"]').length;
  beers.pop(); reloadData();
  return row && injected === 0 && 'name round-tripped, nothing injected';
}));

await browser.close();
server.close();

if (errors.length) console.log(`\n  console errors:\n    ${errors.join('\n    ')}`);
if (failed.length) console.log(`\n  failed requests:\n    ${failed.join('\n    ')}`);
if (!pass || errors.length || failed.length) { console.log('\nSmoke test failed.\n'); process.exit(1); }
console.log('\nSmoke test passed.\n');
