// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production domain — confirm the exact host (apex vs www) once DNS is pointed at Amplify.
  // Used for canonical URLs, Open Graph tags, JSON-LD and the sitemap.
  site: 'https://www.fyrefish.com',
  build: {
    // Emit clean directory-style URLs (e.g. /knowledge/should-we-replace-our-crm/).
    // Plays nicely with Amplify rewrites and gives stable, permanent article URLs.
    format: 'directory',
  },
  // Old LinkedIn-oriented route now points at the canonical Knowledge base.
  redirects: {
    '/insights': '/knowledge',
  },
  integrations: [
    // Accurate URLs and canonical host matter more than priority/changefreq tuning.
    // Drafts are excluded because their routes are never generated (getStaticPaths
    // filters them). Exclude non-page endpoints and the /insights redirect.
    sitemap({
      filter: (page) =>
        !/\/(rss\.xml|robots\.txt|llms\.txt)$/.test(page) &&
        !/\/insights\/?$/.test(page),
    }),
  ],
});
