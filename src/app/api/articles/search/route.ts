import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/api/newsapi';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query    = searchParams.get('q') || '';
    const page     = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const sortBy   = (searchParams.get('sortBy') || 'publishedAt') as
      'relevancy' | 'popularity' | 'publishedAt';

    if (!query.trim() || query.trim().length < 2) {
      return NextResponse.json(
        { message: 'Requête trop courte' },
        { status: 400 }
      );
    }

    const { articles, total } = await searchArticles(query, page, pageSize, sortBy);

    return NextResponse.json({
      data:     articles,
      total,
      page,
      pageSize,
      hasMore:  page * pageSize < total,
    });
  } catch (err) {
    console.error('[/api/articles/search]', err);
    return NextResponse.json(
      { message: 'Erreur de recherche' },
      { status: 500 }
    );
  }
}