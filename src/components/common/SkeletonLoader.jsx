/**
 * Base Skeleton Loader Component
 * Provides animated placeholder for loading states
 */

export function SkeletonBox({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700/50 ${rounded} ${className}`}></div>
  )
}

export function SkeletonText({ className = '', width = 'w-full' }) {
  return (
    <div className={`h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50 ${width} ${className}`}></div>
  )
}

export function SkeletonCircle({ size = 'h-10 w-10' }) {
  return (
    <div className={`animate-pulse rounded-full bg-slate-200 dark:bg-slate-700/50 ${size}`}></div>
  )
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#1a2e23] dark:bg-[#14281d]">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <SkeletonText width="w-32" className="mb-2" />
          <SkeletonText width="w-40" className="h-8" />
        </div>
        <SkeletonBox className="h-10 w-16" />
      </div>
      <SkeletonBox className="h-16 w-full" />
    </div>
  )
}

export function PortfolioRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 py-4 dark:border-[#2bee79]/5">
      <SkeletonCircle size="h-10 w-10" />
      <div className="flex-1">
        <SkeletonText width="w-32" className="mb-2" />
        <SkeletonText width="w-24" className="h-3" />
      </div>
      <div className="flex flex-1 items-center justify-end gap-8">
        <SkeletonText width="w-20" />
        <SkeletonText width="w-20" />
        <SkeletonText width="w-16" />
        <SkeletonText width="w-24" />
      </div>
    </div>
  )
}

export function MarketRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-[#2bee79]/5">
      <td className="px-6 py-5">
        <SkeletonText width="w-6" />
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <SkeletonCircle size="h-8 w-8" />
          <div>
            <SkeletonText width="w-24" className="mb-1" />
            <SkeletonText width="w-12" className="h-3" />
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <SkeletonText width="w-20" />
      </td>
      <td className="px-6 py-5">
        <SkeletonText width="w-16" />
      </td>
      <td className="px-6 py-5">
        <SkeletonText width="w-16" />
      </td>
      <td className="px-6 py-5">
        <SkeletonText width="w-24" />
      </td>
      <td className="px-6 py-5">
        <SkeletonText width="w-24" />
      </td>
      <td className="px-6 py-5">
        <SkeletonBox className="h-8 w-32" />
      </td>
      <td className="px-6 py-5">
        <SkeletonCircle size="h-6 w-6" />
      </td>
    </tr>
  )
}

export function ChartSkeleton({ height = 'h-56' }) {
  return (
    <div className={`w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-[#102217]/60 ${height}`}>
      <div className="flex h-full items-end justify-between gap-1">
        {Array.from({ length: 50 }).map((_, i) => (
          <SkeletonBox 
            key={i} 
            className="w-1" 
            style={{ height: `${Math.random() * 70 + 30}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function PerformanceChartSkeleton() {
  return (
    <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#14281d]">
      <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-white/5">
        <div>
          <SkeletonText width="w-32" className="mb-2" />
          <SkeletonText width="w-40" className="h-3" />
        </div>
        <div className="text-right">
          <SkeletonText width="w-28" className="mb-2 h-6" />
          <SkeletonText width="w-16" className="h-4" />
        </div>
      </div>
      <div className="p-6">
        <ChartSkeleton />
      </div>
    </div>
  )
}
