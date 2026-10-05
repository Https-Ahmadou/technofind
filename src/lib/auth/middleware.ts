import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
      }
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      return handler(req, payload.userId);
    } catch {
      return NextResponse.json({ message: 'Token invalide ou expiré' }, { status: 401 });
    }
  };
}
