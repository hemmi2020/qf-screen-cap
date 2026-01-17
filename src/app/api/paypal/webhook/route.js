import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const eventType = body.event_type;
    
    console.log('PayPal Webhook:', eventType);

    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscription = body.resource;
      const userEmail = subscription.subscriber.email_address;
      
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      });

      if (user) {
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            status: 'ACTIVE',
            paypalSubscriptionId: subscription.id,
            planId: subscription.plan_id,
          },
          create: {
            userId: user.id,
            paypalSubscriptionId: subscription.id,
            status: 'ACTIVE',
            planId: subscription.plan_id,
          }
        });
        console.log('Subscription activated for user:', userEmail);
      }
    }

    if (eventType === 'BILLING.SUBSCRIPTION.RENEWED') {
      const subscription = body.resource;
      
      await prisma.subscription.updateMany({
        where: { paypalSubscriptionId: subscription.id },
        data: { status: 'ACTIVE', updatedAt: new Date() }
      });
      console.log('Subscription renewed:', subscription.id);
    }

    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || 
        eventType === 'BILLING.SUBSCRIPTION.SUSPENDED' ||
        eventType === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const subscription = body.resource;
      
      await prisma.subscription.updateMany({
        where: { paypalSubscriptionId: subscription.id },
        data: { status: eventType.split('.')[2] }
      });
      console.log('Subscription status updated:', eventType);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
