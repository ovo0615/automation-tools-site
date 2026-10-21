import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../scripts/guard.mjs', import.meta.url));

function runOn(files, stage, env = {}) {
  const root = mkdtempSync(join(tmpdir(), 'site-guard-'));
  try {
    mkdirSync(join(root, 'guard'));
    writeFileSync(join(root, 'guard', 'policy.json'), JSON.stringify({ internalTerms: ['example_internal_module'], approvedImages: [] }));
    for (const [rel, text] of Object.entries(files)) {
      mkdirSync(join(root, rel, '..'), { recursive: true });
      writeFileSync(join(root, rel), text);
    }
    return spawnSync(process.execPath, [CLI, '--stage', stage, '--root', root], {
      encoding: 'utf8',
      env: { ...process.env, CI: "", SITE_GUARD_ALLOW_NO_TERMS: "1", SITE_GUARD_TERMS: '', SITE_GUARD_TERMS_FILE: '', ...env },
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('source stage passes clean content and fails on a card number in a page', () => {
  assert.equal(runOn({ 'src/content/docs/a.md': '# ok\n' }, 'source').status, 0);
  const bad = runOn({ 'src/content/docs/a.md': '# ok\n修正 #0205\n' }, 'source');
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /card-number/);
  assert.match(bad.stderr, /a\.md:2/);
});

test('source stage also scans generated changelog data', () => {
  const bad = runOn({ 'src/generated/tools-data.json': '{"body": "[x](docs/manual/02.md)"}' }, 'source');
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /relative-link/);
});

test('dist stage fails on an unapproved image in built HTML', () => {
  const bad = runOn({ 'dist/index.html': '<img src="https://example.com/logo.png">' }, 'dist');
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /image-not-approved/);
});

test('restricted names (customers, internal code names) supplied through the environment are enforced but never printed in full', () => {
  const bad = runOn({ 'src/content/docs/a.md': 'Made for Example Board Co.\n' }, 'source', { SITE_GUARD_TERMS: 'Example Board Co' });
  assert.equal(bad.status, 1);
  assert.match(bad.stderr, /restricted-term/);
  assert.ok(!bad.stderr.includes('Example Board Co'));
});

test('in CI, a missing restricted-term list fails the build instead of silently passing', () => {
  const res = runOn({ 'src/content/docs/a.md': '# ok\n' }, 'source', { CI: 'true', SITE_GUARD_ALLOW_NO_TERMS: '1' });
  assert.equal(res.status, 1);
  assert.match(res.stderr, /restricted-term list/);
});

test('outside CI, a missing restricted-term list also fails unless explicitly allowed', () => {
  const res = runOn({ 'src/content/docs/a.md': '# ok\n' }, 'source', { SITE_GUARD_ALLOW_NO_TERMS: '' });
  assert.equal(res.status, 1);
  assert.match(res.stderr, /restricted-term list/);
});

test('a comma-separated restricted-term list is split into separate names', () => {
  const bad = runOn({ 'src/content/docs/a.md': 'Made for Example Board Co.\n' }, 'source', {
    SITE_GUARD_TERMS: 'Other Corp,Example Board Co',
  });
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /restricted-terms=2/);
});
