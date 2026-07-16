// Centralized JSON-LD. Site identity (Person / Organization / WebSite) is defined
// once on the homepage as a connected @graph with stable @ids; every other page
// references those @ids rather than re-emitting full entities. All URLs derive from
// a single `base` (Astro.site origin) passed in by the caller.

const ID = {
  person: (base: string) => `${base}/#graeme-jones`,
  org: (base: string) => `${base}/#fyrefish`,
  website: (base: string) => `${base}/#website`,
};

export const authorRef = (base: string) => ({ '@id': ID.person(base) });
export const publisherRef = (base: string) => ({ '@id': ID.org(base) });

// Homepage: WebPage + WebSite + Person + Organization, connected by @id.
export function siteGraph(base: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${base}/#webpage`,
        url: `${base}/`,
        name: 'Fyrefish — Executive Technology Decision Review',
        isPartOf: { '@id': ID.website(base) },
        about: { '@id': ID.person(base) },
        primaryImageOfPage: image,
      },
      {
        '@type': 'WebSite',
        '@id': ID.website(base),
        url: `${base}/`,
        name: 'Fyrefish',
        publisher: { '@id': ID.org(base) },
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': ID.person(base),
        name: 'Graeme Jones',
        url: `${base}/#about`,
        jobTitle: 'Executive Advisor — Business & Technology Strategy',
        worksFor: { '@id': ID.org(base) },
        sameAs: ['https://www.linkedin.com/in/graeme-jones-fyrefish'],
      },
      {
        '@type': 'Organization',
        '@id': ID.org(base),
        name: 'Fyrefish',
        legalName: 'Fyrefish Technologies',
        url: `${base}/`,
        founder: { '@id': ID.person(base) },
      },
    ],
  };
}

// A long-form Article (Knowledge article or Experience story). headline must match
// the visible H1; mainEntityOfPage must match the canonical URL.
export function articleLd(opts: {
  base: string;
  url: string;
  headline: string;
  description: string;
  section: string;
  image: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    articleSection: opts.section,
    inLanguage: 'en',
    author: authorRef(opts.base),
    publisher: publisherRef(opts.base),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    image: opts.image,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// An index page (Knowledge hub, Experience index). ItemList entries must match the
// visible published entries exactly — no hidden items.
export function collectionPageLd(opts: {
  base: string;
  url: string;
  name: string;
  description: string;
  items: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': opts.url,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': ID.website(opts.base) },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    },
  };
}
