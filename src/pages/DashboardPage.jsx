import { useOutletContext } from 'react-router-dom'

import MainPerformanceChart from '../components/dashboard/MainPerformanceChart'
import MarketTable from '../components/dashboard/MarketTable'
import SummaryCardsGrid from '../components/dashboard/SummaryCardsGrid'
import { DashboardCardSkeleton, PerformanceChartSkeleton, MarketRowSkeleton } from '../components/common/SkeletonLoader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTranslations } from '../hooks/useTranslations'

export default function DashboardPage() {
  const t = useTranslations()
  useDocumentTitle(t.pageTitles.dashboard, t.pageDescriptions.dashboard)
  const {
    loading,
    error,
    summaryCards,
    marketRows,
    mainPerformancePath,
    mainPerformanceSeries,
    mainPerformancePriceLabel,
    mainPerformanceChangeLabel,
    mainPerformancePositive,
  } = useOutletContext()

  if (loading) {
    return (
      <div className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-transparent sm:p-6 lg:p-8">
        {/* Cards Skeleton */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>

        {/* Chart Skeleton */}
        <PerformanceChartSkeleton />

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#14281d]">
          <div className="border-b border-slate-200 p-6 dark:border-white/5">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-xs dark:bg-[#1a2e23]/20">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">24h %</th>
                  <th className="px-6 py-4">Market Cap</th>
                  <th className="px-6 py-4">Volume</th>
                  <th className="px-6 py-4">Last 7 Days</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <MarketRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-transparent sm:p-6 lg:p-8">
      <SummaryCardsGrid summaryCards={summaryCards} />
      <MainPerformanceChart
        chartPath={mainPerformancePath}
        chartData={mainPerformanceSeries}
        priceLabel={mainPerformancePriceLabel}
        changeLabel={mainPerformanceChangeLabel}
        positive={mainPerformancePositive}
      />
      <MarketTable marketRows={marketRows} loading={loading} error={error} />
    </div>
  )
}
