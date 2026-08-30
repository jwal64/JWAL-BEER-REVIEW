#!/usr/bin/env node
// Recomputes the `integrity` hashes on the CDN tags in index.html.
//
// The hash is never taken from the CDN — that would only prove the CDN agrees
// with itself. Each library is downloaded from the npm registry, checked
// against the integrity npm publishes for that exact version, and only then
// hashed. jsDelivr serves those same files byte-for-byte from /npm/, so the
// hash computed here is the one the browser will verify against.
//
//   node tools/sri.mjs           report any tag whose hash is wrong
//   node tools/sri.mjs --write   fix them in place
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from './load-data.mjs';

const WRITE = process.argv.includes('--write');
const HTML = join(ROOT, 'index.html');
const html = readFileSync(HTML, 'utf8');

// <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js" … integrity="sha384-…">
const TAG = /(https:\/\/cdn\.jsdelivr\.net\/npm\/([^@"]+)@([^/"]+)\/([^"]+))"[\s\S]{0,200}?integrity="(sha384-[^"]+)"/g;

const b64 = (algo, buf) => `${algo}-${createHash(algo).update(buf).digest('base64')}`;

async function fileFromNpm(pkg, version, path) {
  const meta = await (await fetch(`https://registry.npmjs.org/${pkg}/${version}`)).json();
  if (!meta?.dist?.tarball) throw new Error(`npm has no ${pkg}@${version}`);
  const tarball = Buffer.from(await (await fetch(meta.dist.tarball)).arrayBuffer());
  const [algo] = meta.dist.integrity.split('-');
  const got = b64(algo, tarball);
  if (got !== meta.dist.integrity)
    throw new Error(`${pkg}@${version} tarball does not match the integrity npm published`);
  const dir = mkdtempSync(join(tmpdir(), 'sri-'));
  try {
    execFileSync('tar', ['-xzf', '-', '-C', dir], { input: tarball });
    return readFileSync(join(dir, 'package', path));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

let out = html, wrong = 0, checked = 0;
for (const [, url, pkg, version, path, current] of html.matchAll(TAG)) {
  const want = b64('sha384', await fileFromNpm(pkg, version, path));
  checked++;
  if (want === current) { console.log(`  ok   ${pkg}@${version}/${path}`); continue; }
  wrong++;
  console.log(`  BAD  ${pkg}@${version}/${path}\n       have ${current}\n       want ${want}`);
  out = out.replace(current, want);
}

if (!checked) { console.error('No hash-locked jsDelivr tags found in index.html.'); process.exit(1); }
if (!wrong) { console.log(`\n${checked} tag(s) verified against npm.\n`); process.exit(0); }
if (WRITE) { writeFileSync(HTML, out); console.log(`\nUpdated ${wrong} hash(es) in index.html.\n`); process.exit(0); }
console.error(`\n${wrong} of ${checked} hash(es) are wrong. Re-run with --write to fix.\n`);
process.exit(1);
