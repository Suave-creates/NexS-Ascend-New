import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { verifyAdminAccessToken } from '@/services/metal-frame/tumbling/adminAccess';
import { resetPortalUserPassword } from '@/services/metal-frame/tumbling/userAdmin.service';
import { validatePassword } from '@/services/metal-frame/tumbling/validators';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';

export const dynamic = 'force-dynamic';

// PATCH /api/metal-frame/tumbling/admin-users/[employeeCode] -> reset a portal user's password (gated by TUMBLING_ADMIN_TOKEN)
export const PATCH = authMiddleware<{ employeeCode: string }>(async (req: Request, { params }: { params: { employeeCode: string } }) => {
  try {
    verifyAdminAccessToken(req.headers.get('x-tumbling-admin-token'));
    const { employeeCode } = params;
    const body = await req.json();
    const password = validatePassword(body.password);

    const user = await resetPortalUserPassword(employeeCode, password);
    return NextResponse.json({ user });
  } catch (err) {
    return handleRouteError('Tumbling admin user password reset', err);
  }
});
