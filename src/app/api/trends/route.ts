import { NextRequest, NextResponse } from 'next/server';
import { fetchTopHeadlines } from '@/lib/api/newsapi';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { articles } = await fetchTopHeadlines('monde', 1, 20);

    return NextResponse.json({
      topics:   [],
      articles,
    });
  } catch (err) {
    console.error('[/api/trends]', err);
    return NextResponse.json({ topics: [], articles: [] });
  }
}