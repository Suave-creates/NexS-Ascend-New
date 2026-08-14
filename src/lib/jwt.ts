import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Sliding session: every authenticated request re-signs a fresh token with a
// full 2h window (see authMiddleware). 2h of inactivity lets the old token's
// own exp lapse, which jwt.verify rejects naturally — no session store needed.
const SESSION_TTL = '2h';

export interface SessionUser {
  id: number;
  employeeCode: string;
  accountType: 'OPERATOR' | 'SUPER_ADMIN';
}

export function signSession(user: SessionUser): string {
  return jwt.sign(
    { id: user.id, employeeCode: user.employeeCode, accountType: user.accountType },
    JWT_SECRET as string,
    {
      expiresIn: SESSION_TTL,
    },
  );
}

export function verifySession(token: string): SessionUser {
  const decoded = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;
  if (typeof decoded.id !== 'number' || typeof decoded.employeeCode !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid session payload');
  }

  // Tokens issued before the approval feature did not carry accountType. They
  // remain valid operator sessions until their normal two-hour expiry.
  const accountType = decoded.accountType === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'OPERATOR';
  return { id: decoded.id, employeeCode: decoded.employeeCode, accountType };
}

export const TokenExpiredError = jwt.TokenExpiredError;
