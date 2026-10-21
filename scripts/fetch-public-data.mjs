// Build-time fetch: read CHANGELOG.md and Releases from each tool's PUBLIC GitHub repo only.
// Output: src/generated/tools-data.json (git-ignored). Any failure stops the build; stale data is never published.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { extractReleasedSections } from '../lib/changelog.mjs';
import { absolutizeLinks } from '../lib/links.mjs';
import { pickDownload } from '../lib/release.mjs';
import { assertPublicSource, assertRepoName } from '../lib/source.mjs';

const API = 'https://api.github.com';
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'automation-tools-site-build' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function gh(path, { allow404 = false, raw = false } = {}) {
  const res = await fetch(`${API}${path}`, { headers: raw ? { ...headers, Accept: 'application/vnd.github.raw+json' } : headers });
  if (allow404 && res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${path}: HTTP ${res.status}`);
  return raw ? res.text() : res.json();
}

async function loadTool(tool) {
  assertRepoName(tool);
  const meta = await gh(`/repos/${tool.repo}`);
  assertPublicSource(tool, meta);
  const [owner, repo] = tool.repo.split('/');
  const branch = meta.default_branch;
  const sha = (await gh(`/repos/${tool.repo}/commits/${branch}`)).sha;

  const changelog = await gh(`/repos/${tool.repo}/contents/CHANGELOG.md?ref=${sha}`, { allow404: true, raw: true });
  const releases = ((await gh(`/repos/${tool.repo}/releases?per_page=30`)) ?? []).filter((r) => !r.draft);
  const byTag = new Map(releases.map((r) => [r.tag_name, r]));
  const latest = releases.find((r) => !r.prerelease) ?? null;

  const sections = changelog
    ? extractReleasedSections(changelog).map((s) => ({
        ...s,
        body: absolutizeLinks(s.body, { owner, repo, ref: byTag.has(s.version) ? s.version : sha }),
        releaseUrl: byTag.get(s.version)?.html_url ?? null,
      }))
    : [];

  return {
    slug: tool.slug,
    repoUrl: meta.html_url,
    commit: sha,
    sections,
    download: pickDownload(latest),
  };
}

const tools = JSON.parse(await readFile(new URL('../src/data/tools.json', import.meta.url), 'utf8'));
const data = { fetchedAt: new Date().toISOString(), tools: {} };
for (const tool of tools.filter((t) => t.repo)) {
  data.tools[tool.slug] = await loadTool(tool);
  console.log(`[fetch] ${tool.slug}: ${data.tools[tool.slug].sections.length} released section(s), download=${data.tools[tool.slug].download.kind}`);
}
const outDir = new URL('../src/generated/', import.meta.url);
await mkdir(outDir, { recursive: true });
await writeFile(new URL('tools-data.json', outDir), JSON.stringify(data, null, 2) + '\n', 'utf8');
