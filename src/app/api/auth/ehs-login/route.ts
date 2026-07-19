// src/app/api/auth/ehs-login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { employeeCode, password } = await req.json();
    // 1) Find user
    const user = await prisma.user.findUnique({ where: { employeeCode } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // 2) Check password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // 3) Sign a JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('⚠️ JWT_SECRET not set in environment');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    const token = jwt.sign(
      { id: user.id, employeeCode: user.employeeCode },
      secret,
      { expiresIn: '2h' }
    );
    // 4) Return it
    return NextResponse.json({ token });
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
