import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedArticles } from '../lib/knowledge';

export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://www.fyrefish.com');
  // Newest first for the feed reader.
  const articles = (await getPublishedArticles()).reverse();

  return rss({
    title: 'Fyrefish Knowledge',
    description:
      'Straight answers to the technology, AI and operating-model questions executives actually ask — by Graeme Jones.',
    site,
    items: articles.map((a) => {
      const link = new URL(`/knowledge/${a.id}/`, site).href;
      return {
        title: a.data.question,
        description: a.data.summary,
        pubDate: a.data.pubDate, // original publication date, never the updated date
        link,
        author: 'Graeme Jones',
        categories: [a.data.category],
        // Stable GUID based on the canonical URL.
        guid: link,
      };
    }),
    customData: '<language>en-us</language>',
  });
}
