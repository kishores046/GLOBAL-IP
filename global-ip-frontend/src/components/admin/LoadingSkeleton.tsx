/**
 * LoadingSkeleton Component
 * Displays loading placeholders
 */

export function LoadingSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 shadow-xl animate-pulse"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
            <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-32"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-40"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}
