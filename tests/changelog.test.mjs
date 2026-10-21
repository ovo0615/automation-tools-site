import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractReleasedSections } from '../lib/changelog.mjs';

const SAMPLE = [
  '# 版本更新說明',
  '',
  '## 未發布',
  '',
  '| 功能 | 說明 |',
  '|---|---|',
  '| 新功能 | 還沒發布 |',
  '',
  '## v1.1.0（2026-11-01）：第二版',
  '',
  '- 修正 A',
  '',
  '### 已知限制',
  '',
  '- 限制 B',
  '',
  '## v1.0.0（2026-10-11）：第一版',
  '',
  '- 初版',
  '',
].join('\n');

test('only "## v" sections are kept; the unreleased section is dropped', () => {
  const sections = extractReleasedSections(SAMPLE);
  assert.deepEqual(sections.map((s) => s.version), ['v1.1.0', 'v1.0.0']);
  const all = sections.map((s) => s.body).join('\n');
  assert.ok(!all.includes('還沒發布'));
});

test('a section carries its date, title and sub-headings until the next "## "', () => {
  const [latest] = extractReleasedSections(SAMPLE);
  assert.equal(latest.date, '2026-11-01');
  assert.equal(latest.heading, 'v1.1.0（2026-11-01）：第二版');
  assert.match(latest.body, /### 已知限制/);
  assert.match(latest.body, /限制 B/);
  assert.ok(!latest.body.includes('初版'));
});

test('a changelog with no released section yields an empty list', () => {
  assert.deepEqual(extractReleasedSections('# x\n\n## 未發布\n\n- a\n'), []);
});

test('two-part and pre-release versions are released sections too', () => {
  const md = '## v2.1（2027-01-05）\n\n- a\n\n## v2.0.0-rc.1\n\n- b\n';
  assert.deepEqual(extractReleasedSections(md).map((s) => s.version), ['v2.1', 'v2.0.0-rc.1']);
});
