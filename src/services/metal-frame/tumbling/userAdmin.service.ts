import bcrypt from 'bcryptjs';
import prisma from '@/utils/prisma';
import { TumblingError } from './types';

const SALT_ROUNDS = 10;

export interface PortalUserSummary {
  id: number;
  employeeCode: string;
  createdAt: Date;
}

/**
 * Manages rows in the portal-wide `User` table (schema.prisma) — the same
 * store the login screen and Tumbling's Complete Early/Stop/Settings
 * authorization check against. Never returns passwordHash.
 */
export async function listPortalUsers(): Promise<PortalUserSummary[]> {
  return prisma.user.findMany({
    select: { id: true, employeeCode: true, createdAt: true },
    orderBy: { employeeCode: 'asc' },
  });
}

export async function createPortalUser(employeeCode: string, password: string): Promise<PortalUserSummary> {
  const existing = await prisma.user.findUnique({ where: { employeeCode } });
  if (existing) throw new TumblingError(409, 'This employee code already has an account.');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { employeeCode, passwordHash } });
  return { id: user.id, employeeCode: user.employeeCode, createdAt: user.createdAt };
}

export async function resetPortalUserPassword(employeeCode: string, password: string): Promise<PortalUserSummary> {
  const existing = await prisma.user.findUnique({ where: { employeeCode } });
  if (!existing) throw new TumblingError(404, 'No account found for this employee code.');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.update({ where: { employeeCode }, data: { passwordHash } });
  return { id: user.id, employeeCode: user.employeeCode, createdAt: user.createdAt };
}
