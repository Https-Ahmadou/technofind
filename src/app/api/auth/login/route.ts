import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword } from '@/lib/db/users';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { loginSchema } from '@/lib/validators/auth';

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Trouver l'utilisateur
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const userId = user._id!.toString();

    const accessToken  = signAccessToken({ userId, email: user.email, plan: user.plan });
    const refreshToken = signRefreshToken({ userId });

    const res = NextResponse.json({
      user: {
        id:          userId,
        name:        user.name,
        email:       user.email,
        plan:        user.plan,
        language:    user.language,
        createdAt:   user.createdAt,
        preferences: user.preferences,
      },
      tokens: { accessToken, refreshToken, expiresIn: 900 },
    });

    res.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   30 * 24 * 60 * 60,
      path:     '/api/auth',
    });

    return res;
  } catch (err) {
    console.error('[/api/auth/login]', err);
    return NextResponse.json(
      { message: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
