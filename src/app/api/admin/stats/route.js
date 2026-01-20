import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const [totalUsers, activeSubscriptions, totalSearches, subscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.search.count(),
    prisma.subscription.findMany({ where: { status: 'ACTIVE' } })
  ]);

  const revenue = subscriptions.reduce((sum, sub) => {
    return sum + (sub.planId.includes('basic') ? 10 : 100);
  }, 0);

  return Response.json({
    totalUsers,
    activeSubscriptions,
    totalSearches,
    revenue
  });
}
