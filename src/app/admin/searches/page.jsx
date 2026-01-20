'use client';
import { useEffect, useState } from 'react';

export default function AdminSearches() {
  const [searches, setSearches] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchSearches = () => {
    const params = new URLSearchParams({ page, search, ...(type && { type }) });
    fetch(`/api/admin/searches?${params}`)
      .then(r => r.json())
      .then(data => {
        setSearches(data.searches || []);
        setTotal(data.total || 0);
        setPages(data.pages || 0);
      });
  };

  useEffect(() => {
    fetchSearches();
  }, [page, search, type]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Search History</h1>
      
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by email or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[hsl(222_47%_15%)] border border-[hsl(222_47%_25%)] rounded flex-1 text-white placeholder-[hsl(215_20%_65%)]"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 bg-[hsl(222_47%_15%)] border border-[hsl(222_47%_25%)] rounded text-white"
        >
          <option value="">All Types</option>
          <option value="screenshot">Screenshot</option>
          <option value="recording">Recording</option>
        </select>
      </div>

      <div className="bg-[hsl(222_47%_15%)] rounded-lg border border-[hsl(222_47%_25%)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[hsl(222_47%_18%)] border-b border-[hsl(222_47%_25%)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">FPS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(222_47%_25%)]">
            {searches.map(item => (
              <tr key={item.id} className="hover:bg-[hsl(222_47%_18%)]">
                <td className="px-6 py-4 text-white">{item.user?.name || item.userName}</td>
                <td className="px-6 py-4 text-[hsl(215_20%_70%)]">{item.user?.email || item.userEmail}</td>
                <td className="px-6 py-4 text-[hsl(187_92%_55%)] truncate max-w-xs" title={item.url}>
                  {item.url}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    item.type === 'screenshot' 
                      ? 'bg-[hsl(187_92%_55%/0.2)] text-[hsl(187_92%_55%)]' 
                      : 'bg-[hsl(280_70%_70%/0.2)] text-[hsl(280_70%_70%)]'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-white">{item.fps || '-'}</td>
                <td className="px-6 py-4 text-[hsl(215_20%_70%)]">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2 items-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded disabled:opacity-50 text-white hover:bg-[hsl(222_47%_25%)]"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-white">
          Page {page} of {pages} ({total} total)
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= pages}
          className="px-4 py-2 bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded disabled:opacity-50 text-white hover:bg-[hsl(222_47%_25%)]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
