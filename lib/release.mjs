// Decide what the download area shows for a GitHub Release.
// A download button appears only when the release has attached files; otherwise the page points to the trial request.

export function pickDownload(release) {
  const files = (release?.assets ?? []).filter((a) => !a.name.endsWith('.sha256'));
  if (!files.length) return { kind: 'trial', tag: release?.tag_name ?? null };
  const sums = new Map(release.assets.filter((a) => a.name.endsWith('.sha256')).map((a) => [a.name, a.browser_download_url]));
  return {
    kind: 'download',
    tag: release.tag_name,
    releaseUrl: release.html_url,
    files: files.map((a) => ({
      name: a.name,
      url: a.browser_download_url,
      size: a.size,
      sha256Url: sums.get(`${a.name}.sha256`) ?? null,
    })),
  };
}
