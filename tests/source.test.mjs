import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertPublicSource } from '../lib/source.mjs';

const tool = { slug: 'pcb-si', repo: 'ovo0615/pcb-si-3d-simulation-toolkit' };

test('a public GitHub repo is accepted', () => {
  assert.doesNotThrow(() => assertPublicSource(tool, { private: false, visibility: 'public' }));
});

test('a repo GitHub reports as non-public is refused', () => {
  assert.throws(() => assertPublicSource(tool, { private: true, visibility: 'private' }), /not public/);
  assert.throws(() => assertPublicSource(tool, { private: false, visibility: 'internal' }), /not public/);
});

test('a source that is not "owner/name" (e.g. a local folder) is refused before any request', () => {
  assert.throws(() => assertPublicSource({ slug: 'x', repo: 'D:/work/tool' }, null), /owner\/name/);
  assert.throws(() => assertPublicSource({ slug: 'x', repo: '../tool' }, null), /owner\/name/);
});

test('a repo named like a private twin is refused even if GitHub says public', () => {
  assert.throws(
    () => assertPublicSource({ slug: 'x', repo: 'ovo0615/tool-private' }, { private: false, visibility: 'public' }),
    /twin/,
  );
});
