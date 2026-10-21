// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

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
            { label: 'Release notes · 版本更新', link: '/tools/pcb-si/changelog/' },
          ],
        },
        { label: 'All release notes · 全部版本', link: '/changelog/' },
        { label: 'Request a trial · 申請試用', link: '/trial/' },
        { label: 'Feedback · 回饋', link: '/feedback/' },
        { label: 'About · 關於', link: '/about/' },
      ],
    }),
  ],
});
