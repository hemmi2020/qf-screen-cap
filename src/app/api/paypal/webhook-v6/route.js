// src/app/api/paypal/webhook-v6/route.js

export async function POST(request) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);
    
    console.log('📨 PayPal Webhook Event:', event.event_type);
    
    // TODO: In production, verify webhook signature
    // const isValid = await verifyWebhookSignature(request, body);
    // if (!isValid) {
    //   return Response.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event);
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
        
      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(event);
        break;
        
      case 'PAYMENT.SALE.REFUNDED':
        await handlePaymentRefunded(event);
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

async function handleSubscriptionCreated(event) {
  const subscriptionId = event.resource.id;
  const subscriberEmail = event.resource.subscriber?.email_address;
  const planId = event.resource.plan_id;
  
  console.log('✅ Subscription created:', subscriptionId);
  
  // TODO: Store in database
  // await db.subscription.create({
  //   data: {
  //     subscriptionId,
  //     userEmail: subscriberEmail,
  //     planId,
  //     status: 'created',
  //     createdAt: new Date()
  //   }
  // });
}

async function handleSubscriptionActivated(event) {
  const subscriptionId = event.resource.id;
  const subscriberEmail = event.resource.subscriber?.email_address;
  
  console.log('✅ Subscription activated:', subscriptionId);
  
  // TODO: Update database
  // await db.subscription.update({
  //   where: { subscriptionId },
  //   data: { 
  //     status: 'active',
  //     activatedAt: new Date()
  //   }
  // });
  
  // TODO: Send welcome email
  // await sendEmail({
  //   to: subscriberEmail,
  //   subject: 'Welcome to QF ScreenCap!',
  //   template: 'welcome',
  //   data: { subscriptionId }
  // });
}

async function handleSubscriptionUpdated(event) {
  const subscriptionId = event.resource.id;
  
  console.log('📝 Subscription updated:', subscriptionId);
  
  // TODO: Update database with new details
}

async function handleSubscriptionCancelled(event) {
  const subscriptionId = event.resource.id;
  const reason = event.resource.status_change_note;
  
  console.log('❌ Subscription cancelled:', subscriptionId, reason);
  
  // TODO: Update database
  // await db.subscription.update({
  //   where: { subscriptionId },
  //   data: { 
  //     status: 'cancelled',
  //     cancelledAt: new Date(),
  //     cancelReason: reason
  //   }
  // });
  
  // TODO: Send cancellation email
}

async function handleSubscriptionSuspended(event) {
  const subscriptionId = event.resource.id;
  
  console.log('⚠️  Subscription suspended:', subscriptionId);
  
  // TODO: Update database
  // await db.subscription.update({
  //   where: { subscriptionId },
  //   data: { status: 'suspended' }
  // });
  
  // TODO: Notify user to update payment method
}

async function handleSubscriptionExpired(event) {
  const subscriptionId = event.resource.id;
  
  console.log('⏰ Subscription expired:', subscriptionId);
  
  // TODO: Update database
  // await db.subscription.update({
  //   where: { subscriptionId },
  //   data: { 
  //     status: 'expired',
  //     expiredAt: new Date()
  //   }
  // });
}

async function handlePaymentCompleted(event) {
  const subscriptionId = event.resource.billing_agreement_id;
  const amount = event.resource.amount.total;
  const currency = event.resource.amount.currency;
  
  console.log('💰 Payment completed:', subscriptionId, amount, currency);
  
  // TODO: Record payment
  // await db.payment.create({
  //   data: {
  //     subscriptionId,
  //     amount: parseFloat(amount),
  //     currency,
  //     status: 'completed',
  //     paypalTransactionId: event.resource.id,
  //     paidAt: new Date()
  //   }
  // });
  
  // TODO: Reset usage limits if applicable
}

async function handlePaymentRefunded(event) {
  const transactionId = event.resource.sale_id;
  const refundAmount = event.resource.amount.total;
  
  console.log('💸 Payment refunded:', transactionId, refundAmount);
  
  // TODO: Update payment record
  // await db.payment.update({
  //   where: { paypalTransactionId: transactionId },
  //   data: { 
  //     status: 'refunded',
  //     refundedAmount: parseFloat(refundAmount),
  //     refundedAt: new Date()
  //   }
  // });
}

// Optional: Verify webhook signature for production
async function verifyWebhookSignature(request, body) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) return true; // Skip verification in development
    
    const headers = {
      'transmission-id': request.headers.get('paypal-transmission-id'),
      'transmission-time': request.headers.get('paypal-transmission-time'),
      'cert-url': request.headers.get('paypal-cert-url'),
      'auth-algo': request.headers.get('paypal-auth-algo'),
      'transmission-sig': request.headers.get('paypal-transmission-sig')
    };
    
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(
      `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transmission_id: headers['transmission-id'],
          transmission_time: headers['transmission-time'],
          cert_url: headers['cert-url'],
          auth_algo: headers['auth-algo'],
          transmission_sig: headers['transmission-sig'],
          webhook_id: webhookId,
          webhook_event: JSON.parse(body)
        })
      }
    );
    
    const result = await response.json();
    return result.verification_status === 'SUCCESS';
    
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

function getPayPalBaseUrl() {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}