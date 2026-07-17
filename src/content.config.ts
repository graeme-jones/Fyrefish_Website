import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared SEO/metadata fields. Visible fields (title, question, dek, shortAnswer,
// summary) are required and do distinct jobs — they must not repeat one another.
// The *metadata* fields are optional overrides that fall back sensibly, so authors
// rarely need to set them. Canonical URLs derive from the route unless overridden.
const seo = {
  seoTitle: z.string().optional(), // <title>; default `${title} | Graeme Jones`
  metaDescription: z.string().optional(), // <meta>; falls back to `summary`
  ogTitle: z.string().optional(), // falls back to seoTitle
  ogDescription: z.string().optional(), // falls back to metaDescription → summary
  canonicalUrl: z.string().url().optional(), // rare override; else route-derived
  image: z.string().optional(), // social image; else site default
};

// Knowledge: one long-form article per executive question. The website is the
// canonical source; LinkedIn is optional distribution.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    // --- Visible, each with a distinct job (no repetition) ---
    title: z.string(), // H1 — the executive question
    question: z.string(), // the question, verbatim, for the answer panel + schema
    dek: z.string(), // subtitle: WHY the question matters
    shortAnswer: z.string(), // the direct, quotable answer
    summary: z.string(), // index + RSS blurb; fallback meta description
    explains: z.array(z.string()).min(1), // "This article explains" (≤4 shown)
    // --- Classification + graph ---
    category: z.string(), // visible Knowledge-index grouping
    tags: z.array(z.string()).default([]), // semantic tags for related-fallback
    related: z.array(z.string()).default([]), // manual related slugs (authoritative)
    story: z.enum(['roadmap', 'ambiguity', 'listening']).optional(), // → /experience
    // --- Dates (never auto-stamped; see template rendering rules) ---
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(), // material content revision
    lastReviewed: z.coerce.date().optional(), // reviewed, no material rewrite
    // --- Optional ---
    readingTime: z.number().optional(), // manual override; else computed
    linkedinUrl: z.string().url().optional(), // "a related version on LinkedIn"
    draft: z.boolean().default(false),
    order: z.number().default(0), // ordering weight within a category
    ...seo,
  }),
});

// Experience: the lived engagements that seeded the principles. Each is a full
// narrative on its own page; the homepage shows only a compact card.
const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    title: z.string(),
    category: z.string(), // sector label (e.g. "Non-Profit")
    hook: z.array(z.string()).min(1), // cold-open lines (1–2 shown on homepage)
    homepageExcerpt: z.string(), // ~30–55 words for the homepage card
    intro: z.string(), // ~60–100 words for the /experience index + meta fallback
    lesson: z.array(z.string()).min(1), // "What this taught me"
    relatedKnowledge: z.array(z.string()).default([]), // → "The idea behind this story"
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lastReviewed: z.coerce.date().optional(),
    readingTime: z.number().optional(),
    draft: z.boolean().default(false),
    order: z.number().default(0),
    ...seo,
  }),
});

export const collections = { articles, experience };
