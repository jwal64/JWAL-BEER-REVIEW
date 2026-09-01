#!/usr/bin/env node
// Pulls the reviews out of the Supabase database behind beer-review-buddy and
// rewrites data.js from them. This is how a beer logged on a phone reaches the
// site: it is added in the app, and the next sync writes it here.
//
//   npm run sync                       # rewrite data.js from the database
//   npm run sync -- --check            # is data.js in step? (exit 1 if not)
//   npm run sync -- --fixture rows.json# from a file instead of the network
//
// Needs SUPABASE_URL and SUPABASE_KEY in the environment. The key is the
// publishable (anon) one: every table is world-readable behind RLS, and
// nothing here writes, so a read-only key is all it should ever be given.
//
// Zero dependencies, like everything else in tools/ — Node's own fetch.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './load-data.mjs';
import { TABLES, fromRows } from './supabase-rows.mjs';
import { renderDataJs } from './render-data-js.mjs';

const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const arg = f => { const i = argv.indexOf(f); return i === -1 ? null : argv[i + 1]; };

const OUT = join(ROOT, 'data.js');
const PAGE = 1000;

// A sync that fetches nothing looks exactly like a sync of an empty database,
// and would blank the file. It is never right to write a data.js with no
// reviews in it, so a suspiciously empty read is an error, not an update.
function assertPlausible(rows) {
  const empty = TABLES.filter(t => !rows[t]?.length);
  if (empty.length)
    throw new Error(
      `refusing to write data.js: ${empty.join(', ')} came back empty.\n` +
      'That is far more likely to be a failed read, a wrong key or an RLS ' +
      'policy change than a database that genuinely holds no beers.');
}

async function fetchTable(base, key, table) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const url = `${base}/rest/v1/${table}?select=*`;
    const res = await fetch(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Range: `${from}-${from + PAGE - 1}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok)
      throw new Error(`GET ${table} → ${res.status} ${res.statusText}: ${(await res.text()).slice(0, 300)}`);
    const page = await res.json();
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

async function readRows() {
  const fixture = arg('--fixture');
  if (fixture) return JSON.parse(readFileSync(fixture, 'utf8'));

  const base = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key)
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be set (or pass --fixture <file>).');

  const rows = {};
  for (const t of TABLES) rows[t] = await fetchTable(base, key, t);
  return rows;
}

// A failed sync is read in a CI log, where a stack trace through Node's fetch
// buries the one line that says what went wrong.
const die = msg => { console.error(`\n${msg}\n`); process.exit(1); };

let rows;
try {
  rows = await readRows();
  assertPlausible(rows);
} catch (e) {
  die(e instanceof Error ? e.message : String(e));
}

const next = renderDataJs(fromRows(rows));

const current = (() => { try { return readFileSync(OUT, 'utf8'); } catch { return null; } })();
const counts = `${rows.beers.length} reviews · ${rows.breweries.length} breweries · ` +
               `${rows.locations.length} locations · ${rows.brand_domains.length} brand domains`;

if (has('--check')) {
  if (current === next) {
    console.log(`data.js is in step with the database — ${counts}.`);
    process.exit(0);
  }
  console.error('data.js is out of step with the database. Run `npm run sync`.');
  process.exit(1);
}

if (current === next) {
  console.log(`data.js already matches the database — ${counts}. Nothing written.`);
} else {
  writeFileSync(OUT, next);
  console.log(`Rewrote data.js from the database — ${counts}.`);
  console.log('Now run `npm run check` and `npm run export`.');
}
