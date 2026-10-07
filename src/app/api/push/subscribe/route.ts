import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { saveSubscription } from '@/lib/db/subscriptions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    const { userId } = verifyToken(auth.slice(7));
    const subscription = await req.json();
    await saveSubscription(userId, subscription);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/push/subscribe]', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}