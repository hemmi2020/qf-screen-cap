import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';

  if (type === 'revenue') {
    const subscriptions = await prisma.subscription.findMany({
      where: { status: 'ACTIVE' },
      select: { planId: true, createdAt: true }
    });

    const monthlyRevenue = subscriptions.reduce((acc, sub) => {
      const month = new Date(sub.createdAt).toISOString().slice(0, 7);
      const amount = sub.planId.includes('basic') ? 10 : 100;
      acc[month] = (acc[month] || 0) + amount;
      return acc;
    }, {});

    return Response.json({ monthlyRevenue });
  }

  if (type === 'growth') {
    const users = await prisma.user.findMany({
      select: { createdAt: true }
    });

    const userGrowth = users.reduce((acc, user) => {
      const month = new Date(user.createdAt).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Response.json({ userGrowth });
  }

  const [totalUsers, totalSubs, activeSubs, cancelledSubs] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { status: 'CANCELLED' } })
  ]);

  const conversionRate = totalUsers > 0 ? ((totalSubs / totalUsers) * 100).toFixed(2) : 0;
  const churnRate = totalSubs > 0 ? ((cancelledSubs / totalSubs) * 100).toFixed(2) : 0;

  return Response.json({
    conversionRate,
    churnRate,
    activeSubs,
    cancelledSubs
  });
}
