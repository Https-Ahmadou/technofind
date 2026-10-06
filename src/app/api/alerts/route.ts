import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { getUserAlerts, createAlert } from '@/lib/db/alerts';

export const dynamic = 'force-dynamic';

function getUserId(req: NextRequest): string | null {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    const payload = verifyToken(auth.slice(7));
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const alerts = await getUserAlerts(userId);
    return NextResponse.json({
      data: alerts.map(a => ({
        id:        a._id?.toString(),
        keyword:   a.keyword,
        category:  a.category,
        frequency: a.frequency,
        active:    a.active,
        createdAt: a.createdAt,
      }))
    });
  } catch (err) {
    console.error('[GET /api/alerts]', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { keyword, category, frequency = 'daily' } = body;

    if (!keyword?.trim()) {
      return NextResponse.json({ message: 'Mot-clé requis' }, { status: 400 });
    }

    // Max 20 alertes par utilisateur
    const existing = await getUserAlerts(userId);
    if (existing.length >= 20) {
      return NextResponse.json(
        { message: 'Maximum 20 alertes atteint' },
        { status: 400 }
      );
    }

    const alert = await createAlert({
      userId,
      keyword:   keyword.trim(),
      category,
      frequency,
      active:    true,
    });

    return NextResponse.json({
      id:        alert._id?.toString(),
      keyword:   alert.keyword,
      category:  alert.category,
      frequency: alert.frequency,
      active:    alert.active,
      createdAt: alert.createdAt,
    }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/alerts]', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}