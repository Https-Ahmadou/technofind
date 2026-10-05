import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET      = process.env.JWT_SECRET || 'dev_secret_change_in_prod_min32chars!!';
const JWT_EXPIRES_IN  = '15m';
const REFRESH_EXPIRES = '30d';

export interface JwtPayload {
  userId: string;
  email:  string;
  plan:   'free' | 'premium';
}

export function signAccessToken(payload: JwtPayload): string {
  const opts: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function signRefreshToken(payload: Pick<JwtPayload, 'userId'>): string {
  const opts: SignOptions = { expiresIn: REFRESH_EXPIRES };
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
