// Rewrite repo-relative Markdown links so a section copied out of a public repo
// still points at that repo (pinned to a tag or commit) instead of breaking on the site.

const LINK = /(!?)\[([^\]]*)\]\(([^)\s]+)\)/g;
const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|#)/i;

export function absolutizeLinks(markdown, { owner, repo, ref }) {
  return markdown.replace(LINK, (whole, bang, text, target) => {
    if (ABSOLUTE.test(target)) return whole;
    const [rawPath, ...hash] = target.split('#');
    const path = rawPath.replace(/^\.?\//, '').split('/').map(encodeURIComponent).join('/');
    const anchor = hash.length ? `#${hash.join('#')}` : '';
    const url = bang
      ? `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`
      : `https://github.com/${owner}/${repo}/blob/${ref}/${path}${anchor}`;
    return `${bang}[${text}](${url})`;
  });
}
