import videos from '../data/videos.json';

export type Video = (typeof videos)[number] & { duration?: string; guide?: { label: string; path: string }[] };
export type Series = 'tool-guide' | 'agent-workflow';

// 影片頁每集的錨點：功能總覽 #overview、工具操作 #ep21、流程示範 #workflow-1。
export const videoAnchor = (v: Video) =>
  v.series === 'tool-guide' ? (v.episode === 0 ? 'overview' : `ep${v.episode}`) : `workflow-${v.episode}`;

export const videosOf = (slug: string, series: Series) =>
  (videos as Video[]).filter((v) => v.tool === slug && v.series === series).sort((a, b) => a.episode - b.episode);

export const findVideo = (slug: string, label: string) =>
  (videos as Video[]).find((v) => v.tool === slug && v.label === label);
