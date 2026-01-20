export default function DataTable({ columns, data, page, onPageChange, totalPages, searchValue, onSearchChange, searchPlaceholder = 'Search...' }) {
  return (
    <div>
      {onSearchChange && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="px-4 py-2 border rounded w-full max-w-md"
          />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4">
                    {col.render ? col.render(row) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onPageChange && (
        <div className="mt-4 flex gap-2 items-center">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
