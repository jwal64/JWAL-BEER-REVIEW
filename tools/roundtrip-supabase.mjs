#!/usr/bin/env node
// Proves the two halves of the Supabase bridge agree, without a network.
//
// data.js → rows (tools/supabase-rows.mjs, the seed) → data.js
//
// If the projection loses a field, coerces a number to a string, or reorders
// the reviews, the values coming back differ from the values that went in and
// this fails. That matters because the round trip is not hypothetical: the
// rows in the middle are exactly what the cutover migration seeded, so a loss
// here is a loss of real data at the moment the database took over.
//
// It compares values, not text. The generated file is formatted by
// tools/render-data-js.mjs and is not meant to be byte-identical to a file
// that was maintained by hand.
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadData } from './load-data.mjs';
import { toRows, fromRows } from './supabase-rows.mjs';
import { renderDataJs } from './render-data-js.mjs';

const before = loadData();
const rows = toRows(before);

// Re-read through the generated file rather than comparing fromRows() straight
// across, so what is checked is what the browser would actually load.
const dir = mkdtempSync(join(tmpdir(), 'beer-roundtrip-'));
writeFileSync(join(dir, 'data.js'), renderDataJs(fromRows(rows)));
const after = loadData(dir);

const problems = [];

// Compared by value, so two things that differ only in the order their keys
// were written are the same thing. `nativeName` moving within a brewery
// literal is a formatting difference; a changed coordinate is not.
const canon = v => Array.isArray(v)
  ? v.map(canon)
  : (v && typeof v === 'object'
      ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canon(v[k])]))
      : v);
const show = v => JSON.stringify(canon(v));

function compare(where, a, b) {
  if (show(a) === show(b)) return;
  problems.push(`${where}\n    was: ${show(a)}\n    now: ${show(b)}`);
}

// A brewery lists the beers it makes and what each scored. The two arrays are
// read as a pair, so what has to survive is the pairing — which beer scored
// what — and not the order the pairs happen to be listed in. The order is
// chosen by the renderer (oldest review first) and is allowed to differ from
// the order a hand-maintained file used.
function pairs(br) {
  const listed = String(br.beers || '').split('·').map(s => s.trim()).filter(Boolean);
  return listed.map((n, i) => [n, br.ratings?.[i]]).sort((x, y) => x[0].localeCompare(y[0]));
}

function compareBrewery(where, a, b) {
  compare(`${where} beer/rating pairing`, pairs(a), pairs(b));
  const rest = ({ beers, ratings, ...r }) => r;
  compare(where, rest(a), rest(b));
}

// The reviews, in order, field by field.
compare('beers.length', before.beers.length, after.beers.length);
before.beers.forEach((b, i) => compare(`beers[${i}] ${b.beer}`, b, after.beers[i]));

// Everything else, keyed by name so a reordering is not reported as a change —
// only a changed value is.
const byKey = (list, key) => new Map(list.map(x => [x[key], x]));
for (const [name, key, cmp] of [['breweries', 'name', compareBrewery], ['drunkLocs', 'city', compare]]) {
  const a = byKey(before[name], key), b = byKey(after[name], key);
  compare(`${name}: which ${key}s exist`, [...a.keys()].sort(), [...b.keys()].sort());
  for (const [k, v] of a) if (b.has(k)) cmp(`${name}["${k}"]`, v, b.get(k));
}

for (const name of ['FLAGS', 'CNAMES', 'BRAND_DOMAINS', 'UNTAPPD_GLOBAL_AVGS']) {
  const a = before[name], b = after[name];
  compare(`${name}: which keys exist`, Object.keys(a).sort(), Object.keys(b).sort());
  for (const k of Object.keys(a)) compare(`${name}["${k}"]`, a[k], b[k]);
}

compare('WANT_TO_TRY', before.WANT_TO_TRY, after.WANT_TO_TRY);
compare('UNTAPPD_LAST_REFRESHED', before.UNTAPPD_LAST_REFRESHED, after.UNTAPPD_LAST_REFRESHED);
compare('UNTAPPD_REFRESH_INTERVAL_DAYS',
  before.UNTAPPD_REFRESH_INTERVAL_DAYS, after.UNTAPPD_REFRESH_INTERVAL_DAYS);

if (problems.length) {
  console.error(`\n${problems.length} value(s) did not survive the round trip:\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error('');
  process.exit(1);
}

const counts = Object.entries(rows).map(([t, r]) => `${r.length} ${t}`).join(' · ');
console.log(`\nRound trip clean — ${counts}.\n`);
