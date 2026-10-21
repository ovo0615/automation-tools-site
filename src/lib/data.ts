import tools from '../data/tools.json';
import generated from '../generated/tools-data.json';

export type Section = { version: string; date: string | null; heading: string; body: string; releaseUrl: string | null };
export type Download =
  | { kind: 'trial'; tag: string | null }
  | {
      kind: 'download';
      tag: string;
      releaseUrl: string;
      files: { name: string; url: string; size: number; sha256Url: string | null }[];
    };
type ToolData = { slug: string; repoUrl: string; commit: string; sections: Section[]; download: Download };

export const toolList = tools;
export const toolData = (slug: string) => (generated.tools as Record<string, ToolData>)[slug] ?? null;
export const fetchedAt = generated.fetchedAt;
