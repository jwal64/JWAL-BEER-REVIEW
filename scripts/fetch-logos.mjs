#!/usr/bin/env node
// Hardcode every beer's logo into logos/ and write logos/manifest.js.
//
// Sources, in order, per beer:
//   1. scripts/logo-overrides.json (manual URL hint)
//   2. Brandfetch CDN — cdn.brandfetch.io/<domain>/w/1024/h/1024?c=<client>
//   3. Google favicons — www.google.com/s2/favicons?domain=<domain>&sz=512
//   4. Icon Horse     — icon.horse/icon/<domain>
//
// Usage:
//   node scripts/fetch-logos.mjs                 # fill in missing logos
//   node scripts/fetch-logos.mjs --force         # re-download everything
//   node scripts/fetch-logos.mjs "Heineken"      # fetch one beer (force)
//
// On success: logos/<slug>.<ext> files are written and logos/manifest.js is
// regenerated. Commit both.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOGOS_DIR = path.join(ROOT, 'logos');
const SCRIPT_JS = path.join(ROOT, 'script.js');
const OVERRIDES = path.join(ROOT, 'scripts', 'logo-overrides.json');
const MANIFEST_PATH = path.join(LOGOS_DIR, 'manifest.js');
const BRANDFETCH_CLIENT_ID = '1idIddY24o2pZE9n2hu';
const MIN_BYTES = 200; // anything smaller is almost certainly a 404/stub image

// ── Parse BRAND_DOMAINS out of script.js (single source of truth) ────────────
const src = fs.readFileSync(SCRIPT_JS, 'utf8');
const block = src.match(/const BRAND_DOMAINS\s*=\s*\{([\s\S]*?)\n\};/);
if (!block) { console.error('Could not locate BRAND_DOMAINS in script.js'); process.exit(1); }
const BRAND_DOMAINS = {};
for (const line of block[1].split('\n')) {
  const m = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]+)"\s*,?\s*$/);
  if (m) BRAND_DOMAINS[m[1]] = m[2];
}

const overrides = fs.existsSync(OVERRIDES) ? JSON.parse(fs.readFileSync(OVERRIDES, 'utf8')) : {};
delete overrides._comment;

// ── Resolve target list ──────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const force = argv.includes('--force');
const explicit = argv.filter(a => !a.startsWith('--'));
const targets = explicit.length
  ? explicit
  : [...new Set([...Object.keys(BRAND_DOMAINS), ...Object.keys(overrides)])].sort();

function slug(name) {
  return name
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ø/g, 'o').replace(/æ/g, 'ae').replace(/œ/g, 'oe').replace(/đ/g, 'd').replace(/ł/g, 'l')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extFromContentType(ct) {
  if (!ct) return null;
  ct = ct.toLowerCase();
  if (ct.includes('svg'))  return 'svg';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('png'))  return 'png';
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  if (ct.includes('gif'))  return 'gif';
  return null;
}

async function tryDownload(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    const ext = extFromContentType(ct);
    if (!ext) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_BYTES) return null;
    return { ext, buf };
  } catch (e) {
    return null;
  }
}

async function fetchOne(name) {
  // 1. manual override
  if (overrides[name]) {
    const r = await tryDownload(overrides[name]);
    if (r) return { ...r, source: 'override' };
  }
  // 2-4. Brandfetch → Google → Icon Horse
  const domain = BRAND_DOMAINS[name];
  if (!domain) return null;
  const r1 = await tryDownload(`https://cdn.brandfetch.io/${domain}/w/1024/h/1024?c=${BRANDFETCH_CLIENT_ID}`);
  if (r1) return { ...r1, source: 'brandfetch' };
  const r2 = await tryDownload(`https://www.google.com/s2/favicons?domain=${domain}&sz=512`);
  if (r2) return { ...r2, source: 'google' };
  const r3 = await tryDownload(`https://icon.horse/icon/${domain}`);
  if (r3) return { ...r3, source: 'iconhorse' };
  return null;
}

function existingFileFor(s) {
  if (!fs.existsSync(LOGOS_DIR)) return null;
  const match = fs.readdirSync(LOGOS_DIR).find(f =>
    f === `${s}.svg` || f === `${s}.png` || f === `${s}.webp` ||
    f === `${s}.jpg` || f === `${s}.gif`);
  return match || null;
}

// ── Run ──────────────────────────────────────────────────────────────────────
fs.mkdirSync(LOGOS_DIR, { recursive: true });
const manifest = {};
const failed = [];
let okCount = 0;

for (let i = 0; i < targets.length; i++) {
  const name = targets[i];
  const s = slug(name);
  const label = `[${String(i + 1).padStart(3)}/${targets.length}] ${name}`;

  if (!force && !explicit.length) {
    const ex = existingFileFor(s);
    if (ex) {
      manifest[name] = `logos/${ex}`;
      console.log(`${label} — skip (have ${ex})`);
      okCount++;
      continue;
    }
  }

  const r = await fetchOne(name);
  if (!r) {
    console.log(`${label} — FAIL (no working source)`);
    failed.push(name);
    const ex = existingFileFor(s);
    if (ex) manifest[name] = `logos/${ex}`;
    continue;
  }
  const filename = `${s}.${r.ext}`;
  fs.writeFileSync(path.join(LOGOS_DIR, filename), r.buf);
  manifest[name] = `logos/${filename}`;
  console.log(`${label} — ${r.source} ${r.ext} ${r.buf.length}b → ${filename}`);
  okCount++;
}

// Preserve manifest entries for beers we didn't target this run
if (explicit.length && fs.existsSync(MANIFEST_PATH)) {
  const prev = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const objMatch = prev.match(/=\s*(\{[\s\S]*\})\s*;?\s*$/m);
  if (objMatch) {
    try {
      const existing = JSON.parse(objMatch[1]);
      for (const [k, v] of Object.entries(existing)) {
        if (!(k in manifest)) manifest[k] = v;
      }
    } catch {}
  }
}

const sortedEntries = Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b));
const body = sortedEntries.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n');
fs.writeFileSync(MANIFEST_PATH,
`// Auto-generated by scripts/fetch-logos.mjs — do not edit by hand.
// Maps each beer name to its local logo file. Loaded by index.html before
// script.js so logos render synchronously from the repo.
window.LOCAL_LOGOS_MANIFEST = {
${body}
};
`);

console.log(`\nDone: ${okCount} ok · ${failed.length} failed`);
if (failed.length) {
  console.log('Failed beers (add a URL to scripts/logo-overrides.json and re-run):');
  for (const n of failed) console.log(`  - ${n}`);
  process.exit(1);
}
