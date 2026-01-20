import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status');

  const where = {
    ...(search && { email: { contains: search, mode: 'insensitive' } }),
    ...(status && { subscription: { status } })
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { subscription: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return Response.json({ users, total, page, pages: Math.ceil(total / limit) });
}

export async function DELETE(request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const { userId } = await request.json();
  await prisma.user.delete({ where: { id: userId } });
  
  return Response.json({ success: true });
}

export async function PATCH(request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const { userId, role } = await request.json();
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  });
  
  return Response.json({ success: true });
}
