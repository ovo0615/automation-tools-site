// Post-build link check. Usage: node scripts/check-links.mjs [--external] [--dist DIR]
// Site-internal links must resolve to a built file inside dist; with --external, every http(s) link and image
// is also requested and must answer 2xx/3xx.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const distArg = args.indexOf('--dist');
const dist = resolve(distArg >= 0 ? args[distArg + 1] : fileURLToPath(new URL('../dist', import.meta.url)));
const base = (process.env.SITE_BASE ?? '/automation-tools-site').replace(/\/$/, '');
const external = args.includes('--external');
// Canonical/og URLs of this site itself are checked as internal paths, not fetched (the site may not be live yet).
const self = `${(process.env.SITE_URL ?? 'https://ovo0615.github.io').replace(/\/$/, '')}${base}/`;

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const pages = walk(dist).filter((f) => f.endsWith('.html'));

function builtFileFor(path) {
  const candidates = [join(dist, path, path.endsWith('/') ? 'index.html' : ''), join(dist, `${path.replace(/\/$/, '')}.html`)];
  // "/404/" is emitted as 404.html. Anything resolving outside dist does not count.
  return candidates.map((c) => resolve(c)).find((c) => (c === dist || c.startsWith(dist + sep)) && existsSync(c));
}

const bad = [];
const outside = new Map();
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (let [, target] of html.matchAll(/\s(?:href|src)="([^"#]+)[^"]*"/g)) {
    if (target.startsWith(self)) target = `${base}/${target.slice(self.length)}`;
    if (/^https?:\/\//.test(target)) {
      if (!outside.has(target)) outside.set(target, relative(dist, page));
      continue;
    }
    if (!target.startsWith('/') || target.startsWith('//')) continue;
    if (!target.startsWith(`${base}/`)) {
      bad.push(`${relative(dist, page)}: ${target} (missing base ${base})`);
      continue;
    }
    const path = decodeURIComponent(target.slice(base.length).split('?')[0]);
    if (!builtFileFor(path)) bad.push(`${relative(dist, page)}: ${target}`);
  }
}

if (external) {
  const get = (method, target) =>
    fetch(target, { method, redirect: 'follow', signal: AbortSignal.timeout(15000) }).catch((e) => ({ ok: false, status: e.name }));
  for (const [target, page] of outside) {
    // Some hosts reject HEAD; retry with GET before calling the link broken.
    let res = await get('HEAD', target);
    if (!res.ok) res = await get('GET', target);
    if (!res.ok) bad.push(`${page}: ${target} (HTTP ${res.status})`);
  }
}

for (const b of bad) console.error(`[links] broken  ${b}`);
console.log(`[links] pages=${pages.length} external=${external ? outside.size : 'skipped'} broken=${bad.length}`);
process.exit(bad.length ? 1 : 0);
