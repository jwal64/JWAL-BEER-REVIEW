#!/usr/bin/env node
// Generates one offline-safe SVG badge per beer in beers[].
// Deterministic: re-running produces zero git diff.
// Run: node scripts/build-logos.mjs

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const LOGOS_DIR = join(ROOT, 'logos');
const SCRIPT_JS = join(ROOT, 'script.js');

const sC = {
  "Lager":"#00f5ff","Pilsner":"#bb5580","Wheat Beer":"#cc3366","Belgian Ale":"#bb44ff",
  "IPA":"#ffae00","Pale Ale":"#39ff14","Stout":"#9966ff","Brown Ale":"#8b4513","Red Ale":"#ff4400"
};
const BADGE_BG = {
  AT:"#c8102e", AU:"#0b3d91", BE:"#000000", BR:"#009739", CA:"#d52b1e",
  CN:"#de2910", CZ:"#11457e", DE:"#000000", DK:"#c8102e", ES:"#aa151b",
  FR:"#0055a4", GB:"#1d3a8a", GR:"#0d5eaf", IE:"#169b62", IT:"#008c45",
  JM:"#009b3a", JP:"#bc002d", MX:"#006847", NL:"#ff6600", NO:"#ba0c2f",
  PL:"#dc143c", PT:"#046a38", SE:"#005ba6", SG:"#ed2939", TH:"#a51931",
  US:"#0a3161", ZA:"#007749",
};

const STOPWORDS = new Set([
  'the','de','du','la','le','el','di','of','and',
  'extra','pale','lager','stout','ale','light','ultra','summer','golden'
]);

function slugify(name){
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/ß/g,'ss').replace(/[Øø]/g,'o').replace(/[Ææ]/g,'ae')
    .replace(/[Œœ]/g,'oe').replace(/[Đđ]/g,'d').replace(/[Łł]/g,'l').replace(/[Þþ]/g,'th')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .replace(/-s$/,'');
}

function initials(name){
  const folded = name
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/ß/g,'ss').replace(/[Øø]/g,'o').replace(/[Ææ]/g,'ae')
    .replace(/[Œœ]/g,'oe').replace(/[Đđ]/g,'d').replace(/[Łł]/g,'l').replace(/[Þþ]/g,'th')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
  const tokens = folded.split(/\s+/).filter(t => t && !/^\d+$/.test(t) && !STOPWORDS.has(t));
  let picked;
  if(tokens.length === 0){
    picked = folded.split(/\s+/)[0]?.[0] || 'x';
  } else {
    picked = tokens.slice(0,3).map(t => t[0]).join('');
  }
  return picked.toUpperCase();
}

function fontSizeFor(initStr){
  return initStr.length === 1 ? 56 : initStr.length === 2 ? 44 : 32;
}

function buildSVG({ name, initials, bg, ring }){
  const fontSize = fontSizeFor(initials);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${name.replace(/"/g,'&quot;')}">
  <title>${name.replace(/</g,'&lt;')}</title>
  <circle cx="50" cy="50" r="46" fill="${bg}" stroke="${ring}" stroke-width="6"/>
  <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
        font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-weight="800" font-size="${fontSize}" fill="#ffffff"
        paint-order="stroke" stroke="rgba(0,0,0,0.35)" stroke-width="1.5">${initials}</text>
</svg>
`;
}

function parseBeers(src){
  // Extract the beers[] array literal block, then pull each entry line.
  const start = src.indexOf('let beers=[');
  if(start < 0) throw new Error('beers[] not found in script.js');
  // Find the matching closing bracket of the array literal.
  let i = src.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for(; i < src.length; i++){
    const c = src[i];
    if(c === '[') depth++;
    else if(c === ']'){ depth--; if(depth === 0){ end = i; break; } }
  }
  if(end < 0) throw new Error('unterminated beers[] literal');
  const block = src.slice(start, end+1);

  const entries = [];
  // Match key:"value" or key:value pairs within each {…} entry on its own line(s).
  const entryRegex = /\{([^{}]*?)\}/g;
  let m;
  while((m = entryRegex.exec(block))){
    const body = m[1];
    const beerMatch = body.match(/beer\s*:\s*"([^"]+)"/);
    const styleMatch = body.match(/style\s*:\s*"([^"]+)"/);
    const originMatch = body.match(/origin\s*:\s*"([^"]+)"/);
    if(!beerMatch || !styleMatch || !originMatch) continue;
    entries.push({ beer: beerMatch[1], style: styleMatch[1], origin: originMatch[1] });
  }
  return entries;
}

function main(){
  const src = readFileSync(SCRIPT_JS, 'utf8');
  const entries = parseBeers(src);

  const styleErrors = [];
  const originErrors = [];
  for(const e of entries){
    if(!sC[e.style]) styleErrors.push(`${e.beer} (style="${e.style}")`);
    if(!BADGE_BG[e.origin]) originErrors.push(`${e.beer} (origin="${e.origin}")`);
  }
  if(styleErrors.length || originErrors.length){
    if(styleErrors.length) console.error(`Unknown style for ${styleErrors.length} beer(s):\n  - ${styleErrors.join('\n  - ')}`);
    if(originErrors.length) console.error(`Unknown origin for ${originErrors.length} beer(s):\n  - ${originErrors.join('\n  - ')}`);
    process.exit(1);
  }

  // Dedup by beer name. Multiple entries with the same name share one SVG.
  const bySlug = new Map();
  for(const e of entries){
    const slug = slugify(e.beer);
    if(!bySlug.has(slug)){
      bySlug.set(slug, { name: e.beer, initials: initials(e.beer), bg: BADGE_BG[e.origin], ring: sC[e.style] });
    }
  }

  if(!existsSync(LOGOS_DIR)) mkdirSync(LOGOS_DIR, { recursive: true });

  let written = 0;
  for(const [slug, data] of bySlug){
    const out = join(LOGOS_DIR, `${slug}.svg`);
    const svg = buildSVG(data);
    const prev = existsSync(out) ? readFileSync(out, 'utf8') : null;
    if(prev !== svg){
      writeFileSync(out, svg);
    }
    written++;
  }

  // Report (but do not auto-delete) any stale SVGs that aren't referenced.
  const expectedFiles = new Set([...bySlug.keys()].map(s => `${s}.svg`));
  const stale = readdirSync(LOGOS_DIR).filter(f => f.endsWith('.svg') && !expectedFiles.has(f));
  if(stale.length){
    console.warn(`note: ${stale.length} stale SVG(s) in logos/ not referenced by any beer:\n  - ${stale.join('\n  - ')}`);
  }

  console.log(`wrote ${written} SVGs`);
}

main();
