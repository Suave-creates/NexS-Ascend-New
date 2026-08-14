// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { signSession } from '@/lib/jwt';
import { isRateLimited, recordFailure, resetAttempts } from '@/lib/rateLimit';

function getClientKey(req: NextRequest, employeeCode: string) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  return `${employeeCode.toLowerCase()}:${ip}`;
}

export async function POST(req: NextRequest) {
  try {
    const { employeeCode, password } = await req.json();

    if (typeof employeeCode !== 'string' || typeof password !== 'string' || !employeeCode || !password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const key = getClientKey(req, employeeCode);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Try again later.' },
        { status: 429 }
      );
    }

    // 1) Look up the user by their employee code
    const user = await prisma.user.findUnique({
      where: { employeeCode },
    });
    if (!user) {
      recordFailure(key);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 2) Compare the incoming password with the hashed one in the database
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      recordFailure(key);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.status !== 'APPROVED') {
      const error = user.status === 'PENDING'
        ? 'Your account is awaiting super-admin approval'
        : 'Your account request was rejected. Please contact a super admin.';
      return NextResponse.json({ error }, { status: 403 });
    }

    // 3) Success — issue a session JWT (2h sliding expiry, see src/lib/jwt.ts)
    resetAttempts(key);
    const token = signSession({
      id: user.id,
      employeeCode: user.employeeCode,
      accountType: user.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'OPERATOR',
    });
    return NextResponse.json({
      token,
      user: {
        employeeCode: user.employeeCode,
        accountType: user.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'OPERATOR',
      },
    });
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
