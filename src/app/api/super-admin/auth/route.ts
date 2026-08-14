import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/utils/prisma';
import { signSession } from '@/lib/jwt';
import { isRateLimited, recordFailure, resetAttempts } from '@/lib/rateLimit';

function getClientKey(req: NextRequest, employeeCode: string) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  return `super-admin:${employeeCode.toLowerCase()}:${ip}`;
}

export async function POST(req: NextRequest) {
  try {
    const { employeeCode, password } = await req.json();
    if (typeof employeeCode !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const code = employeeCode.trim();
    if (!code || !password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const key = getClientKey(req, code);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Try again later.' },
        { status: 429 },
      );
    }

    const admin = await prisma.user.findUnique({ where: { employeeCode: code } });
    if (
      !admin ||
      admin.role !== 'SUPER_ADMIN' ||
      admin.status !== 'APPROVED' ||
      !(await bcrypt.compare(password, admin.passwordHash))
    ) {
      recordFailure(key);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    resetAttempts(key);
    const token = signSession({
      id: admin.id,
      employeeCode: admin.employeeCode,
      accountType: 'SUPER_ADMIN',
    });
    return NextResponse.json({
      token,
      user: { employeeCode: admin.employeeCode, accountType: 'SUPER_ADMIN' },
    });
  } catch (error) {
    console.error('Super-admin auth error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
