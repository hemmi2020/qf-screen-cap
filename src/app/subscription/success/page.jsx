'use client';
import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  
  // Get subscription ID directly without state
  const subscriptionId = searchParams.get('subscription_id');

  if (!subscriptionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-[hsl(187_92%_55%)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-12 text-center max-w-2xl">
        <div className="w-20 h-20 rounded-full bg-[hsl(142_76%_36%/0.2)] flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-[hsl(142_76%_36%)]" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Subscription Activated!
        </h1>
        
        <p className="text-lg text-[hsl(215_20%_55%)] mb-8">
          Welcome to QF ScreenCap! Your subscription is now active.
        </p>

        {subscriptionId && (
          <div className="glass-card rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-[hsl(215_20%_55%)]">
              Subscription ID: <span className="font-mono text-xs">{subscriptionId}</span>
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/#tool" className="btn-primary px-8 py-4 rounded-xl font-semibold">
            Start Using App
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-[hsl(187_92%_55%)]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}