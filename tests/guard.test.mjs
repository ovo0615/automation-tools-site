import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanText } from '../lib/guard.mjs';

const POLICY = {
  internalTerms: ['example_internal_module', 'example-codename'],
  extraTerms: ['Example Board Co', '範例電子'],
  approvedImages: ['https://raw.githubusercontent.com/o/r/abc/graph/gui-01.png'],
};
const rules = (text, kind = 'markdown') => scanText(text, { file: 'x', kind }, POLICY).map((v) => v.rule);

test('clean bilingual copy passes', () => {
  assert.deepEqual(rules('# PCB SI\n\n繁體中文段落，含 [連結](https://example.com/)。\n'), []);
});

test('dashboard card numbers are blocked but CSS hex colours are not', () => {
  assert.deepEqual(rules('已於 #0205 修正'), ['card-number']);
  assert.deepEqual(rules('branch card/0116-fix'), ['card-number']);
  assert.deepEqual(rules('color: #0b0f14; border: #0000ff', 'html'), []);
});

test('drive, UNC and Git Bash paths are blocked', () => {
  assert.deepEqual(rules('見 D:\\AI Development\\x'), ['disk-path']);
  assert.deepEqual(rules('見 c:/Users/x'), ['disk-path']);
  assert.deepEqual(rules('見 \\\\nas01\\share'), ['disk-path']);
  assert.deepEqual(rules('cd /d/AI Development'), ['disk-path']);
  assert.deepEqual(rules('see https://github.com/o/r'), []);
});

test('the word private (and 私有) is blocked, case-insensitively', () => {
  assert.deepEqual(rules('the Private repo'), ['private']);
  assert.deepEqual(rules('私有版'), ['private']);
});

test('internal code names and caller-supplied restricted names are blocked', () => {
  assert.deepEqual(rules('uses example_internal_module'), ['internal-term']);
  assert.deepEqual(rules('for example board co only'), ['restricted-term']);
});

test('control characters other than newline, tab and CRLF are blocked', () => {
  assert.deepEqual(rules('ok\r\nline\ttab'), []);
  assert.deepEqual(rules('scripts\build'), ['control-char']);
});

test('relative Markdown links are blocked; absolute, mailto, anchor and site-root links pass', () => {
  assert.deepEqual(rules('[a](docs/manual/02.md)'), ['relative-link']);
  assert.deepEqual(rules('[a](../about/)'), ['relative-link']);
  assert.deepEqual(rules('[a](https://x.y/) [b](mailto:a@b.c) [c](#top) [d](/trial/)'), []);
});

test('relative href in built HTML is blocked', () => {
  assert.deepEqual(rules('<a href="docs/x.md">x</a>', 'html'), ['relative-link']);
  assert.deepEqual(rules('<a href="/automation-tools-site/trial/">x</a>', 'html'), []);
});

test('only approved images may appear, in Markdown or HTML', () => {
  assert.deepEqual(rules('![g](https://raw.githubusercontent.com/o/r/abc/graph/gui-01.png)'), []);
  assert.deepEqual(rules('![g](https://raw.githubusercontent.com/o/r/abc/graph/LOGO.png)'), ['image-not-approved']);
  assert.deepEqual(rules('<img src="https://raw.githubusercontent.com/o/r/abc/graph/gui-01.png" alt="">', 'html'), []);
  assert.deepEqual(rules('<img alt="" src="/x/logo.png">', 'html'), ['image-not-approved']);
});

test('violations report the line number and the offending text', () => {
  const [v] = scanText('ok\n已於 #0205 修正', { file: 'a.md', kind: 'markdown' }, POLICY);
  assert.equal(v.file, 'a.md');
  assert.equal(v.line, 2);
  assert.equal(v.match, '#0205');
});

test('plain text files get term and control-character checks but no link or image checks', () => {
  assert.deepEqual(rules('{"href": "docs/x.md", "img": "![a](b.png)"}', 'text'), []);
  assert.deepEqual(rules('{"note": "see #0205"}', 'text'), ['card-number']);
});

test('ASCII restricted names match whole words only; CJK names match anywhere', () => {
  const policy = { extraTerms: ['ZYXQ', '範例電子'] };
  const r = (t) => scanText(t, { file: 'x', kind: 'text' }, policy).map((v) => v.rule);
  assert.deepEqual(r('for ZYXQ only'), ['restricted-term']);
  assert.deepEqual(r('ZYXQX and xZYXQ'), []);
  assert.deepEqual(r('客戶範例電子的板子'), ['restricted-term']);
});

test('HTML numeric entities such as &#0160; are not mistaken for card numbers', () => {
  assert.deepEqual(rules('a&#0160;b', 'html'), []);
});

test('card numbers beyond #0999 are caught; 4-digit CSS colours ending in ";" are not', () => {
  assert.deepEqual(rules('見 #1234 交接'), ['card-number']);
  assert.deepEqual(rules('color:#0123;', 'html'), []);
});

test('negative controls: "privacy" is not "private"; a site path like (/s/x) is not a drive mount', () => {
  assert.deepEqual(rules('privacy notice'), []);
  assert.deepEqual(rules('[a](/s/x)'), []);
});

test('restricted names hidden by percent-encoding in a URL are still caught', () => {
  assert.deepEqual(rules('[r](https://x.y/%E7%AF%84%E4%BE%8B%E9%9B%BB%E5%AD%90.md)'), ['restricted-term']);
});

test('tel: links pass; protocol-relative //host links are blocked in HTML', () => {
  assert.deepEqual(rules('<a href="tel:+886">x</a>', 'html'), []);
  assert.deepEqual(rules('<a href="//evil.example/">x</a>', 'html'), ['relative-link']);
});

test('C1 control characters and DEL are blocked', () => {
  assert.deepEqual(rules('a\u007fb'), ['control-char']);
  assert.deepEqual(rules('a\u0085b'), ['control-char']);
});

test('vendor bundles are checked for restricted names only, not for code-like patterns', () => {
  assert.deepEqual(rules('class X{#private=1};a="\\S\\\\";c="\u0001";color:#0000', 'vendor'), []);
  assert.deepEqual(rules('var n="Example Board Co"', 'vendor'), ['restricted-term']);
});
