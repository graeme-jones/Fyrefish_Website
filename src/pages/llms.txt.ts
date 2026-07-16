import type { APIContext } from 'astro';
import { getPublishedArticles, getPublishedStories } from '../lib/knowledge';

// A small, curated set of cornerstone entries — not the full corpus. Generated
// from published content so it never goes stale or exposes drafts.
const CORNERSTONES = [
  'what-is-an-operating-model',
  'is-technology-really-the-problem',
  'should-we-replace-our-crm',
];

export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://www.fyrefish.com');
  const base = site.href.replace(/\/$/, '');
  const abs = (path: string) => `${base}${path}`;

  const articles = await getPublishedArticles();
  const stories = await getPublishedStories();
  const cornerstone = CORNERSTONES
    .map((slug) => articles.find((a) => a.id === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const body = `# Fyrefish Technologies

> Executive advisory practice of Graeme Jones. Plain-language guidance on making better technology, AI and automation decisions — grounded in understanding the business before the technology.

Graeme Jones is an Executive Advisor (Business & Technology Strategy) with more than thirty years across global telecoms, enterprise software, product strategy and business transformation. The website holds the canonical, complete versions of his writing; LinkedIn carries shorter adaptations that link back here.

Canonical domain: ${base}/

## Knowledge
Plain-language answers to the technology and operating-model questions behind major business decisions.
- Knowledge index: ${abs('/knowledge/')}
${cornerstone.map((a) => `- [${a.data.question}](${abs(`/knowledge/${a.id}/`)}): ${a.data.summary}`).join('\n')}

## Experience
The engagements that shaped these ideas — the principles in practice.
- Experience index: ${abs('/experience/')}
${stories.map((s) => `- [${s.data.title}](${abs(`/experience/${s.id}/`)})`).join('\n')}

## Notes
This website contains the canonical, complete versions of the content. This file is a supplemental aid — not a replacement for the site's HTML pages, sitemap.xml or robots.txt, and not a ranking mechanism.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
