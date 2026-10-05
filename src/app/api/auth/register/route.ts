import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db/users';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { registerSchema } from '@/lib/validators/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('BODY REÇU:', JSON.stringify(body));
    
    const parsed = registerSchema.safeParse(body);
    console.log('VALIDATION:', parsed.success, !parsed.success && parsed.error.issues);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà.' },
        { status: 409 }
      );
    }

    const user = await createUser({ name, email, password });

    const accessToken = signAccessToken({
      userId: user._id!,
      email:  user.email,
      plan:   user.plan,
    });
    const refreshToken = signRefreshToken({ userId: user._id! });

    const res = NextResponse.json({
      user: {
        id:          user._id,
        name:        user.name,
        email:       user.email,
        plan:        user.plan,
        language:    user.language,
        createdAt:   user.createdAt,
        preferences: user.preferences,
      },
      tokens: { accessToken, refreshToken, expiresIn: 900 },
    }, { status: 201 });

    res.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   30 * 24 * 60 * 60,
      path:     '/api/auth',
    });

    return res;
  } catch (err) {
    console.error('[/api/auth/register]', err);
    return NextResponse.json(
      { message: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}