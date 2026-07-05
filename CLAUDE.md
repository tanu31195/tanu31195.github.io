# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this repo is

`tanu31195.github.io` — a personal static site hosted on GitHub Pages at
https://tanu31195.github.io. It's Tanushka Bandara's resume/portfolio site,
plus a couple of small standalone landing pages for a mobile app. There is
**no build step, no framework, no package.json** — every page is hand-written
HTML/CSS/JS served as-is by GitHub Pages.

## Site map

| Path | Purpose |
|---|---|
| `index.html` | Main resume/portfolio site (About, Experience, Education, Skills, Projects, Awards, Interests). This is the primary file to edit for content changes. |
| `css/resume.css` | All styling for `index.html`. Single stylesheet, ~1300 lines, theme-driven via CSS custom properties. |
| `js/resume.js` | All behavior for `index.html`: theme toggle, mobile nav, scrollspy, typing-text rotator, reveal-on-scroll animations, an interactive fake terminal, and timeline "duration" calculations. IIFE, vanilla JS, no build tooling. |
| `coachdesk/index.html` | Standalone marketing/landing page for the "CoachDesk HQ" iOS app. Self-contained: styles are inline in a `<style>` block, no shared assets. |
| `coachdesk/privacy.html` | Privacy policy page for CoachDesk HQ. Also self-contained/inline-styled. |
| `favicons/` | Favicon set + `manifest.json` used by `index.html`. |
| `img/` | Profile photo and resume PDF used by `index.html`. |
| `certificates/` | PDFs/images of completed course certificates, linked from the Awards section of `index.html`. |
| `data/react-native/` | Sample JSON/image data from old React Native app demos. **Not referenced anywhere in the site** — legacy/orphaned content. |
| `vendor/` | Bundled third-party libraries (Bootstrap, Font Awesome, jQuery, devicons, simple-line-icons). **Not referenced by any current page** — `index.html` loads Font Awesome and devicon from CDN instead. Treat as legacy; don't assume it's wired up. |
| `css/timeline.css`, `css/timeline.scss`, `js/timeline.js` | Leftover from an earlier design iteration. **Not linked from `index.html`** — the current timeline markup/behavior lives in `js/resume.js` and `css/resume.css`. |
| `.github/workflows/jekyll.yml` | CI: builds the site with `jekyll/builder` on every push/PR to `master`, purely as a build-sanity check (GitHub Pages does its own Jekyll build/serve on top of `master`). |

## Deployment

This is deployed via **GitHub Pages** directly from the `master` branch — there
is no separate `gh-pages` branch and no publish step to run. Whatever is
committed to `master` in the repo root is what's live at
https://tanu31195.github.io. Pages runs its own Jekyll pass; since there's no
`_config.yml` or front matter, Jekyll effectively just copies files through
(anything not prefixed with `_` or `.` passes through unchanged).

The GitHub Actions workflow (`jekyll.yml`) only builds the site in a container
as a CI check — it does not deploy anything.

## Development workflow

There's no local dev server tooling, package manager, linter, or test suite
in this repo. To work on it:

- Edit HTML/CSS/JS directly.
- Preview by opening the HTML file in a browser, or serving the repo root
  with any static file server (e.g. `python3 -m http.server`).
- `index.html`'s CSS/JS lives in `css/resume.css` / `js/resume.js` — edit
  those, not inline styles/scripts, to keep the separation the file already
  has.
- `coachdesk/*.html` are intentionally self-contained single files with
  inline `<style>` blocks — keep new edits to those pages inline too rather
  than pulling in `css/resume.css` or shared assets.

## Conventions

- **Theming**: `index.html` uses `data-theme="dark"|"light"` on `<html>`,
  driven by CSS custom properties defined in `:root` and overridden under
  `[data-theme="dark"]` in `css/resume.css`. The theme is persisted to
  `localStorage` and applied via an inline blocking script in `<head>` to
  avoid a flash of the wrong theme. If you touch theming, keep both variants
  (`:root` light defaults + `[data-theme="dark"]` overrides) in sync.
- **JS style**: `js/resume.js` is a single IIFE (`'use strict'`), vanilla DOM
  APIs, `var`/`function` (no build step, no transpilation — write code that
  runs unmodified in the browser). Sections are separated by banner comments
  (`/* ── ... ── */`). Respects `prefers-reduced-motion`.
  It also does `document.write`-style `.innerHTML +=` string building for a
  toy terminal easter egg — treat any user-controlled input into it carefully
  (currently only fixed canned commands are supported).
  Follow the existing pattern rather than introducing new patterns.
- **HTML structure**: `index.html` sections are `<section class="resume-section" id="...">`
  matching the sidebar nav links (`#about`, `#experience`, `#education`,
  `#skills`, `#projects`, `#awards`, `#interests`). Adding a new top-level
  section means adding both the `<section>` and a corresponding `<li>` in
  `#sidebarNav`, and (if it should show up in scrollspy) it just needs an
  `id` — `js/resume.js` auto-observes all `section[id]`.
  Font Awesome (`fas`/`fab`) icons are used throughout, loaded via CDN link
  in `<head>` — don't reference `vendor/font-awesome` which is unused.
  Any external links use `target="_blank" rel="noopener"`.
- **Resume content accuracy**: Experience, education, and dates in `index.html`
  reflect a real person's actual work history. When editing this content, use
  exactly what the user provides — don't invent, infer, or "improve" dates,
  titles, or descriptions.
- **Analytics**: `index.html` includes a Google Analytics (`gtag.js`) snippet
  with a hardcoded tracking ID. Don't remove it incidentally when touching
  `<head>`.
- **Assets**: `.DS_Store` files exist in a few directories (macOS artifacts,
  not intentionally committed) — don't add new ones; there's no `.gitignore`
  in this repo, so be deliberate about what you `git add`.

## Things to watch for

- There is no test suite, linter, or CI check on content correctness — only
  `jekyll.yml`, which just verifies the site builds. Manually verify HTML/CSS/JS
  changes by opening the page in a browser.
- Because `vendor/`, `data/react-native/`, and `css/timeline.*`/`js/timeline.js`
  are unreferenced, don't assume something exists on the live site just
  because a file for it exists in the repo. Grep `index.html` (and
  `coachdesk/*.html`) to confirm a given asset is actually linked before
  relying on or modifying it.
- `coachdesk/` pages are unrelated to the main resume site's build — changes
  to `css/resume.css` or `js/resume.js` do not affect them, and vice versa.
