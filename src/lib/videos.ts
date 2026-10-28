import videos from '../data/videos.json';

export type Video = (typeof videos)[number] & { duration?: string; guide?: { label: string; path: string }[] };
export type Series = 'tool-guide' | 'agent-workflow';

// 影片頁每集的錨點：功能總覽 #overview、工具操作 #ep21、流程示範 #workflow-1。
export const videoAnchor = (v: Video) =>
  v.series === 'tool-guide' ? (v.episode === 0 ? 'overview' : `ep${v.episode}`) : `workflow-${v.episode}`;

// 畫面上顯示的集別：工具操作教學不顯示 EP 編號（Jeff 2026-10-28），流程示範保留上／中／下集。
export const shownLabel = (v: Video) => (v.series === 'tool-guide' ? '' : v.label);

export const videosOf = (slug: string, series: Series) =>
  (videos as Video[]).filter((v) => v.tool === slug && v.series === series).sort((a, b) => a.episode - b.episode);

export const findVideo = (slug: string, label: string) =>
  (videos as Video[]).find((v) => v.tool === slug && v.label === label);
