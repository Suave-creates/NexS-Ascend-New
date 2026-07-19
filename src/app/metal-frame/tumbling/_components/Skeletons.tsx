export function StationCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
      <div className="mt-5 space-y-2">
        <div className="h-3 w-20 rounded bg-gray-100" />
        <div className="h-2 w-full rounded-full bg-gray-100" />
        <div className="h-3 w-40 rounded bg-gray-100" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-20 rounded bg-gray-100" />
        <div className="h-3 w-32 rounded bg-gray-100" />
      </div>
    </div>
  );
}

export function StationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <StationCardSkeleton key={i} />
      ))}
    </div>
  );
}
