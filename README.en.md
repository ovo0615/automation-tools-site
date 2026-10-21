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

## Guard

The build fails when any page, generated data or built HTML contains: card numbers, disk/UNC paths, the word
"private", restricted names, control characters, relative links, or images not listed in `guard/policy.json`.
Restricted names (customers, internal code names) are supplied at build time through `SITE_GUARD_TERMS` or
`SITE_GUARD_TERMS_FILE` and are never committed. In CI a missing list fails the build.

## Notice

This is Jeff Hong's personal technical portfolio. It is not an official account of Taiwan Auto-Design Co. (TADC).
Ansys is a trademark of Ansys, Inc.; this portfolio is not officially affiliated with Ansys, Inc.
Demonstration only — all rights reserved. No licence is granted to use, copy or redistribute this repository.
