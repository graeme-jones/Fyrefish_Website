# Fyrefish Technologies — Website

Marketing site for the **Executive Technology Decision Review** (Business Operating
Model Review) by Graeme Jones. Built with [Astro](https://astro.build) and deployed as a
static site on **AWS Amplify Hosting**.

## Stack

- **Astro 7** — static output (zero client JS except a small scroll-reveal + mobile-nav script)
- **Self-hosted fonts** — Archivo (display) + Inter (body) via `@fontsource-variable`
- **No runtime dependencies / external CDNs** — everything is bundled at build time

## Local development

Requires **Node ≥ 22.12** (see `.nvmrc`, pinned to Node 22 LTS).

```bash
npm install       # install dependencies
npm run dev       # local dev server at http://localhost:4321
npm run build     # production build to ./dist
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  layouts/Base.astro        # HTML shell: meta, fonts, global CSS, scroll-reveal
  styles/global.css         # design tokens (palette, type) + base styles
  components/                # one component per page section
    Logo, Nav, Hero, Case, OperatingModel, Process,
    Findings, Lessons, Deliverables, GetStarted, Footer
  pages/index.astro         # single landing page — assembles the sections
public/favicon.svg          # brand mark
```

The **design system** lives in [`src/styles/global.css`](src/styles/global.css) as CSS custom
properties (`--ink`, `--teal`, `--coral`, type scale, spacing). Change the brand there and it
propagates everywhere.

## Deploying to AWS Amplify

The build is configured in [`amplify.yml`](amplify.yml) (`npm ci` → `npm run build`, artifacts
in `dist/`). To set up hosting:

1. In the Amplify console, **Host a web app** → connect this Git repository.
2. Amplify auto-detects `amplify.yml`. Confirm the build image uses **Node 22**
   (via `.nvmrc` / build settings) to match `package.json` `engines`.
3. Deploy. Every push to `main` triggers a new build.

### Before launch — TODO

- [ ] Confirm the exact production host (apex `fyrefish.com` vs `www.`) in
      [`astro.config.mjs`](astro.config.mjs) (`site:`) so canonical URLs and Open Graph tags match.
- [ ] (Optional) Swap the `mailto:graeme.jones@fyrefish.com` CTA for a proper contact form —
      Amplify supports serverless functions if you want form submissions.
- [ ] Point DNS at the Amplify app and enable HTTPS.
- [ ] (Optional) Add an OG share image and `og:image` meta.
