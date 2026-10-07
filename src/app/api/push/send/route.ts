import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { getUserSubscriptions, deleteSubscription } from '@/lib/db/subscriptions';
import webpush from '@/lib/webpush';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    const { userId } = verifyToken(auth.slice(7));
    const { title, body, url } = await req.json();

    const subscriptions = await getUserSubscriptions(userId);

    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify({ title, body, url: url || '/' })
        ).catch(async (err) => {
          // Supprimer les subscriptions expirées
          if (err.statusCode === 410) {
            await deleteSubscription(sub.endpoint);
          }
          throw err;
        })
      )
    );

    const sent   = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({ sent, failed });
  } catch (err) {
    console.error('[POST /api/push/send]', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}