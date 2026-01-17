'use client';
import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Check, Zap, Crown, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'P-8A586020YR476561CNFVM5EY', // ← Your Basic Plan ID
    name: 'Basic',
    price: 10.00, // ← Changed to match your $10 CAD
    icon: Zap,
    color: 'hsl(187_92%_55%)',
    features: [
      '100 screenshots per month',
      '50 screen recordings per month',
      'Full page capture',
      'Standard support',
      'HD quality (1080p)'
    ]
  },
  {
    id: 'P-3YJ923863E6832637NFVM6QY', // ← Your Pro Plan ID
    name: 'Pro',
    price: 100.00, // ← Changed to match your $100 CAD
    icon: Crown,
    color: 'hsl(280_70%_60%)',
    popular: true,
    features: [
      'Unlimited screenshots',
      'Unlimited recordings',
      'Multi-page recording',
      'Priority support',
      '4K quality support',
      'Custom branding'
    ]
  }
];

function PayPalSubscribeButton({ planId, planName }) {
  const [error, setError] = useState('');

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 p-3 rounded-lg bg-[hsl(0_84%_60%/0.1)] border border-[hsl(0_84%_60%/0.3)]">
          <p className="text-xs text-[hsl(0_84%_60%)]">{error}</p>
        </div>
      )}
      
      <PayPalButtons
        fundingSource={undefined}
        style={{
          layout: 'vertical',
          shape: 'rect',
          height: 50,
          tagline: false,
        }}
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: planId,
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch('/api/paypal/verify-subscription-v6', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                subscriptionId: data.subscriptionID,
                orderID: data.orderID 
              })
            });

            const result = await response.json();
            
            if (result.success) {
              window.location.href = `/subscription/success?subscription_id=${data.subscriptionID}`;
            } else {
              setError('Failed to verify subscription. Please contact support.');
            }
          } catch (err) {
            setError('Error verifying subscription: ' + err.message);
          }
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
          setError('PayPal error occurred. Please try again.');
        }}
        onCancel={() => {
          setError('Subscription cancelled. Try again when ready.');
        }}
      />
    </div>
  );
}

export default function PricingV6() {
  return (
    <section id="pricing" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-[hsl(215_20%_55%)] max-w-2xl mx-auto">
          Choose the plan that fits your needs. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`glass-card rounded-2xl p-8 relative ${
              plan.popular ? 'border-2 border-[hsl(280_70%_60%/0.5)] glow-effect' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[hsl(280_70%_60%)] to-[hsl(330_80%_55%)] text-white text-sm font-semibold">
                Most Popular
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${plan.color}20` }}
              >
                <plan.icon className="w-7 h-7" style={{ color: plan.color }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-[hsl(215_20%_55%)]">Perfect for {plan.name === 'Pro' ? 'professionals' : 'individuals'}</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-[hsl(215_20%_55%)]">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[hsl(187_92%_55%/0.2)] flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-[hsl(187_92%_55%)]" />
                  </div>
                  <span className="text-sm text-[hsl(215_20%_70%)]">{feature}</span>
                </li>
              ))}
            </ul>

            <PayPalSubscribeButton planId={plan.id} planName={plan.name} />
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-[hsl(215_20%_55%)]">
          All plans include a 7-day free trial. Cancel anytime, no questions asked.
        </p>
      </div>
    </section>
  );
}