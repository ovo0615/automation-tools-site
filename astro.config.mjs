// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages project site: https://<owner>.github.io/<repo>/ . Both are overridable in CI.
const site = process.env.SITE_URL ?? 'https://ovo0615.github.io';
const base = process.env.SITE_BASE ?? '/automation-tools-site';
const chapter = (label, hash) => ({
  label,
  link: `/tools/pcb-si/manual/#${hash}`,
});

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Ansys 自動化工具',
      description:
        "Jeff Hong's portfolio of Ansys simulation automation tools: features, release notes, trial requests and feedback.",
      defaultLocale: 'root',
      locales: { root: { label: '繁體中文', lang: 'zh-TW' } },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      pagination: false,
      customCss: ['./src/styles/theme.css'],
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
            chapter('載入電路板', '1-load-a-board--載入電路板'),
            chapter('選擇網路', '2-select-nets--選擇網路'),
            chapter('預覽與裁切', '3-preview-and-cut--預覽與裁切'),
            chapter('Port 與頻率', '4-ports-and-frequency--port-與頻率'),
            chapter('建立 Port', '5-create-ports--建立-port'),
            chapter('先不分割', '6-start-without-splitting--先不分割'),
            chapter('後續章節', 'next-version--下一版補上'),
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
