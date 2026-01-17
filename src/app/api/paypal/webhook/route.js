import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);
    
    console.log('📨 PayPal Webhook Event:', event.event_type);
    
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        console.log('✅ Subscription created:', event.resource.id);
        break;
        
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event);
        break;
        
      case 'BILLING.SUBSCRIPTION.UPDATED':
        await handleSubscriptionUpdated(event);
        break;
        
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event);
        break;
        
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(event);
        break;
        
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(event);
        break;
        
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
        await handlePaymentFailed(event);
        break;
        
      case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
        await handleSubscriptionReactivated(event);
        break;
        
      default:
        console.log('Unhandled event type:', event.event_type);
    }
    
    return Response.json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function handleSubscriptionActivated(event) {
  const subscriptionId = event.resource.id;
  const subscriberEmail = event.resource.subscriber?.email_address;
  const planId = event.resource.plan_id;
  
  console.log('✅ Subscription activated:', subscriptionId);
  
  const user = await prisma.user.findUnique({
    where: { email: subscriberEmail }
  });

  if (user) {
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        status: 'ACTIVE',
        paypalSubscriptionId: subscriptionId,
        planId: planId,
      },
      create: {
        userId: user.id,
        paypalSubscriptionId: subscriptionId,
        status: 'ACTIVE',
        planId: planId,
      }
    });
  }
}

async function handleSubscriptionUpdated(event) {
  const subscriptionId = event.resource.id;
  console.log('📝 Subscription updated:', subscriptionId);
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: { updatedAt: new Date() }
  });
}

async function handleSubscriptionCancelled(event) {
  const subscriptionId = event.resource.id;
  console.log('❌ Subscription cancelled:', subscriptionId);
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: { status: 'CANCELLED' }
  });
}

async function handleSubscriptionSuspended(event) {
  const subscriptionId = event.resource.id;
  console.log('⚠️  Subscription suspended:', subscriptionId);
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: { status: 'SUSPENDED' }
  });
}

async function handleSubscriptionExpired(event) {
  const subscriptionId = event.resource.id;
  console.log('⏰ Subscription expired:', subscriptionId);
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: { status: 'EXPIRED' }
  });
}

async function handlePaymentFailed(event) {
  const subscriptionId = event.resource.id;
  console.log('❌ Payment failed:', subscriptionId);
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: { status: 'SUSPENDED' }
  });
}

async function handleSubscriptionReactivated(event) {
  const subscriptionId = event.resource.id;
  console.log('🔄 Subscription re-activated:', subscriptionId);
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: { status: 'ACTIVE' }
  });
}
