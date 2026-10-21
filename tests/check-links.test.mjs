import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../scripts/check-links.mjs', import.meta.url));

function runOn(files) {
  const dist = mkdtempSync(join(tmpdir(), 'site-links-'));
  try {
    for (const [rel, text] of Object.entries(files)) {
      mkdirSync(join(dist, rel, '..'), { recursive: true });
      writeFileSync(join(dist, rel), text);
    }
    return spawnSync(process.execPath, [CLI, '--dist', dist], {
      encoding: 'utf8',
      env: { ...process.env, SITE_BASE: '/s', SITE_URL: 'https://o.github.io' },
    });
  } finally {
    rmSync(dist, { recursive: true, force: true });
  }
}

test('internal links that resolve to built pages pass, including the canonical self URL and /404/', () => {
  const res = runOn({
    'index.html': '<a href="/s/trial/">t</a><link rel="canonical" href="https://o.github.io/s/"><a href="/s/404/">x</a>',
    'trial/index.html': '<p>ok</p>',
    '404.html': '<p>nf</p>',
  });
  assert.equal(res.status, 0, res.stderr);
});

test('a link to a page that was not built fails', () => {
  const res = runOn({ 'index.html': '<a href="/s/missing/">m</a>' });
  assert.equal(res.status, 1);
  assert.match(res.stderr, /\/s\/missing\//);
});

test('a site-root link without the deployment base fails', () => {
  const res = runOn({ 'index.html': '<a href="/trial/">t</a>', 'trial/index.html': '' });
  assert.equal(res.status, 1);
  assert.match(res.stderr, /missing base/);
});

test('a link that climbs out of the build folder fails even if the file exists outside', () => {
  const res = runOn({ 'index.html': '<a href="/s/../../etc/">x</a>' });
  assert.equal(res.status, 1);
});
