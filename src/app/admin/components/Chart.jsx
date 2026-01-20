export default function Chart({ data, title, type = 'bar', valuePrefix = '' }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, v]) => v));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {entries.map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{label}</span>
              <span className="font-semibold">{valuePrefix}{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
