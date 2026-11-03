import { NextRequest, NextResponse } from 'next/server';
import { createReport } from '@/lib/db/reports';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articleId, articleUrl, articleTitle, reason, details, userId } = body;

    if (!articleId || !reason) {
      return NextResponse.json(
        { message: 'Données manquantes' },
        { status: 400 }
      );
    }

    await createReport({
      articleId,
      articleUrl,
      articleTitle,
      reason,
      details,
      userId,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/reports]', err);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}