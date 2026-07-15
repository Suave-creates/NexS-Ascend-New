import { NextResponse } from 'next/server';
import { verifyAdminAccessToken } from '@/services/metal-frame/tumbling/adminAccess';
import { resetPortalUserPassword } from '@/services/metal-frame/tumbling/userAdmin.service';
import { validatePassword } from '@/services/metal-frame/tumbling/validators';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';

export const dynamic = 'force-dynamic';

// PATCH /api/metal-frame/tumbling/admin-users/[employeeCode] -> reset a portal user's password (gated by TUMBLING_ADMIN_TOKEN)
export async function PATCH(req: Request, { params }: { params: Promise<{ employeeCode: string }> }) {
  try {
    verifyAdminAccessToken(req.headers.get('x-tumbling-admin-token'));
    const { employeeCode } = await params;
    const body = await req.json();
    const password = validatePassword(body.password);

    const user = await resetPortalUserPassword(employeeCode, password);
    return NextResponse.json({ user });
  } catch (err) {
    return handleRouteError('Tumbling admin user password reset', err);
  }
}
