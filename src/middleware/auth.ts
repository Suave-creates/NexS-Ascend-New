// src/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends NextRequest {
  user: { id: number; employeeCode: string };
}

type Handler<TParams extends Record<string, string>> = (
  req: AuthenticatedRequest,
  context: { params: TParams }
) => Promise<NextResponse>;

export function authMiddleware<TParams extends Record<string, string>>(
  handler: Handler<TParams>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<TParams> }
  ): Promise<NextResponse> => {
    // 1️⃣ Await the incoming params
    const params = await context.params;

    // 2️⃣ Do your usual auth check
    const authHeader = req.headers.get('authorization');
    const rawToken =
      authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : req.cookies.get('token')?.value;

    if (!rawToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(rawToken, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const authReq = req as AuthenticatedRequest;
    authReq.user = {
      id: payload.id,
      employeeCode: payload.employeeCode,
    };

    // 3️⃣ Call your handler with the resolved params
    return handler(authReq, { params });
  };
}
