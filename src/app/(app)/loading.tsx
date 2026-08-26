export default function Loading() {
  return (
    <main className="p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
            <div className="h-52 w-full animate-pulse bg-slate-100" />
            <div className="space-y-3 px-5 py-5">
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}