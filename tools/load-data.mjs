// Loads data.js the way the browser does — by executing it — so the checks run
// against the same values the site renders, not against a parse of the source.
//
// data.js is plain browser JavaScript with no imports and no exports, which is
// exactly what makes it loadable here: it declares top-level bindings and does
// nothing else. Running it in a fresh vm context with no globals also proves
// that: anything reaching for `window`, `fetch` or `document` throws instead of
// quietly working.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Top-level `const`/`let` are lexical — they never become properties of the vm
// context — so the script ends with an expression that collects them, and the
// script's completion value hands them back.
const EXPORTS = [
  'FLAGS', 'CNAMES', 'beers', 'drunkLocs', 'breweries', 'BRAND_DOMAINS',
  'UNTAPPD_GLOBAL_AVGS', 'UNTAPPD_LAST_REFRESHED', 'UNTAPPD_REFRESH_INTERVAL_DAYS',
  'WANT_TO_TRY',
];

export function loadData(root = ROOT) {
  const src = readFileSync(join(root, 'data.js'), 'utf8');
  const collect = `\n;({${EXPORTS.join(',')}});\n`;
  return vm.runInNewContext(src + collect, Object.create(null), { filename: 'data.js' });
}

// app.js is the app, not data — it can't be executed outside a browser. A
// couple of things in it are data contracts all the same: the style → colour
// map every style has to appear in, and the name normaliser that decides when
// a shortlist entry and a review are the same beer. Lift those declarations
// out and evaluate them alone, so the checks use the app's own definition
// rather than a copy that can drift away from it.
export function loadStyleColors(root = ROOT) {
  const src = readFileSync(join(root, 'app.js'), 'utf8');
  const m = src.match(/^const sC=\{.*?\};$/ms);
  if (!m) throw new Error('could not find the `const sC={…};` style-colour map in app.js');
  return vm.runInNewContext(`${m[0]}\n;sC;`, Object.create(null), { filename: 'app.js' });
}

// One-line top-level `const <name>=…;` declarations only — enough for the
// small, self-contained helpers the data checks need.
export function loadAppConst(name, root = ROOT) {
  const src = readFileSync(join(root, 'app.js'), 'utf8');
  const m = src.match(new RegExp(`^const ${name}=.*;$`, 'm'));
  if (!m) throw new Error(`could not find the \`const ${name}=…;\` declaration in app.js`);
  return vm.runInNewContext(`${m[0]}\n;${name};`, Object.create(null), { filename: 'app.js' });
}
