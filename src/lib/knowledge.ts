import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;
export type Story = CollectionEntry<'experience'>;

// article.story (a stable key) → the Experience entry slug it links to.
// Two-way: articles show "From experience"; stories show "The idea behind this story".
export const STORY_KEY_TO_SLUG: Record<string, string> = {
  roadmap: 'the-roadmap-that-was-never-written',
  ambiguity: 'dont-automate-ambiguity',
  listening: 'when-listening-to-users-leads-you-astray',
};

export async function getStoryFor(key: string | undefined): Promise<Story | null> {
  if (!key) return null;
  const slug = STORY_KEY_TO_SLUG[key];
  if (!slug) return null;
  return (await getEntry('experience', slug)) ?? null;
}

// Estimated reading time at ~200 words/min, rounded up, floor 1 min.
// A manual `readingTime` in frontmatter always wins.
export function readingMinutes(body: string | undefined, override?: number): number {
  if (override) return override;
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const byRecency = (a: { data: { pubDate: Date } }, b: { data: { pubDate: Date } }) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

// Published entries only (drafts excluded), oldest first — a stable canonical order.
export async function getPublishedArticles(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => !data.draft);
  return all.sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
}

export async function getPublishedStories(): Promise<Story[]> {
  const all = await getCollection('experience', ({ data }) => !data.draft);
  return all.sort((a, b) => (a.data.order - b.data.order) || a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
}

// Related-content priority: (1) manual related slugs, (2) shared tags, (3) shared
// category, (4) none. Always excludes self, dedupes, and caps at 3. Manual wins.
export function getRelated(entry: Article, all: Article[]): Article[] {
  const pool = all.filter((a) => a.id !== entry.id && !a.data.draft);
  const byId = new Map(pool.map((a) => [a.id, a]));
  const picks: Article[] = [];
  const seen = new Set<string>();
  const add = (a: Article | undefined) => {
    if (a && !seen.has(a.id)) { seen.add(a.id); picks.push(a); }
  };

  for (const id of entry.data.related) add(byId.get(id)); // 1. manual

  if (picks.length < 3 && entry.data.tags.length) {        // 2. shared tags
    for (const a of pool.slice().sort(byRecency)) {
      if (picks.length >= 3) break;
      if (a.data.tags.some((t) => entry.data.tags.includes(t))) add(a);
    }
  }

  if (picks.length < 3) {                                  // 3. shared category
    for (const a of pool.slice().sort(byRecency)) {
      if (picks.length >= 3) break;
      if (a.data.category === entry.data.category) add(a);
    }
  }

  return picks.slice(0, 3);
}

// Month-year label, e.g. "July 2026".
export function monthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Which dates to display, per the editorial rules:
// - Published always. Updated only if later than published.
// - Last reviewed only if later than both published and updated.
export function resolveDates(data: {
  pubDate: Date;
  updatedDate?: Date;
  lastReviewed?: Date;
}): { published: Date; updated: Date | null; reviewed: Date | null } {
  const published = data.pubDate;
  const updated = data.updatedDate && data.updatedDate > published ? data.updatedDate : null;
  let reviewed: Date | null = null;
  if (data.lastReviewed) {
    const laterThanPub = data.lastReviewed > published;
    const laterThanUpd = !updated || data.lastReviewed > updated;
    if (laterThanPub && laterThanUpd) reviewed = data.lastReviewed;
  }
  return { published, updated, reviewed };
}

// dateModified for JSON-LD: newest meaningful date.
export function lastModified(data: {
  pubDate: Date;
  updatedDate?: Date;
  lastReviewed?: Date;
}): Date {
  return data.lastReviewed ?? data.updatedDate ?? data.pubDate;
}
