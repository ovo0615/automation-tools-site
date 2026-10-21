import { Marked } from 'marked';

// Release notes come from a public repo; raw HTML inside them is dropped rather than trusted.
const md = new Marked({ gfm: true });
md.use({ renderer: { html: () => '' } });

export const renderMarkdown = (text: string) => md.parse(text, { async: false }) as string;
