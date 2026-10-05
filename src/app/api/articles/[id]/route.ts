import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/api/newsapi';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url    = decodeURIComponent(params.id);
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    const { articles } = await searchArticles(domain, 1, 20);
    const article = articles.find(a => a.url === url || a.id === url);

    if (!article) {
      return NextResponse.json({
        id: url, title: 'Article', content: '', summary: '',
        source: { id: domain, name: domain, url: urlObj.origin },
        category: 'monde' as const,
        publishedAt: new Date().toISOString(),
        tags: [], media: [], language: 'fr', url, readTime: 1,
      });
    }

    return NextResponse.json(article);
  } catch (err) {
    console.error('[/api/articles/[id]]', err);
    return NextResponse.json({ message: 'Article introuvable' }, { status: 404 });
  }
}