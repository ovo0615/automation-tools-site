# Simulation Automation Tools — site

Product site for Jeff Hong's Ansys simulation automation tools: features, release notes, trial requests and feedback.
Built with Astro Starlight and deployed to GitHub Pages.

## Build

| Step | Command |
|---|---|
| Install (Node.js 24) | `npm ci` |
| Test | `npm test` |
| Build (fetch public data, guard, build, guard) | `npm run build` |
| Preview | `npm run preview` |

## Where content comes from

| Content | Source |
|---|---|
| Tool list | `src/data/tools.json` |
| Pages | `src/content/docs/` |
| Release notes, download button | Each tool's **public** repository: `CHANGELOG.md` (`## v…` sections only) and GitHub Releases, fetched at build time |
| Contact and form links | `src/data/site.json` |
| Shared tool navigation | `src/data/tool-navigation.json` |
| Public videos | `src/data/videos.json`: `tool`, `series` (`tool-guide` or `agent-workflow`), `episode`, `label`, `youtubeId`, `title`, `titleZh`, `titleEn`; optional `duration` (e.g. `7:29`) and `guide` (matching manual sections). Thumbnails go in `public/video-thumbs/<youtubeId>.webp` (960×540) and must be listed in `guard/policy.json` |
| Requests and public roadmap | `src/data/wishes.json`: `id`, `tool`, `title`, `titleZh`, `status` |
| Known issues | `src/data/known-issues.json`: `id`, `tool`, `title`, `titleZh`, `description`, `descriptionZh`, `versions`; optional `source` |

Request states: `received`, `evaluating`, `planned`, `completed`. Empty lists show an honest empty state. Never add fictional requests or reviews.

The `trial`, `bug`, `wish` and `feedback` form keys accept company Microsoft Forms HTTPS URLs. Keep `null` until ready; pages offer email and a form-coming-soon message. The build rejects other form hosts, malformed video IDs, duplicates and missing content.

Add verified public videos through the data file and a thumbnail. Use `series` to distinguish workflow demonstrations from current-interface tutorials. The YouTube iframe is created only after a play click.

## Guard

The build fails when any page, generated data or built HTML contains: card numbers, disk/UNC paths, the word
"private", restricted names, control characters, relative links, or images not listed in `guard/policy.json`.
Restricted names (customers, internal code names) are supplied at build time through `SITE_GUARD_TERMS` or
`SITE_GUARD_TERMS_FILE` and are never committed. In CI a missing list fails the build.

## Notice

This is Jeff Hong's personal technical portfolio. It is not an official account of Taiwan Auto-Design Co. (TADC).
Ansys is a trademark of Ansys, Inc.; this portfolio is not officially affiliated with Ansys, Inc.
Demonstration only — all rights reserved. No licence is granted to use, copy or redistribute this repository.
