// The site may only read public GitHub repositories. Local folders and non-public twins are refused.

const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

// Name-only check, run before any network request.
export function assertRepoName(tool) {
  if (!REPO.test(tool.repo) || tool.repo.includes('..')) {
    throw new Error(`${tool.slug}: source must be a GitHub "owner/name", got "${tool.repo}"`);
  }
  if (/-private$/i.test(tool.repo)) {
    throw new Error(`${tool.slug}: "${tool.repo}" looks like the non-public twin; use the public showcase repo`);
  }
}

export function assertPublicSource(tool, repoMeta) {
  assertRepoName(tool);
  if (repoMeta?.private !== false || repoMeta?.visibility !== 'public') {
    throw new Error(`${tool.slug}: "${tool.repo}" is not public on GitHub`);
  }
}
