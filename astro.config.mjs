// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import toolNavigation from './src/data/tool-navigation.json' with { type: 'json' };

// GitHub Pages project site: https://<owner>.github.io/<repo>/ . Both are overridable in CI.
const site = process.env.SITE_URL ?? 'https://ovo0615.github.io';
const base = process.env.SITE_BASE ?? '/automation-tools-site';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Simulation Automation Tools',
      description:
        "Jeff Hong's portfolio of Ansys simulation automation tools: features, release notes, trial requests and feedback.",
      defaultLocale: 'root',
      locales: { root: { label: 'English', lang: 'en' } },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/ovo0615' }],
      customCss: ['./src/styles/theme.css'],
      components: {
        Footer: './src/components/Footer.astro',
        ThemeProvider: './src/components/ForceDark.astro',
        ThemeSelect: './src/components/Empty.astro',
      },
      sidebar: [
        { label: 'Home · 首頁', link: '/' },
        {
          label: 'PCB SI 3D Simulation Toolkit · PCB SI 工具',
          items: [
            { label: 'Overview · 介紹', link: '/tools/pcb-si/' },
            ...toolNavigation.map(e => ({ label: `${e.label} · ${e.zh}`, link: `/tools/pcb-si/${e.path}/` })),
            { label: 'Requirements & trial · 系統需求與試用', link: '/tools/pcb-si/requirements/' },
            { label: 'Data & privacy · 資料與隱私', link: '/tools/pcb-si/privacy/' },
            { label: 'Contact & support · 聯絡支援', link: '/tools/pcb-si/support/' },
          ],
        },
        { label: 'About · 關於', link: '/about/' },
      ],
    }),
  ],
});
