'use client';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-12 text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[hsl(0_84%_60%/0.2)] flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-[hsl(0_84%_60%)]" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Subscription Cancelled</h1>
        
        <p className="text-lg text-[hsl(215_20%_55%)] mb-8">
          No charges were made.
        </p>

        <Link href="/#pricing" className="btn-primary px-6 py-3 rounded-xl">
          View Plans Again
        </Link>
      </div>
    </div>
  );
}