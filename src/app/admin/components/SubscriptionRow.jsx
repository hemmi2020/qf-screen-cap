export default function SubscriptionRow({ subscription, onCancel }) {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    EXPIRED: 'bg-gray-100 text-gray-800'
  };

  return (
    <tr>
      <td className="px-6 py-4">{subscription.user.email}</td>
      <td className="px-6 py-4 text-xs font-mono">{subscription.paypalSubscriptionId}</td>
      <td className="px-6 py-4">{subscription.planId}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-xs ${statusColors[subscription.status] || 'bg-gray-100 text-gray-800'}`}>
          {subscription.status}
        </span>
      </td>
      <td className="px-6 py-4">{new Date(subscription.createdAt).toLocaleDateString()}</td>
      <td className="px-6 py-4">
        {subscription.status === 'ACTIVE' && (
          <button
            onClick={() => onCancel(subscription.id)}
            className="text-red-600 hover:text-red-800"
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
}
