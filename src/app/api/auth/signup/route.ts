// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { isRateLimited, recordFailure } from '@/lib/rateLimit';

const MIN_PASSWORD_LENGTH = 6;

function getClientKey(req: NextRequest, employeeCode: string) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  return `signup:${employeeCode.toLowerCase()}:${ip}`;
}

export async function POST(req: NextRequest) {
  try {
    const { employeeCode, password } = await req.json();

    if (typeof employeeCode !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const code = employeeCode.trim();
    if (!code || code.length > 64) {
      return NextResponse.json({ error: 'Employee code is required' }, { status: 400 });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const key = getClientKey(req, code);
    if (isRateLimited(key)) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again later.' },
        { status: 429 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { employeeCode: code },
      select: { status: true },
    });
    if (existingUser) {
      recordFailure(key);
      const error = existingUser.status === 'PENDING'
        ? 'Your signup request is already awaiting approval'
        : existingUser.status === 'REJECTED'
          ? 'This signup request was rejected. Please contact a super admin.'
          : 'An account with this employee code already exists';
      return NextResponse.json(
        { error },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { employeeCode: code, passwordHash, status: 'PENDING' },
    });

    return NextResponse.json(
      {
        status: 'PENDING',
        message: 'Signup request submitted. You can sign in after a super admin approves it.',
      },
      { status: 202 },
    );
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
