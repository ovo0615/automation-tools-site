import { test } from 'node:test';
import assert from 'node:assert/strict';
import { absolutizeLinks } from '../lib/links.mjs';

const BASE = { owner: 'ovo0615', repo: 'pcb-si-3d-simulation-toolkit', ref: 'v1.0.0' };

test('repo-relative links become GitHub blob URLs pinned to the ref, anchors kept', () => {
  const out = absolutizeLinks('[06](docs/manual/06-IBIS與眼圖.md#眼圖精靈五步)', BASE);
  assert.equal(
    out,
    '[06](https://github.com/ovo0615/pcb-si-3d-simulation-toolkit/blob/v1.0.0/docs/manual/06-IBIS%E8%88%87%E7%9C%BC%E5%9C%96.md#眼圖精靈五步)',
  );
});

test('"./" and leading-slash links are resolved against the repo root too', () => {
  assert.equal(
    absolutizeLinks('[a](./validation/README.md) [b](/CHANGELOG.md)', BASE),
    '[a](https://github.com/ovo0615/pcb-si-3d-simulation-toolkit/blob/v1.0.0/validation/README.md) ' +
      '[b](https://github.com/ovo0615/pcb-si-3d-simulation-toolkit/blob/v1.0.0/CHANGELOG.md)',
  );
});

test('absolute, mailto and pure-anchor links are left alone', () => {
  const src = '[x](https://www.cadmen.com/) [m](mailto:a@b.c) [h](#top)';
  assert.equal(absolutizeLinks(src, BASE), src);
});

test('relative image links point at raw content so they still render', () => {
  assert.equal(
    absolutizeLinks('![g](graph/gui-01-task-picker.png)', BASE),
    '![g](https://raw.githubusercontent.com/ovo0615/pcb-si-3d-simulation-toolkit/v1.0.0/graph/gui-01-task-picker.png)',
  );
});
