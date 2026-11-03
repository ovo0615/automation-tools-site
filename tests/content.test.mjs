// 內容一致性：影片卡、操作說明截圖、施工中字樣（#0284 恢復 TDR 與功能總覽後加入）。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const json = (p) => JSON.parse(read(p));
const videos = json('src/data/videos.json');
const policy = json('guard/policy.json');
const manualImages = json('src/data/manual-images.json');
const manual = read('src/content/docs/tools/pcb-si/manual.mdx');
const base = '/automation-tools-site';

test('every video has a thumbnail file listed in the image policy', () => {
  for (const v of videos) {
    const path = `public/video-thumbs/${v.youtubeId}.webp`;
    assert.ok(existsSync(new URL(path, root)), `missing ${path}`);
    assert.ok(policy.approvedImages.includes(`${base}/video-thumbs/${v.youtubeId}.webp`), `policy lacks ${v.youtubeId}`);
  }
});

test('no video is still marked under construction', () => {
  assert.deepEqual(videos.filter((v) => v.construction).map((v) => v.label), []);
});

test('tool-guide list carries the overview, TDR and eye-diagram videos', () => {
  const guide = (ep) => videos.find((v) => v.tool === 'pcb-si' && v.series === 'tool-guide' && v.episode === ep);
  assert.equal(guide(0)?.youtubeId, '1V3cFN6bOoE');
  assert.equal(guide(23)?.youtubeId, 'GtbciwpU_KQ');
  assert.equal(guide(24)?.youtubeId, 'xgZeK0-bo_4');
  assert.equal(guide(24)?.titleZh, 'IBIS 眼圖與自訂眼罩');
});

test('pages and components no longer say under construction', () => {
  for (const p of [
    'src/content/docs/index.mdx',
    'src/content/docs/tools/pcb-si/index.mdx',
    'src/content/docs/tools/pcb-si/manual.mdx',
    'src/content/docs/tools/pcb-si/videos.mdx',
    'src/components/FeatureTable.astro',
    'src/components/TaskLinks.astro',
  ]) {
    if (!existsSync(new URL(p, root))) continue;
    assert.doesNotMatch(read(p), /施工中|under construction/i, p);
  }
});

test('manual screenshots exist, have dimensions and are approved', () => {
  for (const [, file] of manual.matchAll(/<ManualShot file="([^"]+)"/g)) {
    assert.ok(manualImages[file], `manual-images.json lacks ${file}`);
    assert.ok(existsSync(new URL(`public/manual/pcb-si/${file}`, root)), `missing image ${file}`);
    assert.ok(policy.approvedImages.includes(`${base}/manual/pcb-si/${file}`), `policy lacks ${file}`);
  }
});

test('TDR section uses v1.1.1 results and links its video', () => {
  const s = manual.split('## 11. TDR')[1]?.split('\n## ')[0] ?? '';
  assert.match(s, /<ManualShot file="v111-e23-tdr-result\.webp"/);
  assert.match(s, /<VideoLink ep="EP23" \/>/);
  assert.match(s, /187\.8 mm/);
  // v1.0.4 讀值、B 法與介電常數欄已在 v1.1.0 移除（#0269／EP23 v04 禁用清單）。
  assert.doesNotMatch(s, /70\.27|75\.32|B 法|method B|介電常數|dielectric constant/i);
});
