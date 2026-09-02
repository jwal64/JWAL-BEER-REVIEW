#!/usr/bin/env node
// Fetches every beer's official logo once, so the site stops asking for it on
// every page load.
//
// The runtime chain asks a third party for a logo each time a card renders,
// and answers only as well as that service is having a day. When Brandfetch
// started refusing the embedded client ID, all 97 beers without a local file
// dropped silently to Google's 16px default favicon and the site rendered a
// hundred grey globes. Nothing in the repo had changed; nothing in the repo
// could have prevented it.
//
// So the logo becomes a file we hold. This walks a ladder of sources per
// brand, prefers the brand's own site over any aggregator — a site's declared
// icon is the brand saying what its mark is, an aggregator's answer is a guess
// about it — takes the largest real image it finds, and writes it into
// public/stats/logos/. The remote chain stays exactly where it is, as the
// fallback it always was.
//
//     node tools/fetch-logos.mjs                 # everything with no file yet
//     node tools/fetch-logos.mjs --force         # re-fetch even what we have
//     node tools/fetch-logos.mjs --only "Grolsch,Duvel"
//
// Needs open internet and Playwright's Chromium (which re-encodes what comes
// back). The Fetch logos workflow runs it on a runner and commits the result;
// logo-fetch-report.json records where every logo came from, so a wrong one
// can be traced back to the source that gave it.
import { mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadData } from './load-data.mjs';
import { imageSize } from './probe-logo-sources.mjs';

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const onlyArg = args.indexOf('--only');
const ONLY = onlyArg >= 0 ? new Set(args[onlyArg + 1].split(',').map(s => s.trim())) : null;
// For the beers where the brand's own site is the *problem*: cerveceradepr.com
// is a WordPress site serving the WordPress W, modelousa.com calls a
// photograph of a man its logo, bitburger.de's touch icon is a picture of a
// glass. The site is normally the best source and sometimes the worst one, and
// nothing can tell which from here — so this is a switch, used per beer after
// looking at the contact sheet.
const WIKIDATA_FIRST = args.includes('--prefer-wikidata');

const LOGO_DIR = join(ROOT, 'logos');
const REPORT = join(ROOT, 'logo-fetch-report.json');

// A raster this small is a favicon, not a logo: the generic globe the services
// answer with for a domain they don't know is 16px, and anything under this is
// too coarse to draw at 2× on a card. The audit's own "suspect" line is 32px —
// this sits above it deliberately, so what we commit clears the bar we check.
const MIN_PX = 48;
// What we store. Larger than anywhere the site draws a logo (48px at 2× is 96),
// small enough that a hundred of them are a rounding error in the repo.
const OUT_PX = 256;

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function get(url, { timeout = 20000, accept = 'image/*,*/*' } = {}) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ac.signal, redirect: 'follow',
      headers: { 'user-agent': UA, accept } });
    if (!res.ok) return null;
    return { buf: Buffer.from(await res.arrayBuffer()),
             type: (res.headers.get('content-type') || '').split(';')[0].trim(),
             url: res.url };
  } catch { return null; }
  finally { clearTimeout(t); }
}

// ── the brand's own site ──────────────────────────────────────
// Read the icons the site declares, largest first. `mask-icon` is skipped on
// purpose: Safari's pinned-tab icon is a monochrome silhouette by definition,
// which is a worse logo than a colour favicon half its size.
function iconsFromHtml(html, base) {
  const out = [];
  const abs = href => { try { return new URL(href, base).href; } catch { return null; } };
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] || '').toLowerCase();
    if (!/(^|\s)(apple-touch-icon|apple-touch-icon-precomposed|icon|shortcut icon)(\s|$)/.test(rel)) continue;
    if (/mask-icon/.test(rel)) continue;
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const u = href && abs(href);
    if (!u) continue;
    const sizes = tag.match(/\bsizes\s*=\s*["']([^"']+)["']/i)?.[1] || '';
    const declared = /\.svg(\?|$)/i.test(u) || /svg/i.test(tag.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1] || '')
      ? 512 : (parseInt(sizes, 10) || 0);
    out.push({ url: u, hint: declared, why: `site rel="${rel.trim()}"` });
  }
  out.sort((a, b) => b.hint - a.hint);

  // og:image last: it is as often a hero photograph as a logo, and a photo of
  // a bottle in a 24px table cell is worse than the favicon it displaced.
  const og = html.match(/<meta[^>]+(?:property|name)\s*=\s*["']og:image["'][^>]*>/i)?.[0];
  const ogHref = og?.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1];
  if (ogHref && abs(ogHref)) out.push({ url: abs(ogHref), hint: 0, why: 'site og:image', last: true });
  return out;
}

const siteCache = new Map();
async function siteCandidates(domain) {
  if (siteCache.has(domain)) return siteCache.get(domain);
  let found = [];
  for (const base of [`https://${domain}/`, `https://www.${domain}/`]) {
    const page = await get(base, { accept: 'text/html,application/xhtml+xml,*/*' });
    if (page && /html/i.test(page.type)) {
      found = iconsFromHtml(page.buf.toString('utf8'), page.url);
      if (found.length) break;
    }
  }
  if (!found.length)
    found = ['apple-touch-icon.png', 'apple-touch-icon-precomposed.png', 'favicon.svg']
      .map(p => ({ url: `https://${domain}/${p}`, hint: 0, why: `site /${p}` }));
  siteCache.set(domain, found);
  return found;
}

// ── the brand's own header logo, read in a browser ────────────
// The tier that needs a real page. A site that declares no icon big enough
// still draws its logo at the top of every page — often as inline SVG, which
// no amount of reading the HTML as text will find, and which is the mark
// itself rather than a picture of it.
//
// The SVG is serialised with its computed fill and stroke written onto every
// node, because the colours usually live in a stylesheet that is not coming
// with it, and a wordmark that arrives black renders as a black square.
const headerCache = new Map();
async function headerLogo(domain, page) {
  if (headerCache.has(domain)) return headerCache.get(domain);
  let out = null;
  for (const base of [`https://${domain}/`, `https://www.${domain}/`]) {
    try {
      await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(1200);
      out = await page.evaluate(() => {
        const LOGOISH = /logo|brand|wordmark|marque/i;
        const label = el => [el.id, el.getAttribute('class') || '', el.getAttribute('alt') || '',
          el.getAttribute('aria-label') || '', el.getAttribute('src') || ''].join(' ');
        const inHead = el => !!el.closest('header,nav,[class*="header" i],[class*="nav" i]')
          || !!el.closest('a[href="/"]');
        const cands = [];
        for (const el of document.querySelectorAll('img, svg')) {
          const r = el.getBoundingClientRect();
          if (r.width < 32 || r.height < 14 || r.top > 700) continue;
          // Named, not merely near the top. "The biggest picture in the
          // header" is how modelousa.com's lifestyle shot — a photograph of a
          // man holding a bottle — became three beers' logos. An element that
          // calls itself a logo is making a claim; one that happens to sit up
          // there is not.
          const named = LOGOISH.test(label(el)) || LOGOISH.test(label(el.parentElement ?? el));
          if (!named) continue;
          const score = (inHead(el) ? 1e5 : 0) + r.width * r.height;
          if (el.tagName.toLowerCase() === 'img') {
            const src = el.currentSrc || el.src;
            if (src && !src.startsWith('data:image/gif')) cands.push({ score, kind: 'img', url: src });
          } else if (el.querySelector('path, circle, rect, polygon, text, use, image')) {
            const clone = el.cloneNode(true);
            // Walk both trees together: the live nodes know their computed
            // colour, the clone is what gets written out.
            const live = [el, ...el.querySelectorAll('*')];
            const copy = [clone, ...clone.querySelectorAll('*')];
            for (let i = 0; i < live.length; i++) {
              const cs = getComputedStyle(live[i]);
              const f = cs.fill, st = cs.stroke;
              if (f && f !== 'none') copy[i].setAttribute('fill', f);
              if (st && st !== 'none') copy[i].setAttribute('stroke', st);
              copy[i].removeAttribute('class');
            }
            for (const bad of copy.filter(n => /^(script|style)$/i.test(n.tagName))) bad.remove();
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            if (!clone.getAttribute('viewBox') && r.width && r.height)
              clone.setAttribute('viewBox', `0 0 ${Math.round(r.width)} ${Math.round(r.height)}`);
            clone.setAttribute('width', Math.round(r.width));
            clone.setAttribute('height', Math.round(r.height));
            cands.push({ score, kind: 'svg', markup: clone.outerHTML });
          }
        }
        cands.sort((a, b) => b.score - a.score);
        return cands[0] ?? null;
      });
    } catch { out = null; }
    if (out) break;
  }
  headerCache.set(domain, out);
  return out;
}

// The aggregators, in the order they proved useful when probed. Brandfetch is
// absent on purpose: it answers 403 to the public client ID this project used,
// for every URL shape and every domain. Google's `sz` is 256 and not 512 for
// the same kind of reason — 512 is not a size it serves, and asking for one it
// does not serve gets the 16px default back.
const AGGREGATORS = [
  { why: 'google faviconV2', url: d => `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${d}&size=256` },
  // Icon Horse draws a letter on a grey square for a domain it cannot find an
  // icon for, and serves it 200 OK at exactly 256×256 — a confident answer
  // that is not the brand's logo, which is the one kind of miss worse than no
  // answer at all. It handed twelve beers a grey capital before this was
  // noticed. When it passes a site's real icon through it comes back at that
  // icon's own size (192, 180, 44…), so the exact square is the tell.
  { why: 'icon.horse',       url: d => `https://icon.horse/icon/${d}`,
    reject: s => s.fmt !== 'svg' && s.w === 256 && s.h === 256 ? 'a generated lettermark' : null },
  { why: 'duckduckgo',       url: d => `https://icons.duckduckgo.com/ip3/${d}.ico` },
];

const EXT = { svg: '.svg', png: '.png', jpg: '.jpg', webp: '.webp', gif: '.gif', ico: '.ico' };

function measure(buf, type) {
  if (!buf || buf.length < 64) return null;
  if (/text\/html/i.test(type || '')) return null;
  const s = imageSize(buf);
  if (!s || !s.fmt || s.fmt === '?') return null;
  if (s.fmt !== 'svg' && Math.max(s.w, s.h) < MIN_PX) return null;
  return s;
}

// Within a tier the biggest wins; vector wins outright, being the mark itself
// rather than a rendering of it. Squareness is part of the size: a logo is
// drawn into a square 24px cell, so of a 1200×630 banner only the 630 is ever
// visible, and calling it "1200 wide" would let a social card outrank a real
// 144px app icon.
const scoreOf = s => (s.fmt === 'svg' ? 100000 : Math.min(s.w, s.h));
const squareness = s => (s.fmt === 'svg' ? 1 : Math.min(s.w, s.h) / Math.max(s.w, s.h, 1));

export const slug = name => name.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .replace(/ß/g, 'ss').replace(/['’]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// The ladder, best tier first. Order is a judgement about *what a thing is*,
// not how big it is, so a tier that answers is taken even when a later one
// could answer larger:
//
//   1  the icons the site declares       — square, made to be shrunk, the brand's own
//   2  the logo drawn in its header      — the mark itself, often inline SVG
//   3  the favicon aggregators           — the same icons, second-hand
//   4  og:image, only if roughly square  — usually a hero photograph; a last resort
//
// Tier 4 is fenced because that is what went wrong the first time this ran:
// 29 beers came back with a 1200×630 social card, which is a photograph of a
// bottle where a logo should be.

// ── Wikidata ──────────────────────────────────────────────────
// For a brand whose own site cannot be reached at all. Eight of them could
// not: almaza.com, mahou.es, singhabeer.com, smithwicks.com and the rest
// answer nothing to a datacentre IP, and every favicon service then had
// nothing to pass on either.
//
// Wikidata property P154 is "logo image" — not a photograph of the product,
// not an article's lead image, but the mark itself, which is exactly the thing
// wanted here. The hard part is being sure the item is the right brand, and
// the domain solves it: P856 is "official website", so an item whose official
// website is the domain already recorded in BRAND_DOMAINS is that brand by
// definition. An item that does not match on the domain is not used — a
// confidently wrong logo is worse than none, and Wikipedia search will happily
// answer "Sol" with a Mexican state.
const wdCache = new Map();
const registrable = d => d.replace(/^www\./, '').toLowerCase();

async function wikidataLogo(beerName, domains) {
  const key = `${beerName}|${domains.join(',')}`;
  if (wdCache.has(key)) return wdCache.get(key);
  const api = async url => {
    const r = await get(url, { accept: 'application/json' });
    try { return r && JSON.parse(r.buf.toString('utf8')); } catch { return null; }
  };
  let out = null;
  try {
    const search = await api('https://en.wikipedia.org/w/api.php?action=query&format=json&list=search' +
      `&srsearch=${encodeURIComponent(beerName + ' beer')}&srlimit=6`);
    const titles = (search?.query?.search ?? []).map(r => r.title);
    if (titles.length) {
      const props = await api('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageprops' +
        `&titles=${encodeURIComponent(titles.join('|'))}`);
      const ids = Object.values(props?.query?.pages ?? {})
        .map(p => p.pageprops?.wikibase_item).filter(Boolean);
      const norm = t => String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ').trim();
      for (const id of ids) {
        const ent = await api(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${id}&props=claims|labels&languages=en`);
        const claims = ent?.entities?.[id]?.claims;
        const site = claims?.P856?.map(c => c.mainsnak?.datavalue?.value).filter(Boolean) ?? [];
        const hosts = site.map(u => { try { return registrable(new URL(u).host); } catch { return ''; } });
        // The domain is the strong match. A label match is the weak one, and
        // it has to be the whole name either way round — "Modelo Especial"
        // against the item called Modelo Especial, never "Sol" against
        // anything in the world that happens to be called Sol.
        const label = norm(ent?.entities?.[id]?.labels?.en?.value ?? '');
        const beer = norm(beerName);
        const byDomain = hosts.some(h => domains.some(d => h === registrable(d)));
        const byLabel = label.length > 3 && (label === beer || beer.startsWith(label + ' ') || label.startsWith(beer + ' '));
        if (!byDomain && !byLabel) continue;
        const file = claims?.P154?.[0]?.mainsnak?.datavalue?.value;
        if (!file) continue;
        const info = await api('https://commons.wikimedia.org/w/api.php?action=query&format=json' +
          `&titles=${encodeURIComponent('File:' + file)}&prop=imageinfo&iiprop=url&iiurlwidth=512`);
        const url = Object.values(info?.query?.pages ?? {})[0]?.imageinfo?.[0]?.thumburl;
        if (url) { out = { url, id, file }; break; }
      }
    }
  } catch { out = null; }
  wdCache.set(key, out);
  return out;
}

async function tiersFor(domain, page) {
  const site = await siteCandidates(domain);
  const wikidata = { why: 'wikidata', items: [{ wikidata: true, why: 'wikidata P154' }] };
  const rest = [
    { why: 'site icon', items: site.filter(s => !s.last) },
    { why: 'header',    items: [{ header: true, why: 'site header logo' }] },
    { why: 'service',   items: AGGREGATORS.map(a => ({ url: a.url(domain), why: a.why, reject: a.reject })) },
    { why: 'og',        items: site.filter(s => s.last), squareOnly: true },
  ];
  return WIKIDATA_FIRST ? [wikidata, ...rest] : [...rest.slice(0, 3), wikidata, rest[3]];
}

// A beer gets three minutes. Every source has its own timeout already, but a
// brand with two dead domains can still spend all of them in sequence — and
// the answer after three minutes of that is the same as the answer now.
const BUDGET_MS = 180000;

export async function findLogo(name, domains, page) {
  const tried = [];
  const until = Date.now() + BUDGET_MS;
  for (const d of domains) {
    if (Date.now() > until) { tried.push(`${d} · skipped, out of time`); break; }
    for (const tier of await tiersFor(d, page)) {
      let best = null;
      for (const cand of tier.items) {
        if (Date.now() > until) { tried.push(`${cand.why} · ${d} · skipped, out of time`); break; }
        let got = null, size = null;
        if (cand.wikidata) {
          const hit = await wikidataLogo(name, domains);
          if (hit) got = await get(hit.url);
          if (got) size = measure(got.buf, got.type);
        } else if (cand.header) {
          const hit = page && await headerLogo(d, page);
          if (hit?.kind === 'svg') got = { buf: Buffer.from(hit.markup, 'utf8'), type: 'image/svg+xml', url: `${d} (inline svg)` };
          else if (hit?.kind === 'img') got = await get(hit.url);
          if (got) size = measure(got.buf, got.type);
        } else {
          got = await get(cand.url);
          size = got && measure(got.buf, got.type);
        }
        if (size && tier.squareOnly && squareness(size) < 0.6) {
          tried.push(`${cand.why} · ${d} · ${size.w}×${size.h} rejected, not square`);
          continue;
        }
        const why = size && cand.reject?.(size);
        if (why) { tried.push(`${cand.why} · ${d} · ${size.w}×${size.h} rejected, ${why}`); continue; }
        tried.push(`${cand.why} · ${d} · ${size ? `${size.w}×${size.h} ${size.fmt}` : 'no'}`);
        if (!size) continue;
        const score = scoreOf(size);
        if (!best || score > best.score)
          best = { score, buf: got.buf, size, source: cand.why, domain: d, url: got.url ?? cand.url };
      }
      if (best) return { name, ...best, tried };
    }
  }
  return { name, buf: null, tried };
}


// ── data.js ───────────────────────────────────────────────────
// The files are only half of it: data.js has to name them, or nothing reads
// them. The block is written in the same shape tools/render-data-js.mjs
// writes, so the next `npm run sync` produces the identical text and the file
// does not churn.
const DATA_JS = join(ROOT, 'data.js');
const RULE = '// ' + '═'.repeat(60);

export function writeBrandLogos(map) {
  const q = v => JSON.stringify(String(v));
  const block = [
    RULE,
    "// BRAND LOGOS — the committed file each beer's logo is drawn from",
    RULE,
    '// A path under public/stats/, one per beer name, fetched once by',
    '// `npm run fetch-logos` and held in the repo. This is where a logo comes',
    '// from: the same picture on every render, working offline, and nobody',
    "// else's to withdraw. The domains above are the fallback for a beer that",
    '// has no file yet.',
    RULE,
    'const BRAND_LOGOS = {',
    ...Object.keys(map).sort().map(k => `${q(k)}:${q(map[k])},`),
    '};',
    '',
  ].join('\n');

  let src = readFileSync(DATA_JS, 'utf8');
  const existing = src.match(/(?:^\/\/ ═+\n\/\/ BRAND LOGOS[\s\S]*?)^const BRAND_LOGOS = \{[\s\S]*?^\};\n/m);
  if (existing) src = src.replace(existing[0], block + '\n');
  else {
    const anchor = src.match(/^const BRAND_DOMAINS = \{[\s\S]*?^\};\n\n/m);
    if (!anchor) throw new Error('could not find the BRAND_DOMAINS block in data.js');
    src = src.replace(anchor[0], anchor[0] + block + '\n');
  }
  writeFileSync(DATA_JS, src);
  return Object.keys(map).length;
}

// Every logo file on disk, keyed by the beer it belongs to. Read from the
// directory rather than from this run, so --data-only can rebuild the map
// after a fetch that happened somewhere else.
export function logosOnDisk(names) {
  const onDisk = new Set(readdirSync(LOGO_DIR));
  const map = {};
  for (const n of names)
    for (const e of Object.values(EXT))
      if (onDisk.has(slug(n) + e)) { map[n] = `logos/${slug(n)}${e}`; break; }
  return map;
}

// ── main ──────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const { beers, WANT_TO_TRY, BRAND_DOMAINS } = loadData();
  const names = [...new Set([...beers.map(b => b.beer), ...WANT_TO_TRY.map(w => w.beer)])].sort();

  // Just point data.js at whatever is already in logos/. No network, so it
  // works in a sandbox that cannot reach a single logo service — which is
  // where the fetch itself never can.
  if (args.includes('--data-only')) {
    const map = logosOnDisk(names);
    console.log(`${writeBrandLogos(map)} of ${names.length} beers named in data.js` +
      `${names.length - Object.keys(map).length ? ` — ${names.filter(n => !map[n]).join(', ')} still have no file` : ''}`);
    process.exit(0);
  }

  mkdirSync(LOGO_DIR, { recursive: true });
  const onDisk = new Set(readdirSync(LOGO_DIR));
  const fileFor = n => [...Object.values(EXT)].map(e => slug(n) + e).find(f => onDisk.has(f));

  // A file this tool wrote is its to replace; a file somebody put there by
  // hand is not, and --force does not mean "throw away the logo I drew". The
  // last report says which is which, by filename.
  const mine = new Set();
  try {
    for (const f of JSON.parse(readFileSync(REPORT, 'utf8')).fetched ?? [])
      mine.add(f.file.replace(/^logos\//, ''));
  } catch { /* no report yet — nothing here is ours */ }
  const handPlaced = n => { const f = fileFor(n); return !!f && !mine.has(f); };

  const work = names.filter(n =>
    (!ONLY || ONLY.has(n)) && !handPlaced(n) && (FORCE || !fileFor(n)));
  const kept = names.filter(handPlaced);
  console.log(`${names.length} beers · ${names.filter(fileFor).length} already have a file · ` +
    `fetching ${work.length}${kept.length ? ` · leaving ${kept.length} hand-placed alone (${kept.join(', ')})` : ''}\n`);

  // One browser for the whole run: the header tier navigates in it, and the
  // re-encoding at the end draws in it. Each worker gets its own page, because
  // they navigate independently.
  const { chromium } = await import('playwright');
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

  const found = [], missing = [];
  const queue = [...work];
  const worker = async () => {
    const page = await browser.newPage({ userAgent: UA });
    while (queue.length) {
      const name = queue.shift();
      const r = await findLogo(name, [].concat(BRAND_DOMAINS[name] ?? []), page);
      if (r.buf) { found.push(r); console.log(`  ✓ ${name} — ${r.source} (${r.domain}) ${r.size.w}×${r.size.h} ${r.size.fmt}`); }
      else { missing.push(r); console.log(`  ✗ ${name} — nothing usable`); }
    }
    await page.close();
  };
  await Promise.all(Array.from({ length: 10 }, worker));

  // ── normalise ───────────────────────────────────────────────
  // SVG is written through untouched. A raster is redrawn onto a transparent
  // OUT_PX square — contained, never cropped — and re-encoded as WebP, so a
  // hundred logos are one predictable format at one predictable size. Chromium
  // does the decoding, which is what lets an .ico or an animated .gif land the
  // same way as a .png.
  const rasters = found.filter(r => r.size.fmt !== 'svg');
  {
    const page = await browser.newPage();
    for (const r of rasters) {
      const mime = r.size.fmt === 'ico' ? 'image/x-icon' : `image/${r.size.fmt}`;
      const out = await page.evaluate(async ({ dataUrl, OUT_PX }) => {
        const img = new Image();
        const ok = await new Promise(res => { img.onload = () => res(true); img.onerror = () => res(false); img.src = dataUrl; });
        if (!ok || !img.naturalWidth) return null;
        // The square is the image's own longest edge, capped at OUT_PX —
        // never larger. Padding a 64px icon out to 256 would not add detail,
        // and would make it draw at a quarter of its size in a box sized to
        // the file rather than to the mark inside it.
        const S = Math.min(OUT_PX, Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = c.height = S;
        const ctx = c.getContext('2d');
        const scale = Math.min(S / img.naturalWidth, S / img.naturalHeight);
        const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        return c.toDataURL('image/webp', 0.92);
      }, { dataUrl: `data:${mime};base64,${r.buf.toString('base64')}`, OUT_PX });
      if (out) { r.buf = Buffer.from(out.split(',')[1], 'base64'); r.ext = '.webp'; }
      else r.ext = EXT[r.size.fmt] ?? '.png';
    }
  }
  await browser.close();

  for (const r of found) {
    const ext = r.size.fmt === 'svg' ? '.svg' : (r.ext ?? '.webp');
    // A re-fetch that lands in a different format must not leave the old file
    // behind for the data to keep pointing at.
    for (const e of Object.values(EXT))
      if (e !== ext && onDisk.has(slug(r.name) + e)) unlinkSync(join(LOGO_DIR, slug(r.name) + e));
    r.file = `logos/${slug(r.name)}${ext}`;
    writeFileSync(join(ROOT, r.file), r.buf);
  }

  // Merged, not replaced. A `--only` run touches a handful of beers, and the
  // report is also the record of which files are this tool's to overwrite —
  // rewriting it from one run would make every other logo look hand-placed.
  const previous = new Map();
  try {
    for (const f of JSON.parse(readFileSync(REPORT, 'utf8')).fetched ?? []) previous.set(f.beer, f);
  } catch { /* no report yet */ }
  for (const r of found)
    previous.set(r.name, { beer: r.name, file: r.file, source: r.source, domain: r.domain,
                           url: r.url, size: `${r.size.w}×${r.size.h}`, bytes: r.buf.length });
  for (const n of kept) previous.delete(n);

  writeFileSync(REPORT, JSON.stringify({
    at: new Date().toISOString(),
    total: names.length,
    fetched: [...previous.values()].sort((a, b) => a.beer.localeCompare(b.beer)),
    // Files somebody chose by hand. Listed so the report stays the full answer
    // to "where does each beer's logo come from", not just this run's part.
    kept: kept.map(n => ({ beer: n, file: `logos/${fileFor(n)}` })),
    missing: missing.map(r => ({ beer: r.name, tried: r.tried })),
  }, null, 2));

  writeBrandLogos(logosOnDisk(names));

  console.log(`\n${found.length} written · ${missing.length} still missing`);
  for (const m of missing) console.log(`  ✗ ${m.name}\n      ${m.tried.join('\n      ')}`);
}
