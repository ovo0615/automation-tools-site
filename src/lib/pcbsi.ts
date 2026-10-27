// PCB SI 3D Simulation Toolkit 自身的功能圖示與分組（來源見 src/assets/pcbsi/README.md）。
const raw = import.meta.glob<string>('../assets/pcbsi/icons/*.svg', { query: '?raw', import: 'default', eager: true });

export const icons: Record<string, string> = Object.fromEntries(
  Object.entries(raw).map(([path, svg]) => [path.replace(/^.*\/(.+)\.svg$/, '$1'), svg]),
);

export const appIcon = (
  await import('../assets/pcbsi/app-icon.svg?raw')
).default.replace(/<!--[\s\S]*?-->/g, '');

// 圖示為裝飾：螢幕閱讀器略過，文字標籤另外提供。
export const iconMarkup = (name: string) => {
  const svg = icons[name];
  if (!svg) throw new Error(`Unknown PCB SI icon: ${name}`);
  return svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
};

// 分組與工具入口畫面相同；重點色定義在 src/styles/brand.css 的 --grp-*。
export type Group = 'prep' | 'pre' | 'analysis' | 'result';
export const groups: Record<Group, { zh: string; en: string }> = {
  prep: { zh: '準備', en: 'Prepare' },
  pre: { zh: '前處理（選用）', en: 'Pre-processing (optional)' },
  analysis: { zh: '分析', en: 'Analyse' },
  result: { zh: '結果', en: 'Results' },
};
