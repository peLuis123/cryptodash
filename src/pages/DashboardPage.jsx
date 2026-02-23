import { useOutletContext } from 'react-router-dom'

import MainPerformanceChart from '../components/dashboard/MainPerformanceChart'
import MarketTable from '../components/dashboard/MarketTable'
import SummaryCardsGrid from '../components/dashboard/SummaryCardsGrid'

export default function DashboardPage() {
  const {
    loading,
    error,
    summaryCards,
    marketRows,
    mainPerformancePath,
    mainPerformancePriceLabel,
    mainPerformanceChangeLabel,
    mainPerformancePositive,
  } = useOutletContext()

  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
      <SummaryCardsGrid summaryCards={summaryCards} />
      <MainPerformanceChart
        chartPath={mainPerformancePath}
        priceLabel={mainPerformancePriceLabel}
        changeLabel={mainPerformanceChangeLabel}
        positive={mainPerformancePositive}
      />
      <MarketTable marketRows={marketRows} loading={loading} error={error} />
    </div>
  )
}
