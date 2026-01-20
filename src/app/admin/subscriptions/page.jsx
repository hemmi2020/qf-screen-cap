'use client';
import { useEffect, useState } from 'react';

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const fetchSubscriptions = () => {
    const params = new URLSearchParams({ page, search, ...(status && { status }) });
    fetch(`/api/admin/subscriptions?${params}`)
      .then(r => r.json())
      .then(data => setSubscriptions(data.subscriptions));
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page, search, status]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Subscriptions</h1>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by email or PayPal ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[hsl(222_47%_15%)] border border-[hsl(222_47%_25%)] rounded flex-1 text-white placeholder-[hsl(215_20%_65%)]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 bg-[hsl(222_47%_15%)] border border-[hsl(222_47%_25%)] rounded text-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>
      <div className="bg-[hsl(222_47%_15%)] rounded-lg border border-[hsl(222_47%_25%)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[hsl(222_47%_18%)] border-b border-[hsl(222_47%_25%)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">User Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">PayPal ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(222_47%_25%)]">
            {subscriptions.map(sub => (
              <tr key={sub.id} className="hover:bg-[hsl(222_47%_18%)]">
                <td className="px-6 py-4 text-white">{sub.user.email}</td>
                <td className="px-6 py-4 text-xs text-[hsl(215_20%_70%)] font-mono">{sub.paypalSubscriptionId}</td>
                <td className="px-6 py-4 text-white">{sub.planId}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    sub.status === 'ACTIVE' ? 'bg-[hsl(187_92%_55%/0.2)] text-[hsl(187_92%_55%)]' : 'bg-[hsl(222_47%_25%)] text-[hsl(215_20%_70%)]'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[hsl(215_20%_70%)]">{new Date(sub.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded disabled:opacity-50 text-white hover:bg-[hsl(222_47%_25%)]"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-white">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded text-white hover:bg-[hsl(222_47%_25%)]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
