'use client';
import { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = () => {
    const params = new URLSearchParams({ page, search });
    fetch(`/api/admin/users?${params}`)
      .then(r => r.json())
      .then(data => {
        setUsers(data.users);
        setTotal(data.total);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user?')) return;
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    fetchUsers();
  };

  const changeRole = async (userId, role) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role })
    });
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-white">Users</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-[hsl(222_47%_15%)] border border-[hsl(222_47%_25%)] rounded w-full max-w-md text-white placeholder-[hsl(215_20%_65%)]"
        />
      </div>
      <div className="bg-[hsl(222_47%_15%)] rounded-lg border border-[hsl(222_47%_25%)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[hsl(222_47%_18%)] border-b border-[hsl(222_47%_25%)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Subscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[hsl(215_20%_70%)] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(222_47%_25%)]">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-[hsl(222_47%_18%)]">
                <td className="px-6 py-4 text-white">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value)}
                    className="bg-[hsl(222_47%_20%)] border border-[hsl(222_47%_30%)] rounded px-2 py-1 text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.subscription?.status === 'ACTIVE' ? 'bg-[hsl(187_92%_55%/0.2)] text-[hsl(187_92%_55%)]' : 'bg-[hsl(222_47%_25%)] text-[hsl(215_20%_70%)]'
                  }`}>
                    {user.subscription?.status || 'None'}
                  </span>
                </td>
                <td className="px-6 py-4 text-[hsl(215_20%_70%)]">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
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
