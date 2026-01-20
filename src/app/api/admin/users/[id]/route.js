import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';
import { logAdminAction, AdminActions } from '@/lib/auditLog';

export async function GET(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      subscription: true,
      searches: { take: 10, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  await logAdminAction(
    auth.user.id,
    AdminActions.VIEW_USER_DETAILS,
    params.id,
    { email: user.email },
    request.headers.get('x-forwarded-for')
  );

  return Response.json(user);
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { email: true }
  });

  await prisma.user.delete({ where: { id: params.id } });
  
  await logAdminAction(
    auth.user.id,
    AdminActions.DELETE_USER,
    params.id,
    { email: user?.email },
    request.headers.get('x-forwarded-for')
  );
  
  return Response.json({ success: true });
}
