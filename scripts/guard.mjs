// Pre-build / post-build guard. Usage: node scripts/guard.mjs --stage source|dist [--root DIR]
// Customer names are never stored in this repo: pass them at build time through
// SITE_GUARD_TERMS (one per line) or SITE_GUARD_TERMS_FILE (a file outside the repo).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanText } from '../lib/guard.mjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const stage = opt('stage');
const root = resolve(opt('root', fileURLToPath(new URL('..', import.meta.url))));
if (!['source', 'dist'].includes(stage)) {
  console.error('usage: guard.mjs --stage source|dist [--root DIR]');
  process.exit(2);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}

function kindOf(file) {
  const ext = extname(file).toLowerCase();
  if (stage === 'dist') {
    if (ext === '.html') return 'html';
    if (['.xml', '.txt', '.svg'].includes(ext)) return 'text';
    return ['.js', '.css', '.json'].includes(ext) ? 'vendor' : null;
  }
  if (['.md', '.mdx'].includes(ext)) return 'markdown';
  if (relative(root, file).startsWith(join('src', 'generated'))) return ext === '.json' ? 'markdown' : null;
  if (['.astro', '.html'].includes(ext)) return 'html';
  if (['.json', '.ts', '.mjs', '.js', '.css', '.yml', '.yaml', '.svg', '.txt'].includes(ext)) return 'text';
  return null;
}

function extraTerms() {
  const raw = [process.env.SITE_GUARD_TERMS ?? ''];
  if (process.env.SITE_GUARD_TERMS_FILE) raw.push(readFileSync(process.env.SITE_GUARD_TERMS_FILE, 'utf8'));
  return [...new Set(raw.join('\n').split(/\r?\n|,/).map((s) => s.trim()).filter((s) => s.length >= 2))];
}

const policy = JSON.parse(readFileSync(join(root, 'guard', 'policy.json'), 'utf8'));
policy.extraTerms = extraTerms();

const dirs = stage === 'source' ? [join(root, 'src'), join(root, 'public')] : [join(root, 'dist')];
const files = dirs.flatMap(walk).filter((f) => kindOf(f));
const violations = files.flatMap((f) =>
  scanText(readFileSync(f, 'utf8'), { file: relative(root, f), kind: kindOf(f) }, policy),
);

const mask = (v) => (v.rule === 'restricted-term' ? `${v.match[0]}***(${v.match.length})` : v.match);
for (const v of violations) console.error(`[guard] ${v.rule}  ${v.file}:${v.line}  ${mask(v)}`);
console.log(
  `[guard] stage=${stage} files=${files.length} restricted-terms=${policy.extraTerms.length} violations=${violations.length}`,
);
if (!policy.extraTerms.length) {
  // Customer names and internal code names must always be enforced; a missing list is a failure, not a pass.
  // Local experiments may opt out explicitly with SITE_GUARD_ALLOW_NO_TERMS=1; CI never may.
  if (process.env.CI || !process.env.SITE_GUARD_ALLOW_NO_TERMS) {
    console.error('[guard] no restricted-term list supplied (SITE_GUARD_TERMS / SITE_GUARD_TERMS_FILE; CI: the SITE_GUARD_TERMS secret)');
    process.exit(1);
  }
  console.log('[guard] note: restricted-term list skipped (SITE_GUARD_ALLOW_NO_TERMS=1)');
}
process.exit(violations.length ? 1 : 0);
