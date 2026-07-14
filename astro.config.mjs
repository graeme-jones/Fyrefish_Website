// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Production domain — confirm the exact host (apex vs www) once DNS is pointed at Amplify.
  // Used for canonical URLs, Open Graph tags and the sitemap.
  site: 'https://www.fyrefish.com',
  build: {
    // Emit clean directory-style URLs (e.g. /about/) — plays nicely with Amplify rewrites.
    format: 'directory',
  },
});
