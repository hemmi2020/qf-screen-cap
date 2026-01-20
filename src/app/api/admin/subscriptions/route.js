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
  const status = searchParams.get('status');
  const plan = searchParams.get('plan');
  const search = searchParams.get('search');

  const where = {
    ...(status && { status }),
    ...(plan && { planId: { contains: plan, mode: 'insensitive' } }),
    ...(search && {
      OR: [
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { paypalSubscriptionId: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      include: { user: { select: { email: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.subscription.count({ where })
  ]);

  return Response.json({ subscriptions, total, page, pages: Math.ceil(total / limit) });
}
