import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { updateAlert, deleteAlert } from '@/lib/db/alerts';

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    const body = await req.json();
    await updateAlert(params.id, userId, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/alerts/[id]]', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    }
    await deleteAlert(params.id, userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/alerts/[id]]', err);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}