import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickDownload } from '../lib/release.mjs';

test('a release without attached files offers the trial request, not a download', () => {
  const release = { tag_name: 'v1.0.0', html_url: 'https://github.com/o/r/releases/tag/v1.0.0', assets: [] };
  assert.deepEqual(pickDownload(release), { kind: 'trial', tag: 'v1.0.0' });
});

test('no release at all also offers the trial request', () => {
  assert.deepEqual(pickDownload(null), { kind: 'trial', tag: null });
});

test('a release with attached files offers each file; .sha256 files are paired, not listed', () => {
  const release = {
    tag_name: 'v1.1.0',
    html_url: 'https://github.com/o/r/releases/tag/v1.1.0',
    assets: [
      { name: 'Tool-v1.1.0.zip', browser_download_url: 'https://github.com/o/r/releases/download/v1.1.0/Tool-v1.1.0.zip', size: 2048 },
      { name: 'Tool-v1.1.0.zip.sha256', browser_download_url: 'https://github.com/o/r/releases/download/v1.1.0/Tool-v1.1.0.zip.sha256', size: 90 },
    ],
  };
  assert.deepEqual(pickDownload(release), {
    kind: 'download',
    tag: 'v1.1.0',
    releaseUrl: 'https://github.com/o/r/releases/tag/v1.1.0',
    files: [
      {
        name: 'Tool-v1.1.0.zip',
        url: 'https://github.com/o/r/releases/download/v1.1.0/Tool-v1.1.0.zip',
        size: 2048,
        sha256Url: 'https://github.com/o/r/releases/download/v1.1.0/Tool-v1.1.0.zip.sha256',
      },
    ],
  });
});
