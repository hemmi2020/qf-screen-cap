export default function StatsCard({ title, value, icon, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-500 text-sm">{title}</div>
          <div className={`text-3xl font-bold mt-2 ${colors[color]}`}>{value}</div>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
