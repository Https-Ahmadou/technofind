import { NextRequest, NextResponse } from 'next/server';
import { fetchTopHeadlines } from '@/lib/api/newsapi';
import { ArticleCategory } from '@/types';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: ArticleCategory[] = [
  'politique', 'economie', 'technologie', 'sport',
  'science', 'sante', 'culture', 'environnement', 'monde', 'societe'
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawCat   = searchParams.get('category') || 'monde';
    const category = VALID_CATEGORIES.includes(rawCat as ArticleCategory)
      ? rawCat as ArticleCategory
      : 'monde';
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(20, parseInt(searchParams.get('pageSize') || '20'));

    console.log(`[feed] category=${category} page=${page}`);

    const { articles, total } = await fetchTopHeadlines(category, page, pageSize);

    console.log(`[feed] got ${articles.length} articles`);

    return NextResponse.json({
      data:     articles,
      total,
      page,
      pageSize,
      hasMore:  page * pageSize < total,
    });
  } catch (error) {
    console.error('[/api/feed]', error);
    return NextResponse.json(
      { data: [], total: 0, page: 1, pageSize: 20, hasMore: false },
      { status: 200 }
    );
  }
}