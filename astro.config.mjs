// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages project site: https://<owner>.github.io/<repo>/ . Both are overridable in CI.
const site = process.env.SITE_URL ?? 'https://ovo0615.github.io';
const base = process.env.SITE_BASE ?? '/automation-tools-site';
// icon／group 對應工具入口畫面的功能圖示與分組（src/assets/pcbsi/README.md），側邊欄以 CSS 顯示圖示。
const chapter = (label, hash, icon, group) => ({
  label,
  link: `/tools/pcb-si/manual/#${hash}`,
  attrs: { 'data-icon': icon, ...(group && { 'data-group': group }) },
});

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'PCB SI 3D Simulation Toolkit',
      description:
        "Jeff Hong's portfolio of Ansys simulation automation tools: features, release notes, trial requests and feedback.",
      defaultLocale: 'root',
      locales: { root: { label: '繁體中文', lang: 'zh-TW' } },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      pagination: false,
      customCss: ['./src/styles/theme.css', './src/styles/brand.css'],
      // 在 <head> 先套用記憶的字級，避免頁面先以標準字級畫出再跳動
      head: [
        // 工具 app icon：SVG 由 Starlight 預設的 /favicon.svg 提供，另補舊瀏覽器與主畫面捷徑用的點陣圖。
        { tag: 'link', attrs: { rel: 'icon', href: `${base}/favicon.ico`, sizes: '32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}/apple-touch-icon.png` } },
        {
          tag: 'script',
          content:
            "try{const s=localStorage.getItem('pcb-si-font-size');if(['100','112.5','125'].includes(s))document.documentElement.dataset.fontSize=s}catch{}",
        },
      ],
      components: {
        Footer: './src/components/Footer.astro',
        Header: './src/components/ReadingHeader.astro',
        Sidebar: './src/components/ReadingSidebar.astro',
      },
      sidebar: [
        { label: '簡介', link: '/' },
        { label: '安裝與試用授權', link: '/tools/pcb-si/quick-start/' },
        { label: '快速開始', link: '/tools/pcb-si/manual/' },
        {
          label: '操作說明',
          collapsed: true,
          items: [
            { label: '功能介紹', link: '/tools/pcb-si/' },
            chapter('載入電路板', '1-load-a-board--載入電路板', 'board', 'prep'),
            chapter('選擇網路', '2-select-nets--選擇網路', 'board', 'prep'),
            chapter('預覽與裁切', '3-preview-and-cut--預覽與裁切', 'cutout', 'prep'),
            chapter('Port 與頻率', '4-ports-and-frequency--port-與頻率', 'ports', 'analysis'),
            chapter('建立 Port', '5-create-ports--建立-port', 'ports', 'analysis'),
            chapter('分段', '6-segment-the-channel--分段', 'segment', 'analysis'),
            chapter('指定求解器與排程', '7-assign-solvers-and-schedule--指定求解器與排程', 'schedule', 'analysis'),
            chapter('電路串接', '8-cascade--電路串接', 'cascade', 'result'),
            chapter('S 參數', '9-s-parameters--s-參數', 'sparam', 'result'),
            chapter('另存 Touchstone', '10-save-the-touchstone--另存-touchstone', 'sparam', 'result'),
            chapter('TDR 阻抗定位', '11-tdr--tdr-阻抗定位', 'tdr', 'result'),
            chapter('HTML 報告', '12-html-report--一鍵-html-報告', 'report', 'result'),
            chapter('支援包', 'support-package--支援包', 'none'),
          ],
        },
        { label: '操作影片', link: '/tools/pcb-si/videos/' },
        { label: '常見問題', link: '/tools/pcb-si/faq/' },
        { label: '版本紀錄', link: '/tools/pcb-si/changelog/' },
        {
          label: '回報與支援',
          collapsed: true,
          items: [
            { label: '聯絡支援', link: '/tools/pcb-si/support/' },
            { label: 'Bug 回報', link: '/tools/pcb-si/bugs/' },
            { label: '功能許願', link: '/tools/pcb-si/wishlist/' },
            { label: '用戶回饋', link: '/tools/pcb-si/feedback/' },
            { label: '系統需求與試用', link: '/tools/pcb-si/requirements/' },
            { label: '申請試用', link: '/trial/' },
            { label: '資料與隱私', link: '/tools/pcb-si/privacy/' },
          ],
        },
        { label: '關於網站', link: '/about/' },
      ],
    }),
  ],
});
