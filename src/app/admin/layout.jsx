'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/verify')
      .then(r => r.json())
      .then(data => {
        if (!data.isAdmin) {
          router.push('/');
        } else {
          setIsAdmin(true);
        }
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[hsl(222_47%_11%)] flex items-center justify-center text-white">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[hsl(222_47%_11%)]">
      <aside className="w-64 bg-[hsl(222_47%_15%)] border-r border-[hsl(222_47%_25%)]">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-[hsl(187_92%_65%)] to-[hsl(280_70%_70%)] bg-clip-text text-transparent">Admin Panel</h1>
        </div>
        <nav className="space-y-1 px-3">
          <Link href="/admin/dashboard" className="block px-3 py-2 rounded text-[hsl(215_20%_70%)] hover:bg-[hsl(222_47%_20%)] hover:text-white transition-colors">Dashboard</Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded text-[hsl(215_20%_70%)] hover:bg-[hsl(222_47%_20%)] hover:text-white transition-colors">Users</Link>
          <Link href="/admin/subscriptions" className="block px-3 py-2 rounded text-[hsl(215_20%_70%)] hover:bg-[hsl(222_47%_20%)] hover:text-white transition-colors">Subscriptions</Link>
          <Link href="/admin/searches" className="block px-3 py-2 rounded text-[hsl(215_20%_70%)] hover:bg-[hsl(222_47%_20%)] hover:text-white transition-colors">Search History</Link>
          <Link href="/admin/analytics" className="block px-3 py-2 rounded text-[hsl(215_20%_70%)] hover:bg-[hsl(222_47%_20%)] hover:text-white transition-colors">Analytics</Link>
          <Link href="/" className="block px-3 py-2 rounded text-[hsl(215_20%_65%)] hover:bg-[hsl(222_47%_20%)] hover:text-white transition-colors mt-4">← Back to App</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
