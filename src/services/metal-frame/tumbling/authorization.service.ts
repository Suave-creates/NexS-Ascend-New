import bcrypt from 'bcryptjs';
import prisma from '@/utils/prisma';
import { AuthorizationInput, AuthorizedActor, TumblingError } from './types';

/**
 * Verifies an employeeCode/password pair against the portal's existing
 * User/bcrypt credential store. This is the only place a password is ever
 * read — it is never logged, stored, or echoed back. Any valid registered
 * user may authorize Complete Early / Stop / Settings changes; the portal
 * has no role/permission tiers to check beyond "is this a real account."
 */
export async function verifyAuthorization(input: AuthorizationInput): Promise<AuthorizedActor> {
  const employeeCode = input.employeeCode?.trim();
  const password = input.password;

  if (!employeeCode || !password) {
    throw new TumblingError(400, 'Authorized user ID and password are required.');
  }

  const user = await prisma.user.findUnique({ where: { employeeCode } });
  const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !passwordOk) {
    throw new TumblingError(401, 'Authorization failed.');
  }

  return { userId: user.id, employeeCode: user.employeeCode, nameSnapshot: user.employeeCode };
}
