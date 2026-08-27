// src/app/api/auth/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { employeeCode, password } = await req.json();

    // 1) Look up the user by their employee code
    const user = await prisma.user.findUnique({
      where: { employeeCode },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 2) Compare the incoming password with the hashed one in the database
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 3) Issue the shared app session used by protected API routes.
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('Auth error: JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
    }

    // Project-native browser session. API middleware verifies this signed,
    // httpOnly cookie; credentials and tokens never enter client storage.
    const token = jwt.sign(
      { id: user.id, employeeCode: user.employeeCode },
      secret,
      { expiresIn: '8h' },
    );
    const response = NextResponse.json({ message: 'Authenticated' });
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.AUTH_COOKIE_SECURE === 'true'
        || (process.env.AUTH_COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production'),
      path: '/',
      maxAge: 8 * 60 * 60,
    });
    return response;
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
