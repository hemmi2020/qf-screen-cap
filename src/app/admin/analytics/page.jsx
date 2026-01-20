'use client';
import { useEffect, useState } from 'react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [growth, setGrowth] = useState(null);

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(setAnalytics);
    fetch('/api/admin/analytics?type=revenue').then(r => r.json()).then(setRevenue);
    fetch('/api/admin/analytics?type=growth').then(r => r.json()).then(setGrowth);
  }, []);

  if (!analytics || !revenue || !growth) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Analytics</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <h2 className="text-lg font-semibold mb-4 text-white">Conversion Rate</h2>
          <div className="text-4xl font-bold text-[hsl(187_92%_55%)]">{analytics.conversionRate}%</div>
          <p className="text-sm text-[hsl(215_20%_70%)] mt-2">Users who subscribed</p>
        </div>
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <h2 className="text-lg font-semibold mb-4 text-white">Churn Rate</h2>
          <div className="text-4xl font-bold text-red-400">{analytics.churnRate}%</div>
          <p className="text-sm text-[hsl(215_20%_70%)] mt-2">Cancelled subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <h2 className="text-lg font-semibold mb-4 text-white">Monthly Revenue</h2>
          <div className="space-y-2">
            {Object.entries(revenue.monthlyRevenue).map(([month, amount]) => (
              <div key={month} className="flex justify-between">
                <span className="text-[hsl(215_20%_70%)]">{month}</span>
                <span className="font-semibold text-[hsl(187_92%_55%)]">${amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
          <h2 className="text-lg font-semibold mb-4 text-white">User Growth</h2>
          <div className="space-y-2">
            {Object.entries(growth.userGrowth).map(([month, count]) => (
              <div key={month} className="flex justify-between">
                <span className="text-[hsl(215_20%_70%)]">{month}</span>
                <span className="font-semibold text-white">{count} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[hsl(222_47%_15%)] p-6 rounded-lg border border-[hsl(222_47%_25%)]">
        <h2 className="text-lg font-semibold mb-4 text-white">Subscription Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[hsl(215_20%_70%)] text-sm">Active</div>
            <div className="text-2xl font-bold text-[hsl(187_92%_55%)]">{analytics.activeSubs}</div>
          </div>
          <div>
            <div className="text-[hsl(215_20%_70%)] text-sm">Cancelled</div>
            <div className="text-2xl font-bold text-red-400">{analytics.cancelledSubs}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
