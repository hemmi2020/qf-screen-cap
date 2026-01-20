'use client';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats);
    fetch('/api/admin/analytics').then(r => r.json()).then(setAnalytics);
  }, []);

  if (!stats || !analytics) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <div className="text-[hsl(215_20%_70%)] text-sm">Total Users</div>
          <div className="text-3xl font-bold mt-2 text-white">{stats.totalUsers}</div>
        </div>
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <div className="text-[hsl(215_20%_70%)] text-sm">Active Subscriptions</div>
          <div className="text-3xl font-bold mt-2 text-[hsl(187_92%_55%)]">{stats.activeSubscriptions}</div>
        </div>
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <div className="text-[hsl(215_20%_70%)] text-sm">Total Searches</div>
          <div className="text-3xl font-bold mt-2 text-white">{stats.totalSearches}</div>
        </div>
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <div className="text-[hsl(215_20%_70%)] text-sm">Revenue (MRR)</div>
          <div className="text-3xl font-bold mt-2 text-[hsl(280_70%_70%)]">${stats.revenue}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <div className="text-[hsl(215_20%_70%)] text-sm mb-4">Conversion Rate</div>
          <div className="text-2xl font-bold text-[hsl(187_92%_55%)]">{analytics.conversionRate}%</div>
        </div>
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <div className="text-[hsl(215_20%_70%)] text-sm mb-4">Churn Rate</div>
          <div className="text-2xl font-bold text-red-400">{analytics.churnRate}%</div>
        </div>
      </div>
    </div>
  );
}
