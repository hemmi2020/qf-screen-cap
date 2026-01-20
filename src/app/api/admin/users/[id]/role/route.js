import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';
import { logAdminAction, AdminActions } from '@/lib/auditLog';

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const { role } = await request.json();

  if (!['user', 'admin'].includes(role)) {
    return Response.json({ error: 'Invalid role' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { email: true, role: true }
  });

  await prisma.user.update({
    where: { id: params.id },
    data: { role }
  });

  await logAdminAction(
    auth.user.id,
    AdminActions.CHANGE_ROLE,
    params.id,
    { email: user?.email, oldRole: user?.role, newRole: role },
    request.headers.get('x-forwarded-for')
  );

  return Response.json({ success: true });
}
