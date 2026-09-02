#!/usr/bin/env node
// Fetches every beer's official logo once, at the best resolution anyone has,
// so the site stops asking a stranger for it on every page load.
//
// The runtime chain asked a third party for a logo each time a card rendered,
// and answered only as well as that service was having a day. When Brandfetch
// began refusing the embedded client ID, all 97 beers without a local file
// dropped silently to Google's 16px default favicon and the site rendered a
// hundred grey globes. Nothing in the repo had changed; nothing in it could
// have prevented that.
//
// So the logo becomes a file we hold. Two things decide which file:
//
//   1. Resolution. Candidates are ranked by it, and vector wins outright — an
//      SVG is every size at once and usually smaller than a PNG of it. A
//      brand's 2048px logo on Wikimedia Commons beats its 180px touch icon,
//      which beats a 256px favicon. The ladder is that ordering, not a
//      preference between sources.
//
//   2. Whether it is a logo at all — the hard part, and not solved by size.
//      og:image is a 1200×630 photograph, modelousa.com's header holds a
//      picture of a man with a bottle, bitburger.de's touch icon is a full
//      glass, and every one of those is bigger than the mark it displaces. So
//      every raster is looked at — how much of it is transparent, how many
//      distinct colours it holds — and the photographs are refused.
//
//     node tools/fetch-logos.mjs                 # everything with no file yet
//     node tools/fetch-logos.mjs --force         # re-fetch even what we have
//     node tools/fetch-logos.mjs --only "Grolsch,Duvel"
//     node tools/fetch-logos.mjs --data-only     # just re-point data.js at logos/
//
// Needs open internet and Playwright's Chromium (which reads and re-encodes
// what comes back). The Fetch logos workflow runs it on a runner and commits
// the result; logo-fetch-report.json records where every logo came from and
// what it measured, so a wrong one can be traced to the source that gave it —
// and `npm run logo-sheet` draws them all on one page, which is the only check
// that can tell a brand's mark from a picture of a bottle.
import { mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadData } from './load-data.mjs';
import { imageSize } from './probe-logo-sources.mjs';

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const onlyArg = args.indexOf('--only');
const ONLY = onlyArg >= 0 ? new Set(args[onlyArg + 1].split(',').map(s => s.trim())) : null;

const LOGO_DIR = join(ROOT, 'logos');
const REPORT = join(ROOT, 'logo-fetch-report.json');

// A raster this small is a favicon, not a logo: the generic globe the services
// answer with for a domain they don't know is 16px, and anything under this is
// too coarse to draw at 2× on a card.
const MIN_PX = 48;
// The cap, not a target — nothing is ever upscaled, because inventing pixels
// makes a file bigger without making a logo sharper. A vector has no size at
// all and is stored as it came.
const OUT_PX = 2048;

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
// Wikimedia's API and its file servers both ask for a user agent that says who
// is calling, and refuse generic browser strings from cloud addresses. Getting
// this wrong is quiet: the search answers nothing, or it answers and then the
// image download 403s, and either way the beer just looks like a brand with no
// logo. Every Wikimedia request uses this, the picture included.
const WIKI_UA = 'beer-review-buddy-logo-fetcher/1.0 (https://github.com/jwal64/beer-review-buddy)';

// 8 seconds. A hundred beers times a dozen candidates times a handful of
// domains is a great deal of waiting for sources that are simply not there,
// and a logo server slower than this is not one to depend on anyway.
async function get(url, { timeout = 8000, accept = 'image/*,*/*', ua = UA } = {}) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ac.signal, redirect: 'follow',
      headers: { 'user-agent': ua, accept } });
    if (!res.ok) return null;
    return { buf: Buffer.from(await res.arrayBuffer()),
             type: (res.headers.get('content-type') || '').split(';')[0].trim(),
             url: res.url };
  } catch { return null; }
  finally { clearTimeout(t); }
}

// page.evaluate has no timeout of its own: on a site that keeps the main
// thread busy it waits forever, and one such site would hang the whole run.
// Everything that touches a page goes through this.
const withTimeout = (p, ms, label) => Promise.race([
  p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} timed out`)), ms)),
]);

// ── the brand's own site ──────────────────────────────────────
// The icons a site declares. `mask-icon` is skipped on purpose: Safari's
// pinned-tab icon is a monochrome silhouette by definition, which is a worse
// logo than a colour favicon half its size.
function iconsFromHtml(html, base) {
  const out = [];
  const abs = href => { try { return new URL(href, base).href; } catch { return null; } };
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] || '').toLowerCase();
    if (!/(^|\s)(apple-touch-icon|apple-touch-icon-precomposed|icon|shortcut icon)(\s|$)/.test(rel)) continue;
    if (/mask-icon/.test(rel)) continue;
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const u = href && abs(href);
    if (u) out.push({ url: u, why: `site rel="${rel.trim()}"`, kind: 'site-icon' });
  }

  // og:image is deliberately absent. It is a social card, and every time it
  // has answered here it has answered with one: 29 beers took a 1200×630
  // photograph the first time it was allowed, and the last one left took
  // prazdroj.cz's FB-share.png — a 600×600 photograph of the brewery gate,
  // square enough to pass the shape test and flat enough to pass the
  // photograph test. It has never once produced a mark worth keeping.
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
      .map(p => ({ url: `https://${domain}/${p}`, why: `site /${p}`, kind: 'site-icon' }));
  siteCache.set(domain, found);
  return found;
}

// ── the brand's own header logo, read in a browser ────────────
// The source that needs a real page. A site declaring no icon bigger than 32px
// still draws its mark at the top of every page, often several hundred pixels
// wide and often as inline SVG — which no amount of reading the HTML as text
// will find, and which is the mark itself rather than a picture of it.
//
// Only elements that *call themselves* a logo are taken. "The biggest picture
// in the header" is how modelousa.com's lifestyle shot became three beers'
// logos: an element naming itself a logo is making a claim, one that merely
// sits up there is not.
//
// Inline SVG is serialised with its computed fill and stroke written onto every
// node, because those colours live in a stylesheet that is not coming with it,
// and a wordmark that arrives black renders as a black square.
const headerCache = new Map();
async function headerLogo(domain, page) {
  if (headerCache.has(domain)) return headerCache.get(domain);
  let out = null;
  for (const base of [`https://${domain}/`, `https://www.${domain}/`]) {
    try {
      await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1200);
      out = await withTimeout(page.evaluate(() => {
        const LOGOISH = /logo|brand|wordmark|marque/i;
        const label = el => [el.id, el.getAttribute('class') || '', el.getAttribute('alt') || '',
          el.getAttribute('aria-label') || '', el.getAttribute('src') || ''].join(' ');
        const inHead = el => !!el.closest('header,nav,[class*="header" i],[class*="nav" i]')
          || !!el.closest('a[href="/"]');
        const cands = [];
        for (const el of document.querySelectorAll('img, svg')) {
          const r = el.getBoundingClientRect();
          if (r.width < 32 || r.height < 14 || r.top > 700) continue;
          if (!LOGOISH.test(label(el)) && !LOGOISH.test(label(el.parentElement ?? el))) continue;
          const score = (inHead(el) ? 1e5 : 0) + r.width * r.height;
          if (el.tagName.toLowerCase() === 'img') {
            // naturalWidth counts too: a header draws its logo at 160px and
            // often serves a 1000px file to do it.
            const src = el.currentSrc || el.src;
            if (src && !src.startsWith('data:image/gif'))
              cands.push({ score: score + (el.naturalWidth || 0), kind: 'img', url: src });
          } else if (el.querySelector('path, circle, rect, polygon, text, use, image')) {
            const clone = el.cloneNode(true);
            // Walk both trees together: the live nodes know their computed
            // colour, the clone is what gets written out.
            const live = [el, ...el.querySelectorAll('*')];
            const copy = [clone, ...clone.querySelectorAll('*')];
            for (let i = 0; i < live.length; i++) {
              const cs = getComputedStyle(live[i]);
              if (cs.fill && cs.fill !== 'none') copy[i].setAttribute('fill', cs.fill);
              if (cs.stroke && cs.stroke !== 'none') copy[i].setAttribute('stroke', cs.stroke);
              copy[i].removeAttribute('class');
            }
            for (const bad of copy.filter(n => /^(script|style)$/i.test(n.tagName))) bad.remove();
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            if (!clone.getAttribute('viewBox') && r.width && r.height)
              clone.setAttribute('viewBox', `0 0 ${Math.round(r.width)} ${Math.round(r.height)}`);
            clone.setAttribute('width', Math.round(r.width));
            clone.setAttribute('height', Math.round(r.height));
            cands.push({ score: score + 1e6, kind: 'svg', markup: clone.outerHTML });
          }
        }
        cands.sort((a, b) => b.score - a.score);
        return cands[0] ?? null;
      }), 15000, `reading ${base}`);
    } catch { out = null; }
    if (out) break;
  }
  headerCache.set(domain, out);
  return out;
}

// ── Wikidata ──────────────────────────────────────────────────
// Property P154 is "logo image" — the mark itself, not a photograph of the
// product and not an article's lead image — and Commons holds most of them as
// SVG, which is the highest resolution there is. For the brands whose own sites
// answer nothing at all to a datacentre IP it is the only real source; for many
// others it is simply the best one.
//
// The risk is matching the wrong brand, and the domain settles it: P856 is
// "official website", so an item whose official website is a domain already
// recorded in BRAND_DOMAINS is that brand by definition. Failing that, the
// item's label has to be the beer's whole name — never "Sol" against anything
// in the world that happens to be called Sol.

// Commons, asked by name. Wikidata's P154 is the precise answer and this is
// the broad one, so it runs only when P154 has nothing: a file in Commons'
// File namespace whose name contains the word "logo" *and* every significant
// word of the beer's name. Both halves matter — "logo" alone would take a
// photograph of a brewery sign, and the words alone would take a bottle shot.

async function commonsLogoFile(beerName, api, norm) {
  const words = norm(beerName).split(' ').filter(w => w.length >= 3);
  // Two words, and no way around it. A one-word name cannot identify a file
  // in a collection of millions: "Sol" found Solana's mark, "Wrench" found
  // Monkey Wrench, and "Orion" found Orion Pharma — which also *leads* the
  // filename, so the rule that a single word must come first bought nothing.
  // Two distinctive words is what makes "Pilsner Urquell" land on the right
  // 2048px wordmark, and it is the whole of the difference.
  if (words.length < 2) return null;
  const hits = [];
  for (const q of [`${beerName} logo`, beerName]) {
    const res = await api('https://commons.wikimedia.org/w/api.php?action=query&format=json' +
      `&list=search&srnamespace=6&srlimit=20&srsearch=${encodeURIComponent(q)}`);
    for (const r of res?.query?.search ?? []) hits.push(String(r.title).replace(/^File:/, ''));
  }
  const ok = [...new Set(hits)].filter(t => {
    const n = ` ${norm(t)} `;
    // Every significant word of the beer's name, as a whole word…
    if (!words.every(w => n.includes(` ${w} `))) return false;
    // …and the file has to say it is a logo. The vector extension was tried
    // as a second way of saying that and is not one: Commons holds vector
    // drawings of tools and coats of arms too.
    if (!/ logo /.test(n)) return false;
    // Commons is also where the encyclopaedia keeps its own furniture.
    // "Logo of Tsingtao Wikipedians' Group" is a real logo of a real thing
    // that is not a brewery.
    return !/ (wikipedia|wikimedia|wikipedians|wikiproject|commons) /.test(n);
  });
  ok.sort((a, b) => (/\.svgz?$/i.test(b) ? 1 : 0) - (/\.svgz?$/i.test(a) ? 1 : 0));
  return ok[0] ?? null;
}

const wdCache = new Map();
const registrable = d => d.replace(/^www\./, '').toLowerCase();

async function wikidataLogo(beerName, domains) {
  const key = `${beerName}|${domains.join(',')}`;
  if (wdCache.has(key)) return wdCache.get(key);
  const api = async url => {
    const r = await get(url, { accept: 'application/json', ua: WIKI_UA });
    try { return r && JSON.parse(r.buf.toString('utf8')); } catch { return null; }
  };
  const norm = t => String(t).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  let out = null, why = 'no article found';
  try {
    const search = await api('https://en.wikipedia.org/w/api.php?action=query&format=json&list=search' +
      `&srsearch=${encodeURIComponent(beerName + ' beer')}&srlimit=5`);
    if (!search) why = 'the Wikipedia API did not answer';
    const titles = (search?.query?.search ?? []).map(r => r.title);
    if (titles.length) {
      why = 'no article was this brand';
      const props = await api('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageprops' +
        `&titles=${encodeURIComponent(titles.join('|'))}`);
      const ids = Object.values(props?.query?.pages ?? {})
        .map(p => p.pageprops?.wikibase_item).filter(Boolean);
      for (const id of ids) {
        const ent = await api('https://www.wikidata.org/w/api.php?action=wbgetentities&format=json' +
          `&ids=${id}&props=claims|labels&languages=en`);
        const claims = ent?.entities?.[id]?.claims;
        const hosts = (claims?.P856?.map(c => c.mainsnak?.datavalue?.value).filter(Boolean) ?? [])
          .map(u => { try { return registrable(new URL(u).host); } catch { return ''; } });
        const label = norm(ent?.entities?.[id]?.labels?.en?.value ?? '');
        const beer = norm(beerName);
        const byDomain = hosts.some(h => domains.some(d => h === registrable(d)));
        // The beer may be more specific than the article ("Guinness Draught"
        // against the item called Guinness), never less: an item whose label
        // merely *starts* with the beer's name is a different brand wearing
        // the same first word. That direction is how budweiser.com ended up
        // with Budějovický Budvar's logo on it — the Czech brewery Anheuser-
        // Busch has spent a century in court with.
        const byLabel = label.length > 3 && (label === beer || beer.startsWith(label + ' '));
        if (!byDomain && !byLabel) continue;
        let file = claims?.P154?.[0]?.mainsnak?.datavalue?.value, byName = false;
        if (!file) { file = await commonsLogoFile(beerName, api, norm); byName = !!file; }
        if (!file) { why = `${id} is the right brand but has no logo on file`; continue; }
        const info = await api('https://commons.wikimedia.org/w/api.php?action=query&format=json' +
          `&titles=${encodeURIComponent('File:' + file)}&prop=imageinfo&iiprop=url&iiurlwidth=${OUT_PX}`);
        const ii = Object.values(info?.query?.pages ?? {})[0]?.imageinfo?.[0];
        if (!ii) { why = `Commons has no file called ${file}`; continue; }
        // Special:FilePath first: it is the address Commons documents for
        // fetching a file, it redirects to whichever host is serving it today,
        // and `width` gets a render of an SVG at any size. The imageinfo URLs
        // are kept behind it because a file whose name has been normalised
        // away resolves through them and not through the path.
        const path = 'https://commons.wikimedia.org/wiki/Special:FilePath/' +
          encodeURIComponent(file) + (/\.svgz?$/i.test(ii.url) ? '' : `?width=${OUT_PX}`);
        out = { urls: [path, ii.thumburl, ii.url].filter(Boolean), id, file, byName };
        break;
      }
    }
    // There was a second Commons search here, for beers no Wikidata item
    // matched at all. It is gone. Identifying a brand from a filename alone is
    // what put Solana's mark on Sol, Monkey Wrench's on Wrench and Orion
    // Pharma's — a pharmaceutical company — on Orion, and each guard added
    // against it caught only the example that prompted it. The search stays
    // where it corroborates: above, where the item is already known to be the
    // right brand and only its logo is missing. It does not get to decide
    // which brand a file belongs to.
  } catch { out = null; }
  // Return what was cached, not `out`: a miss has to come back as the reason
  // it missed, or the caller sees null, cannot tell it from a source it never
  // asked, and reports "no" for every one of the several different nothings
  // this can end in. (It also crashed on the next line, which is how it was
  // finally noticed.)
  const answer = out ?? { why };
  wdCache.set(key, answer);
  return answer;
}

// The favicon services, in the order they proved useful when probed.
// Brandfetch is absent on purpose: it answers 403 to the public client ID this
// project used, for every URL shape and every domain. Google's size is 256 and
// not 512 for a related reason — 512 is not a size it serves, and asking for
// one it does not serve returns the 16px default rather than an error.
const AGGREGATORS = [
  { why: 'google faviconV2', url: d => `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${d}&size=256` },
  // Icon Horse draws a letter on a grey square for a domain it cannot find an
  // icon for, and serves it 200 OK at exactly 256×256 — a confident answer
  // that is not the brand's logo, which is the one kind of miss worse than no
  // answer at all. It handed twelve beers a grey capital before this was
  // noticed. When it passes a site's real icon through, that icon comes back
  // at its own size (192, 180, 44…), so the exact square is the tell.
  { why: 'icon.horse', url: d => `https://icon.horse/icon/${d}`,
    reject: s => s.fmt !== 'svg' && s.w === 256 && s.h === 256 ? 'a generated lettermark' : null },
  { why: 'duckduckgo', url: d => `https://icons.duckduckgo.com/ip3/${d}.ico` },
];

const EXT = { svg: '.svg', png: '.png', jpg: '.jpg', webp: '.webp', gif: '.gif', ico: '.ico' };

function measure(buf, type, kind) {
  if (!buf || buf.length < 64) return null;
  if (/text\/html/i.test(type || '')) return null;
  const s = imageSize(buf);
  if (!s || !s.fmt || s.fmt === '?') return null;
  // The floor is aimed at the services' generic globe, which is 16px and is
  // nobody's logo. A site's *own declared icon* is not that: whatever size a
  // brand publishes at, that is the brand saying this is its mark, and a real
  // 32px crest beats no logo at all. It is recorded at its own size, so the
  // sheet and the report both show how small it is.
  const floor = kind === 'site-icon' ? 32 : MIN_PX;
  if (s.fmt !== 'svg' && Math.max(s.w, s.h) < floor) return null;
  return s;
}

// ── is it a logo, or a photograph? ────────────────────────────
// Size cannot answer this and neither can the source: the biggest candidate for
// a beer is routinely a 1200×630 social card, and a site's own touch icon is
// sometimes a picture of a full glass. Two measurements separate them, and
// Chromium is already here to take them.
//
//   transparency     — a logo is usually drawn on nothing; a photograph fills
//                      its frame corner to corner
//   distinct colours — a wordmark holds a handful, a photograph thousands
//
// Either alone is wrong: plenty of real logos sit on an opaque square (DAB's
// green box, Asahi's black one), and a richly illustrated crest holds hundreds
// of colours. Both together is what a photograph looks like and a mark does not.
async function inspect(buf, fmt, page) {
  const mime = fmt === 'ico' ? 'image/x-icon' : fmt === 'svg' ? 'image/svg+xml' : `image/${fmt}`;
  try {
    return await withTimeout(page.evaluate(async ({ dataUrl }) => {
      const img = new Image();
      const ok = await new Promise(r => { img.onload = () => r(true); img.onerror = () => r(false); img.src = dataUrl; });
      if (!ok || !img.naturalWidth) return { undrawable: true };
      const N = 128;
      const c = document.createElement('canvas');
      c.width = c.height = N;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      const scale = Math.min(N / img.naturalWidth, N / img.naturalHeight);
      const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
      ctx.drawImage(img, (N - w) / 2, (N - h) / 2, w, h);
      const { data } = ctx.getImageData(0, 0, N, N);
      const seen = new Set();
      let ink = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 16) continue;
        ink++;
        // 5 bits a channel: fine enough to tell a gradient from a flat fill,
        // coarse enough that JPEG noise is not counted as colour.
        seen.add(((data[i] >> 3) << 10) | ((data[i + 1] >> 3) << 5) | (data[i + 2] >> 3));
      }
      const drawn = w * h;
      return { ink: ink / drawn, clear: 1 - ink / drawn, colours: seen.size };
    }, { dataUrl: `data:${mime};base64,${buf.toString('base64')}` }), 30000, 'measuring an image');
  } catch { return null; }   // timed out: say nothing rather than the wrong thing
}

// What the inspection is allowed to conclude.
function refuse(size, m, kind) {
  // A JPEG is a photograph. The format is the tell, and a far better one than
  // any measurement of the pixels: a mark needs transparency and hard edges,
  // so brands and Commons alike ship PNG or SVG, and JPEG is what you get when
  // the "logo" is really a picture of the product. It is how modelousa.com's
  // cutout of a man holding a bottle, Wikidata's photograph of Mythos in two
  // glasses and a dark shot of Guinness pints all arrived called logos.
  // …but only where the format is the source's own claim about the content.
  // Two exceptions, for opposite reasons. A favicon service re-encodes
  // whatever the site gave it — Google and DuckDuckGo both hand back Bud
  // Light's perfectly real mark as a JPEG — so the format says nothing there.
  // And Wikidata's P154 *is* the claim: the property means "logo image", so a
  // JPEG under it is an old upload of a logo at least as often as it is a
  // photograph, and Augustiner's is 1920×1187 of exactly that. In both cases
  // the pixels answer instead of the extension.
  if (size.fmt === 'jpg' && kind !== 'service' && kind !== 'wikidata')
    return 'a JPEG, which is a photograph and not a mark';
  if (!m) return null;                                   // measurement timed out
  if (m.undrawable) return 'an image the browser cannot draw';
  // An inline SVG lifted from a header can come out empty — the shapes were in
  // a <use> or a stylesheet that did not come with it. 112 bytes of nothing
  // renders as nothing, and passes every other check there is.
  if (m.ink < 0.015) return `blank (${(m.ink * 100).toFixed(1)}% of it is drawn on)`;
  // The backstop for a photograph that is not a JPEG. Deliberately cautious:
  // real logos sit on opaque squares (DAB's green box, Asahi's black one) and
  // illustrated crests hold hundreds of colours, so this only fires where
  // both are true at once.
  if (m.clear < 0.02 && m.colours > 1200)
    return `a photograph (${m.colours} colours, nothing transparent)`;
  return null;
}

// Vector wins outright: every resolution at once, and the mark itself rather
// than a rendering of one. Among rasters the answer is simply how big it is —
// which is the point, since 180px is not HD and 2048 is. The source only
// breaks ties.
const KIND_RANK = { wikidata: 5, 'site-icon': 4, header: 3, commons: 2, service: 1 };
const scoreOf = (s, kind) => (s.fmt === 'svg' ? 1e9 : Math.min(s.w, s.h) * 10) + (KIND_RANK[kind] ?? 0);
const squareness = s => (s.fmt === 'svg' ? 1 : Math.min(s.w, s.h) / Math.max(s.w, s.h, 1));

export const slug = name => name.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .replace(/ß/g, 'ss').replace(/['’]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Every URL worth asking for this beer, across every domain it lists.
async function candidatesFor(name, domains, page) {
  const out = [{ wikidata: true, why: 'wikidata P154', kind: 'wikidata', domain: domains[0] ?? '—' }];
  for (const d of domains) {
    for (const c of await siteCandidates(d)) out.push({ ...c, domain: d });
    out.push({ header: true, why: 'site header logo', kind: 'header', domain: d });
    for (const a of AGGREGATORS)
      out.push({ url: a.url(d), why: a.why, reject: a.reject, kind: 'service', domain: d });
  }
  return out;
}

// A beer gets three minutes. Every source has its own timeout already, but a
// brand with two dead domains can still spend all of them in sequence — and
// the answer after three minutes of that is the answer now.
const BUDGET_MS = 180000;

export async function findLogo(name, domains, page, lab = page) {
  const tried = [];
  const until = Date.now() + BUDGET_MS;
  let best = null, refused = false;

  for (const cand of await candidatesFor(name, domains, page)) {
    if (Date.now() > until) { tried.push(`${cand.why} · ${cand.domain} · skipped, out of time`); break; }
    // Nothing beats a vector, so stop asking once one is in hand.
    if (best?.size.fmt === 'svg') break;

    let got = null, kind = cand.kind, why = cand.why;
    if (cand.wikidata) {
      const hit = await wikidataLogo(name, domains);
      if (hit?.why) { tried.push(`${cand.why} · ${hit.why}`); continue; }
      for (const u of hit?.urls ?? []) { got = await get(u, { ua: WIKI_UA }); if (got) break; }
      // A name match is a guess about which file is the brand's; P154 is the
      // encyclopaedia saying so. Only the latter earns the JPEG exemption, and
      // the report should not call one the other.
      if (hit?.byName) { kind = 'commons'; why = 'commons by name'; }
      if (!got) { tried.push(`${cand.why} · found ${hit?.file ?? 'a file'}, but none of its URLs downloaded`); continue; }
    } else if (cand.header) {
      const hit = await headerLogo(cand.domain, page);
      if (hit?.kind === 'svg')
        got = { buf: Buffer.from(hit.markup, 'utf8'), type: 'image/svg+xml', url: `${cand.domain} (inline svg)` };
      else if (hit?.kind === 'img') got = await get(hit.url);
    } else {
      got = await get(cand.url);
    }

    const size = got && measure(got.buf, got.type, kind);
    const where = `${why} · ${cand.domain}`;
    if (!size) { tried.push(`${where} · no`); continue; }

    const no = cand.reject?.(size)
      ?? (cand.squareOnly && squareness(size) < 0.6 ? 'not square' : null)
      ?? refuse(size, await inspect(got.buf, size.fmt, lab), kind);
    if (no) { refused = true; tried.push(`${where} · ${size.w}×${size.h} rejected, ${no}`); continue; }

    const score = scoreOf(size, kind);
    tried.push(`${where} · ${size.w}×${size.h} ${size.fmt}`);
    if (!best || score > best.score)
      best = { score, buf: got.buf, size, source: why, domain: cand.domain,
               kind, url: got.url ?? cand.url };
  }
  return best ? { name, ...best, tried } : { name, buf: null, tried, refused };
}

// ── data.js ───────────────────────────────────────────────────
// The files are only half of it: data.js has to name them, or nothing reads
// them. The block is written in the same shape tools/render-data-js.mjs writes,
// so the next `npm run sync` produces identical text and the file does not
// churn.
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
    const gaps = names.filter(n => !map[n]);
    console.log(`${writeBrandLogos(map)} of ${names.length} beers named in data.js` +
      (gaps.length ? ` — ${gaps.join(', ')} still have no file` : ''));
    process.exit(0);
  }

  mkdirSync(LOGO_DIR, { recursive: true });
  const onDisk = new Set(readdirSync(LOGO_DIR));
  const fileFor = n => [...Object.values(EXT)].map(e => slug(n) + e).find(f => onDisk.has(f));

  // A file this tool wrote is its to replace; a file somebody put there by hand
  // is not, and --force does not mean "throw away the logo I drew". The last
  // report says which is which, by filename.
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

  // Nothing to fetch is the expected state once every beer has a file, and it
  // does not need a browser. Launching one anyway turned the ordinary no-op
  // run into a crash on any machine whose Chromium revision does not match the
  // installed Playwright — which reads as a broken tool rather than as
  // "there was nothing to do".
  if (!work.length) {
    console.log('Nothing to fetch.\n');
    process.exit(0);
  }

  // One browser for the whole run: the header source navigates in it, the
  // photograph test measures in it, and the re-encoding at the end draws in it.
  // Each worker gets its own page, because they navigate independently.
  const { chromium } = await import('playwright');
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

  const found = [], missing = [];
  const queue = [...work];
  const worker = async () => {
    const page = await browser.newPage({ userAgent: UA });
    // A blank page to measure on. Doing it on the page just navigated would
    // put the test at the mercy of that site's content policy: a strict
    // img-src forbids the data: URL, the measurement comes back empty, and a
    // photograph passes for want of a way to look at it.
    const lab = await browser.newPage();
    while (queue.length) {
      const name = queue.shift();
      const r = await findLogo(name, [].concat(BRAND_DOMAINS[name] ?? []), page, lab);
      if (r.buf) { found.push(r); console.log(`  ✓ ${name} — ${r.source} (${r.domain}) ${r.size.w}×${r.size.h} ${r.size.fmt}`); }
      else { missing.push(r); console.log(`  ✗ ${name} — nothing usable`); }
    }
    await page.close();
    await lab.close();
  };
  await Promise.all(Array.from({ length: 10 }, worker));

  // ── normalise ───────────────────────────────────────────────
  // SVG is written through untouched — already every size at once, and usually
  // smaller than a raster of it. A raster is redrawn onto a transparent square
  // at its own longest edge, capped at OUT_PX and never stretched beyond what
  // it came in at, then re-encoded as WebP. Chromium does the decoding, which
  // is what lets an .ico or an animated .gif land the same way as a .png.
  const rasters = found.filter(r => r.size.fmt !== 'svg');
  {
    const page = await browser.newPage();
    for (const r of rasters) {
      const mime = r.size.fmt === 'ico' ? 'image/x-icon' : `image/${r.size.fmt}`;
      const out = await page.evaluate(async ({ dataUrl, OUT_PX }) => {
        const img = new Image();
        const ok = await new Promise(res => { img.onload = () => res(true); img.onerror = () => res(false); img.src = dataUrl; });
        if (!ok || !img.naturalWidth) return null;
        const S = Math.min(OUT_PX, Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = c.height = S;
        const ctx = c.getContext('2d');
        const scale = Math.min(S / img.naturalWidth, S / img.naturalHeight);
        const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        return [c.toDataURL('image/webp', 0.92), S];
      }, { dataUrl: `data:${mime};base64,${r.buf.toString('base64')}`, OUT_PX });
      if (out) { r.buf = Buffer.from(out[0].split(',')[1], 'base64'); r.ext = '.webp'; r.stored = out[1]; }
      else r.ext = EXT[r.size.fmt] ?? '.png';
    }
    await page.close();
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

  // A beer re-fetched that came back with nothing loses the file it had —
  // but only when something was actually *refused*. That file is then what
  // the fetch just turned down, and leaving it would keep the wrong logo and
  // let the check pass. When every candidate merely failed to answer, the
  // network had a bad minute and the logo already on disk is the better
  // answer; Big Wave lost a perfectly good one that way.
  for (const m of missing) {
    const old = fileFor(m.name);
    if (!old || !mine.has(old)) continue;
    if (m.refused) { unlinkSync(join(LOGO_DIR, old)); console.log(`  – dropped logos/${old}`); }
    else console.log(`  · kept logos/${old} — nothing was refused, no source answered`);
  }

  writeBrandLogos(logosOnDisk(names));

  // Merged, not replaced. A `--only` run touches a handful of beers, and the
  // report is also the record of which files are this tool's to overwrite —
  // rewriting it from one run would make every other logo look hand-placed.
  const previous = new Map();
  try {
    for (const f of JSON.parse(readFileSync(REPORT, 'utf8')).fetched ?? []) previous.set(f.beer, f);
  } catch { /* no report yet */ }
  for (const r of found)
    previous.set(r.name, { beer: r.name, file: r.file, source: r.source, domain: r.domain,
                           from: `${r.size.w}×${r.size.h} ${r.size.fmt}`,
                           stored: r.size.fmt === 'svg' ? 'vector' : `${r.stored ?? '?'}px`,
                           url: r.url, bytes: r.buf.length });
  for (const n of kept) previous.delete(n);
  // A beer whose re-fetch found nothing has no file any more (it was dropped
  // above), so its old row would be a record of a logo that is not there.
  for (const m of missing) if (m.refused || !fileFor(m.name)) previous.delete(m.name);

  writeFileSync(REPORT, JSON.stringify({
    at: new Date().toISOString(),
    total: names.length,
    fetched: [...previous.values()].sort((a, b) => a.beer.localeCompare(b.beer)),
    // Files somebody chose by hand. Listed so the report stays the full answer
    // to "where does each beer's logo come from", not just this run's part.
    kept: kept.map(n => ({ beer: n, file: `logos/${fileFor(n)}` })),
    missing: missing.map(r => ({ beer: r.name, tried: r.tried })),
  }, null, 2));

  console.log(`\n${found.length} written · ${missing.length} still missing`);
  for (const m of missing) console.log(`  ✗ ${m.name}\n      ${m.tried.join('\n      ')}`);
}
