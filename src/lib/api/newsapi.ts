import { Article, ArticleCategory } from '@/types';

const BASE_URL = 'https://newsapi.org/v2';
const API_KEY  = process.env.NEWSAPI_KEY || '';

const CATEGORY_MAP: Record<ArticleCategory, string> = {
  politique:     'politics',
  economie:      'business',
  technologie:   'technology',
  sport:         'sports',
  science:       'science',
  sante:         'health',
  culture:       'entertainment',
  environnement: 'science',
  monde:         'general',
  societe:       'general',
};

interface NewsApiArticle {
  source:      { id: string | null; name: string };
  author:      string | null;
  title:       string;
  description: string | null;
  url:         string;
  urlToImage:  string | null;
  publishedAt: string;
  content:     string | null;
}

interface NewsApiResponse {
  status:       string;
  totalResults: number;
  articles:     NewsApiArticle[];
}

function mapArticle(raw: NewsApiArticle, category: ArticleCategory): Article {
  return {
    id:          raw.url,
    title:       raw.title,
    content:     raw.content || raw.description || '',
    summary:     raw.description || '',
    author:      raw.author || undefined,
    source: {
      id:   raw.source.id || raw.source.name.toLowerCase().replace(/\s+/g, '-'),
      name: raw.source.name,
      url:  (() => { try { return new URL(raw.url).origin; } catch { return raw.url; } })(),
    },
    category,
    publishedAt: raw.publishedAt,
    tags:        [],
    media:       raw.urlToImage
      ? [{ url: raw.urlToImage, type: 'image' as const, alt: raw.title }]
      : [],
    language: 'fr',
    url:      raw.url,
    readTime: Math.max(1, Math.ceil((raw.content?.length || 500) / 1000)),
  };
}

export async function fetchTopHeadlines(
  category: ArticleCategory = 'monde',
  page     = 1,
  pageSize = 20,
): Promise<{ articles: Article[]; total: number }> {
  const params = new URLSearchParams({
    country:  'us',
    category: CATEGORY_MAP[category],
    page:     String(page),
    pageSize: String(Math.min(pageSize, 100)),
    apiKey:   API_KEY,
  });

  try {
    const res = await fetch(`${BASE_URL}/top-headlines?${params}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`NewsAPI error: ${res.status}`);
      return { articles: [], total: 0 };
    }

    const data: NewsApiResponse = await res.json();
    const articles = data.articles
      .filter(a => a.title && a.title !== '[Removed]' && a.url)
      .map(a => mapArticle(a, category));

    return { articles, total: data.totalResults };
  } catch (err) {
    console.error('NewsAPI fetch error:', err);
    return { articles: [], total: 0 };
  }
}

export async function searchArticles(
  query    = '',
  page     = 1,
  pageSize = 20,
  sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'publishedAt',
): Promise<{ articles: Article[]; total: number }> {
  const params = new URLSearchParams({
    q:        query,
    sortBy:   'publishedAt',
    page:     String(page),
    pageSize: String(Math.min(pageSize, 100)),
    apiKey:   API_KEY,
  });

  try {
    const res = await fetch(`${BASE_URL}/everything?${params}`, {
      cache: 'no-store',
    });

    if (!res.ok) return { articles: [], total: 0 };

    const data: NewsApiResponse = await res.json();
    const articles = data.articles
      .filter(a => a.title && a.title !== '[Removed]' && a.url)
      .map(a => mapArticle(a, 'monde'));

    return { articles, total: data.totalResults };
  } catch (err) {
    console.error('NewsAPI search error:', err);
    return { articles: [], total: 0 };
  }
}