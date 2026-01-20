import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';
import { logAdminAction, AdminActions } from '@/lib/auditLog';

export async function POST(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true } } }
  });

  if (!subscription) {
    return Response.json({ error: 'Subscription not found' }, { status: 404 });
  }

  // Update subscription status to CANCELLED
  await prisma.subscription.update({
    where: { id: params.id },
    data: { status: 'CANCELLED' }
  });

  await logAdminAction(
    auth.user.id,
    AdminActions.CANCEL_SUBSCRIPTION,
    params.id,
    { 
      userEmail: subscription.user.email,
      paypalSubscriptionId: subscription.paypalSubscriptionId,
      planId: subscription.planId
    },
    request.headers.get('x-forwarded-for')
  );

  // TODO: Call PayPal API to cancel subscription on their end
  // const paypal = require('@paypal/checkout-server-sdk');
  // Cancel subscription via PayPal API using subscription.paypalSubscriptionId

  return Response.json({ success: true });
}
