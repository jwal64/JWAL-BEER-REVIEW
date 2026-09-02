#!/usr/bin/env node
// Probes candidate logo sources against real brand domains and reports what
// each one actually returns — status, type, bytes and pixel size.
//
// `npm run logos` answers "does the current chain resolve something?". This
// answers the question behind it: "which source, at which URL shape, actually
// has this brand's logo?" — which is what you need when a whole tier has
// quietly stopped answering and every beer is falling through to a 16px
// favicon.
//
//     node tools/probe-logo-sources.mjs                 # the sample domains
//     node tools/probe-logo-sources.mjs grolsch.com …   # specific ones
//
// It needs open internet; behind a proxy that blocks the CDNs every row reads
// as a failure. Run it on a runner (the Logo audit workflow) if your shell
// cannot reach them.
import { loadData } from './load-data.mjs';

const BRANDFETCH_CLIENT_ID = '1idIddY24o2pZE9n2hu';

// Every URL shape worth asking about, named so the report reads as a verdict
// on the source rather than on the beer.
const CANDIDATES = [
  ['brandfetch w1024',  d => `https://cdn.brandfetch.io/${d}/w/1024/h/1024?c=${BRANDFETCH_CLIENT_ID}`],
  ['brandfetch w512',   d => `https://cdn.brandfetch.io/${d}/w/512/h/512?c=${BRANDFETCH_CLIENT_ID}`],
  ['brandfetch w400',   d => `https://cdn.brandfetch.io/${d}/w/400/h/400?c=${BRANDFETCH_CLIENT_ID}`],
  ['brandfetch bare',   d => `https://cdn.brandfetch.io/${d}?c=${BRANDFETCH_CLIENT_ID}`],
  ['brandfetch noid',   d => `https://cdn.brandfetch.io/${d}/w/512/h/512`],
  ['brandfetch /logo',  d => `https://cdn.brandfetch.io/${d}/logo?c=${BRANDFETCH_CLIENT_ID}`],
  ['brandfetch /icon',  d => `https://cdn.brandfetch.io/${d}/icon?c=${BRANDFETCH_CLIENT_ID}`],
  ['google sz512',      d => `https://www.google.com/s2/favicons?domain=${d}&sz=512`],
  ['google sz256',      d => `https://www.google.com/s2/favicons?domain=${d}&sz=256`],
  ['google sz128',      d => `https://www.google.com/s2/favicons?domain=${d}&sz=128`],
  ['faviconV2 256',     d => `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${d}&size=256`],
  ['icon.horse',        d => `https://icon.horse/icon/${d}`],
  ['duckduckgo',        d => `https://icons.duckduckgo.com/ip3/${d}.ico`],
  ['unavatar',          d => `https://unavatar.io/${d}?fallback=false`],
  ['clearbit',          d => `https://logo.clearbit.com/${d}?size=512`],
  ['site apple-touch',  d => `https://${d}/apple-touch-icon.png`],
  ['site favicon.svg',  d => `https://${d}/favicon.svg`],
];

const SAMPLE = [
  'heineken.com', 'guinness.com', 'grolsch.com', 'hofbraeu-muenchen.de',
  'zywiec.com.pl', 'texels.nl', 'industrialartsbrewing.com',
  'oceanlabbrewing.com', 'medallalight.com', 'cerveceradepr.com',
];

// ── image dimensions, from the header bytes ───────────────────
export function imageSize(buf) {
  if (!buf || buf.length < 8) return null;
  const ascii = buf.subarray(0, Math.min(buf.length, 2048)).toString('latin1');
  // SVG
  if (/<svg[\s>]/i.test(ascii)) {
    const vb = ascii.match(/viewBox\s*=\s*["']\s*[-\d.]+[,\s]+[-\d.]+[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (vb) return { w: Math.round(+vb[1]), h: Math.round(+vb[2]), fmt: 'svg' };
    const w = ascii.match(/\bwidth\s*=\s*["']?([\d.]+)/i), h = ascii.match(/\bheight\s*=\s*["']?([\d.]+)/i);
    return { w: w ? Math.round(+w[1]) : 0, h: h ? Math.round(+h[1]) : 0, fmt: 'svg' };
  }
  // PNG
  if (buf.readUInt32BE(0) === 0x89504e47)
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), fmt: 'png' };
  // GIF
  if (ascii.startsWith('GIF8'))
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8), fmt: 'gif' };
  // ICO — the largest entry in the directory
  if (buf.readUInt16LE(0) === 0 && buf.readUInt16LE(2) === 1) {
    let best = { w: 0, h: 0, fmt: 'ico' };
    const n = buf.readUInt16LE(4);
    for (let i = 0; i < n && 6 + i * 16 + 2 <= buf.length; i++) {
      const w = buf[6 + i * 16] || 256, h = buf[6 + i * 16 + 1] || 256;
      if (w * h > best.w * best.h) best = { w, h, fmt: 'ico' };
    }
    return best;
  }
  // WEBP
  if (ascii.startsWith('RIFF') && ascii.slice(8, 12) === 'WEBP') {
    const c = ascii.slice(12, 16);
    if (c === 'VP8X') return { w: (buf.readUIntLE(24, 3) & 0xffffff) + 1, h: (buf.readUIntLE(27, 3) & 0xffffff) + 1, fmt: 'webp' };
    if (c === 'VP8L') { const b = buf.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1, fmt: 'webp' }; }
    if (c === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff, fmt: 'webp' };
    return { w: 0, h: 0, fmt: 'webp' };
  }
  // JPEG — walk the segments to the frame header
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5), fmt: 'jpg' };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return { w: 0, h: 0, fmt: '?' };
}

export async function probe(url, timeout = 20000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ac.signal, redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (logo-probe)' },
    });
    if (!res.ok) return { ok: false, status: res.status, note: `HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    const size = imageSize(buf);
    return { ok: true, status: res.status, bytes: buf.length,
             type: (res.headers.get('content-type') || '').split(';')[0],
             w: size?.w ?? 0, h: size?.h ?? 0, fmt: size?.fmt ?? '?' };
  } catch (e) {
    return { ok: false, status: 0, note: e.name === 'AbortError' ? 'timeout' : e.message.slice(0, 40) };
  } finally { clearTimeout(t); }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2).filter(a => !a.startsWith('-'));
  let domains = args;
  if (!domains.length) domains = SAMPLE;
  if (args[0] === 'all') {
    const { BRAND_DOMAINS } = loadData();
    domains = [...new Set(Object.values(BRAND_DOMAINS).flat())];
  }

  for (const d of domains) {
    console.log(`\n══ ${d}`);
    const rows = await Promise.all(CANDIDATES.map(async ([name, fn]) => {
      const r = await probe(fn(d));
      return [name, r];
    }));
    for (const [name, r] of rows) {
      console.log(r.ok
        ? `  ${name.padEnd(18)} ${String(r.w).padStart(4)}×${String(r.h).padEnd(4)} ${String(r.bytes).padStart(7)}B  ${r.type}`
        : `  ${name.padEnd(18)} — ${r.note}`);
    }
  }
}
