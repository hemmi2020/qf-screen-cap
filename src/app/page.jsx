'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Crown, Shield } from 'lucide-react';
import Hero from './components/Hero';
import RecorderTool from './components/RecorderTool';
import Features from './components/Features';
import PricingV6 from './components/PricingV6';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/subscription/status')
        .then(res => res.json())
        .then(data => setSubscription(data.subscription))
        .catch(err => console.error('Failed to fetch subscription:', err));
      
      fetch('/api/admin/verify')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin))
        .catch(err => console.error('Failed to verify admin:', err));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[hsl(187_92%_55%/0.2)] border-t-[hsl(187_92%_55%)] animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[hsl(222_47%_18%/0.9)] border-b border-[hsl(222_47%_30%/0.6)] h-[72px]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/QFN-final-logo-black-line.-Edit.svg" alt="QF Logo" width={56} height={56} className="rounded-xl" />
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[hsl(187_92%_65%)] to-[hsl(280_70%_70%)] bg-clip-text text-transparent">QF ScreenCap</span>
          </Link>

          <div className="flex items-center gap-4">
            <a 
              href="#pricing" 
              className="text-sm font-medium text-[hsl(215_20%_70%)] hover:text-white transition-colors"
            >
              Pricing
            </a>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(280_70%_70%/0.1)] border border-[hsl(280_70%_70%/0.3)] hover:bg-[hsl(280_70%_70%/0.2)] transition-colors"
              >
                <Shield className="w-4 h-4 text-[hsl(280_70%_70%)]" />
                <span className="text-xs font-medium text-[hsl(280_70%_70%)]">Admin Panel</span>
              </Link>
            )}
            {subscription?.status === 'ACTIVE' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(187_92%_55%/0.1)] border border-[hsl(187_92%_55%/0.3)]">
                <Crown className="w-4 h-4 text-[hsl(187_92%_55%)]" />
                <span className="text-xs font-medium text-[hsl(187_92%_55%)]">Active</span>
              </div>
            )}
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{session.user?.name || 'User'}</p>
              <p className="text-xs text-[hsl(215_20%_70%)]">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(222_47%_22%)] border border-[hsl(222_47%_32%)] hover:border-[hsl(0_84%_60%)] text-[hsl(0_84%_60%)] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Hero />
          <section id="tool" className="mb-24">
            <RecorderTool />
          </section>
          <Features />
          <section id="pricing" className="mt-24">
            <PricingV6 />
          </section>
        </div>
      </main>

      <footer className="border-t border-[hsl(222_47%_30%/0.6)] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[hsl(215_20%_70%)]">© 2026 ScreenCap</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-[hsl(215_20%_70%)] hover:text-white">Privacy</a>
            <a href="#" className="text-sm text-[hsl(215_20%_70%)] hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
