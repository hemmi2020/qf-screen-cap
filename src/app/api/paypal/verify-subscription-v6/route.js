// src/app/api/paypal/verify-subscription-v6/route.js

export async function POST(request) {
  try {
    const { subscriptionId, orderID } = await request.json();
    
    if (!subscriptionId) {
      return Response.json({ 
        success: false,
        error: 'Subscription ID required' 
      }, { status: 400 });
    }

    // Get access token
    const accessToken = await getPayPalAccessToken();
    
    // Get subscription details from PayPal
    const response = await fetch(
      `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('PayPal verification failed:', await response.text());
      return Response.json({ 
        success: false,
        error: 'Failed to verify subscription with PayPal' 
      }, { status: 500 });
    }

    const subscriptionData = await response.json();
    
    console.log('Subscription verified:', {
      id: subscriptionData.id,
      status: subscriptionData.status,
      planId: subscriptionData.plan_id
    });

    // TODO: Store in your database
    // await db.subscription.create({
    //   subscriptionId: subscriptionData.id,
    //   userId: session.user.id, // If you have auth
    //   planId: subscriptionData.plan_id,
    //   status: subscriptionData.status.toLowerCase(),
    //   subscriberEmail: subscriptionData.subscriber.email_address,
    //   createdAt: new Date(),
    //   nextBillingTime: subscriptionData.billing_info?.next_billing_time
    // });
    
    return Response.json({ 
      success: true,
      subscription: {
        id: subscriptionData.id,
        status: subscriptionData.status,
        planId: subscriptionData.plan_id,
        subscriber: subscriptionData.subscriber,
        nextBillingTime: subscriptionData.billing_info?.next_billing_time,
        startTime: subscriptionData.start_time
      }
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
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

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

function getPayPalBaseUrl() {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}