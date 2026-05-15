export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-48 rounded-lg bg-gray-200 mb-2" />
          <div className="h-4 w-32 rounded-lg bg-gray-100" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-gray-200" />
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-5 w-5 rounded-full bg-gray-100" />
            </div>
            <div className="h-8 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Recent invoices card */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-5 w-28 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-100" />
        </div>
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <div>
                <div className="h-4 w-32 rounded bg-gray-200 mb-1" />
                <div className="h-3 w-40 rounded bg-gray-100" />
              </div>
              <div className="text-left">
                <div className="h-4 w-20 rounded bg-gray-200 mb-1" />
                <div className="h-3 w-12 rounded-full bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
