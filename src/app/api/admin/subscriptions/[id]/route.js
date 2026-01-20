import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true, name: true } } }
  });

  if (!subscription) {
    return Response.json({ error: 'Subscription not found' }, { status: 404 });
  }

  return Response.json(subscription);
}
