export default function UserRow({ user, onDelete, onRoleChange }) {
  return (
    <tr>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4">
        <select
          value={user.role}
          onChange={(e) => onRoleChange(user.id, e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-xs ${
          user.subscription?.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {user.subscription?.status || 'None'}
        </span>
      </td>
      <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <button
          onClick={() => onDelete(user.id)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
