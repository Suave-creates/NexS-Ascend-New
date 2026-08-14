// src/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { signSession, verifySession, TokenExpiredError, type SessionUser } from '@/lib/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user: SessionUser;
}

type Handler<TParams extends Record<string, string>> = (
  req: AuthenticatedRequest,
  context: { params: TParams }
) => Promise<NextResponse>;

function unauthorized(error: string, code: string) {
  return NextResponse.json({ error, code }, { status: 401 });
}

function withAccountType<TParams extends Record<string, string>>(
  handler: Handler<TParams>,
  requiredAccountType?: SessionUser['accountType'],
) {
  return async (
    req: NextRequest,
    context: { params: Promise<TParams> }
  ): Promise<NextResponse> => {
    const params = await context.params;

    const authHeader = req.headers.get('authorization');
    const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!rawToken) {
      return unauthorized('Unauthorized', 'NO_TOKEN');
    }

    let user: SessionUser;
    try {
      user = verifySession(rawToken);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return unauthorized('Session expired due to inactivity', 'SESSION_EXPIRED');
      }
      return unauthorized('Invalid token', 'INVALID_TOKEN');
    }

    if (requiredAccountType && user.accountType !== requiredAccountType) {
      return NextResponse.json(
        { error: 'You do not have permission to access this resource', code: 'FORBIDDEN' },
        { status: 403 },
      );
    }

    const authReq = req as AuthenticatedRequest;
    authReq.user = user;

    const response = await handler(authReq, { params });

    // Slide the 2h inactivity window forward on every authenticated call.
    // The client picks this up and swaps its in-memory token for it.
    response.headers.set('X-Auth-Token', signSession(user));
    return response;
  };
}

export function authMiddleware<TParams extends Record<string, string>>(
  handler: Handler<TParams>,
) {
  return withAccountType(handler);
}

export function superAdminMiddleware<TParams extends Record<string, string>>(
  handler: Handler<TParams>,
) {
  return withAccountType(handler, 'SUPER_ADMIN');
}
