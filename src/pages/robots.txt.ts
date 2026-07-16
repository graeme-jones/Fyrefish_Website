import type { APIContext } from 'astro';

// Generated so the sitemap URL always derives from the configured site origin.
// Policy: ordinary search and answer-engine crawlers are welcome (covered by the
// wildcard). Crawlers identified with model training / extended AI use are asked
// not to access the site. robots.txt expresses preferences only — it does not
// technically prevent copying, training or indexing, and depends on the crawler
// respecting the standard.
export function GET(context: APIContext) {
  const site = context.site ?? new URL('https://www.fyrefish.com');
  const sitemap = new URL('/sitemap-index.xml', site).href;

  const body = `# Search and answer engines are welcome to crawl and cite this site.
# Crawlers identified with model training / extended AI use are asked not to access it.
# These are preferences; compliance depends on the crawler honouring robots.txt.

User-agent: *
Allow: /

# Model-training / extended-AI crawlers — request no access.
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
