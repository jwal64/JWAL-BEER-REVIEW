#!/usr/bin/env node
// Renders every file in logos/ onto one contact sheet, so the
// hundred logos can be *looked at* rather than trusted.
//
// Nothing else in the repo can tell a brand's mark from a photograph of a
// bottle, or from the grey globe a favicon service answers with for a domain
// it does not know. Both load, both are the right size, and both pass every
// check there is. A person looking at a sheet spots either in a second.
//
//     node tools/logo-sheet.mjs            # writes logo-sheet.png
//     node tools/logo-sheet.mjs --out x.png
//
// The tiles are half light, half dark: a white wordmark on a white tile is
// invisible, and so is a black one on black, and both are logos that will
// look broken on exactly one of the two surfaces this project renders.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './load-data.mjs';

const outArg = process.argv.indexOf('--out');
const OUT = outArg >= 0 ? process.argv[outArg + 1] : join(ROOT, 'logo-sheet.png');

const LOGO_DIR = join(ROOT, 'logos');
const MIME = { '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
               '.jpg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon' };

const files = readdirSync(LOGO_DIR).filter(f => MIME[f.slice(f.lastIndexOf('.'))]).sort();
const tiles = files.map(f => {
  const ext = f.slice(f.lastIndexOf('.'));
  return { name: f.slice(0, -ext.length),
           src: `data:${MIME[ext]};base64,${readFileSync(join(LOGO_DIR, f)).toString('base64')}` };
});

const COLS = 8;
const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#f4f4f5;font:12px/1.3 system-ui,sans-serif;color:#3f3f46}
  .grid{display:grid;grid-template-columns:repeat(${COLS},1fr);gap:10px;padding:12px}
  figure{margin:0;text-align:center}
  .swatch{display:flex;height:104px;border:1px solid #d4d4d8;border-radius:8px;overflow:hidden}
  .swatch>div{flex:1;display:flex;align-items:center;justify-content:center}
  .lt{background:#ffffff}.dk{background:#17171a}
  img{max-width:74px;max-height:74px;object-fit:contain}
  figcaption{margin-top:4px;word-break:break-word}
</style><div class="grid">${tiles.map(t => `
  <figure>
    <div class="swatch">
      <div class="lt"><img src="${t.src}" alt=""></div>
      <div class="dk"><img src="${t.src}" alt=""></div>
    </div>
    <figcaption>${t.name.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</figcaption>
  </figure>`).join('')}</div>`;

const { chromium } = await import('playwright');
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1240, height: 900 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.waitForTimeout(500);
writeFileSync(OUT, await page.screenshot({ fullPage: true }));
await browser.close();
console.log(`${tiles.length} logos → ${OUT}`);
