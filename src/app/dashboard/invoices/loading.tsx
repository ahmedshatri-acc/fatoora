export default function InvoicesLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-8 w-24 rounded-lg bg-gray-200" />
        <div className="h-10 w-36 rounded-lg bg-gray-200" />
      </div>
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-3 grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-gray-200" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-50 grid grid-cols-6 gap-4 items-center">
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-4 w-20 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-5 w-14 rounded-full bg-gray-100" />
            <div className="h-4 w-8 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
