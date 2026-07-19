import { NextResponse } from 'next/server';
import { verifyAdminAccessToken } from '@/services/metal-frame/tumbling/adminAccess';
import { createPortalUser, listPortalUsers } from '@/services/metal-frame/tumbling/userAdmin.service';
import { validateEmployeeCode, validatePassword } from '@/services/metal-frame/tumbling/validators';
import { handleRouteError } from '@/services/metal-frame/tumbling/http';

export const dynamic = 'force-dynamic';

// GET /api/metal-frame/tumbling/admin-users -> list portal users (gated by TUMBLING_ADMIN_TOKEN)
export async function GET(req: Request) {
  try {
    verifyAdminAccessToken(req.headers.get('x-tumbling-admin-token'));
    const users = await listPortalUsers();
    return NextResponse.json({ users });
  } catch (err) {
    return handleRouteError('Tumbling admin users list', err);
  }
}

// POST /api/metal-frame/tumbling/admin-users -> create a new portal user (gated by TUMBLING_ADMIN_TOKEN)
export async function POST(req: Request) {
  try {
    verifyAdminAccessToken(req.headers.get('x-tumbling-admin-token'));
    const body = await req.json();
    const employeeCode = validateEmployeeCode(body.employeeCode);
    const password = validatePassword(body.password);

    const user = await createPortalUser(employeeCode, password);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return handleRouteError('Tumbling admin user create', err);
  }
}
