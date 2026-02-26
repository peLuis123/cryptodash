import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import AssetPreviewDrawer from '../components/market/AssetPreviewDrawer'
import { MarketRowSkeleton } from '../components/common/SkeletonLoader'
import { useTranslations } from '../hooks/useTranslations'
import { formatCurrency, formatCompactCurrency } from '../utils/dashboardFormatters'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function MarketPage() {
  const t = useTranslations()
  useDocumentTitle(t.pageTitles.market, t.pageDescriptions.market)
  const { markets, loading, error } = useOutletContext()
  const navigate = useNavigate()
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMarketCap, setFilterMarketCap] = useState('all')
  const [filterVolume, setFilterVolume] = useState('all')
  const [filterChange24h, setFilterChange24h] = useState('all')

  const globalStats = {
    totalMarketCap: markets.reduce((acc, coin) => acc + (coin.market_cap || 0), 0),
    totalVolume24h: markets.reduce((acc, coin) => acc + (coin.total_volume || 0), 0),
    btcDominance: markets.length > 0 ? ((markets[0]?.market_cap || 0) / markets.reduce((acc, coin) => acc + (coin.market_cap || 0), 0)) * 100 : 0,
  }

  const filteredMarkets = markets.filter((coin) => {
    const matchesSearch =
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesMarketCap = true
    if (filterMarketCap === 'small') matchesMarketCap = coin.market_cap < 1_000_000_000
    else if (filterMarketCap === 'medium') matchesMarketCap = coin.market_cap >= 1_000_000_000 && coin.market_cap < 10_000_000_000
    else if (filterMarketCap === 'large') matchesMarketCap = coin.market_cap >= 10_000_000_000

    let matchesVolume = true
    if (filterVolume === 'low') matchesVolume = coin.total_volume < 100_000_000
    else if (filterVolume === 'medium') matchesVolume = coin.total_volume >= 100_000_000 && coin.total_volume < 1_000_000_000
    else if (filterVolume === 'high') matchesVolume = coin.total_volume >= 1_000_000_000

    let matchesChange = true
    if (filterChange24h === 'positive') matchesChange = coin.price_change_percentage_24h > 0
    else if (filterChange24h === 'negative') matchesChange = coin.price_change_percentage_24h < 0

    return matchesSearch && matchesMarketCap && matchesVolume && matchesChange
  })

  const topMarkets = filteredMarkets.slice(0, 20)

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset)
  }

  const handleViewInPortfolio = (assetId) => {
    navigate(`/portafolio?asset=${assetId}`)
  }

  if (loading) {
    return (
      <div className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-transparent sm:p-6 lg:p-8">
        <div className="flex w-full flex-col gap-6 pb-10">
          {/* Header Skeleton */}
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 h-10 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/50"></div>
                <div className="h-4 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50"></div>
              </div>
              <div className="h-10 w-full max-w-md animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/50"></div>
            </div>
          </header>

          {/* Stats Cards Skeleton */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
                <div className="mb-2 h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50"></div>
                <div className="h-8 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700/50"></div>
              </div>
            ))}
          </section>

          {/* Table Skeleton */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-[#2bee79]/10 dark:bg-[#152A1E]">
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-[#2bee79]/10 dark:bg-[#2bee79]/5">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">24h %</th>
                    <th className="px-6 py-4">7d %</th>
                    <th className="px-6 py-4">Market Cap</th>
                    <th className="px-6 py-4">Volume</th>
                    <th className="px-6 py-4">Last 7 Days</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <MarketRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="custom-scrollbar flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-6 text-center sm:px-8">
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-transparent sm:p-6 lg:p-8">
        <div className="flex w-full flex-col gap-6 pb-10">
          {/* Header */}
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{t.market.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">{t.market.subtitle}</p>
              </div>
              <div className="relative w-full flex-1 md:max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder={t.market.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border-none bg-white py-2 pl-10 pr-4 text-sm text-slate-900 transition-all focus:ring-1 focus:ring-[#2bee79] placeholder:text-slate-400 dark:bg-[#152A1E] dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t.market.filters || 'Filters'}:</span>
              
              {/* Market Cap Filter */}
              <select
                value={filterMarketCap}
                onChange={(e) => setFilterMarketCap(e.target.value)}
                className="rounded-lg border-none bg-white px-4 py-2 text-xs font-medium text-slate-900 transition-all focus:ring-1 focus:ring-[#2bee79] dark:bg-[#152A1E] dark:text-slate-100"
              >
                <option value="all">{t.market.allMarketCap || 'All Market Cap'}</option>
                <option value="small">{t.market.smallCap || '< $1B'}</option>
                <option value="medium">{t.market.mediumCap || '$1B - $10B'}</option>
                <option value="large">{t.market.largeCap || '> $10B'}</option>
              </select>

              {/* Volume Filter */}
              <select
                value={filterVolume}
                onChange={(e) => setFilterVolume(e.target.value)}
                className="rounded-lg border-none bg-white px-4 py-2 text-xs font-medium text-slate-900 transition-all focus:ring-1 focus:ring-[#2bee79] dark:bg-[#152A1E] dark:text-slate-100"
              >
                <option value="all">{t.market.allVolume || 'All Volume'}</option>
                <option value="low">{t.market.lowVolume || '< $100M'}</option>
                <option value="medium">{t.market.mediumVolume || '$100M - $1B'}</option>
                <option value="high">{t.market.highVolume || '> $1B'}</option>
              </select>

              {/* Change 24h Filter */}
              <select
                value={filterChange24h}
                onChange={(e) => setFilterChange24h(e.target.value)}
                className="rounded-lg border-none bg-white px-4 py-2 text-xs font-medium text-slate-900 transition-all focus:ring-1 focus:ring-[#2bee79] dark:bg-[#152A1E] dark:text-slate-100"
              >
                <option value="all">{t.market.allChanges || 'All Changes'}</option>
                <option value="positive">{t.market.gainers || '📈 Gainers'}</option>
                <option value="negative">{t.market.losers || '📉 Losers'}</option>
              </select>

              {/* Reset Filters */}
              {(filterMarketCap !== 'all' || filterVolume !== 'all' || filterChange24h !== 'all') && (
                <button
                  onClick={() => {
                    setFilterMarketCap('all')
                    setFilterVolume('all')
                    setFilterChange24h('all')
                  }}
                  className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-500/20"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  {t.market.resetFilters || 'Reset'}
                </button>
              )}
            </div>
          </header>

          {/* Global Stats Cards */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Market Cap Total */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                <span className="material-symbols-outlined text-4xl">database</span>
              </div>
              <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">{t.market.globalStats.totalMarketCap}</p>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-black tabular-nums text-slate-900 dark:text-slate-100">{formatCompactCurrency(globalStats.totalMarketCap)}</h3>
              </div>
            </div>

            {/* Volumen 24h */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                <span className="material-symbols-outlined text-4xl">show_chart</span>
              </div>
              <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">{t.market.globalStats.volume24h}</p>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-black tabular-nums text-slate-900 dark:text-slate-100">{formatCompactCurrency(globalStats.totalVolume24h)}</h3>
              </div>
            </div>

            {/* Dominancia BTC */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                <span className="material-symbols-outlined text-4xl">token</span>
              </div>
              <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">{t.market.globalStats.btcDominance}</p>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-black tabular-nums text-slate-900 dark:text-slate-100">{globalStats.btcDominance.toFixed(1)}%</h3>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-[#2bee79]" style={{ width: `${globalStats.btcDominance}%` }}></div>
              </div>
            </div>
          </section>

          {/* Market Table */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#2bee79]/10 dark:bg-[#152A1E]">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-[#2bee79]/10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#2bee79] text-[#0B1F14]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  {t.market.cryptocurrencies}
                </button>
                <button
                  onClick={() => setActiveTab('defi')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'defi'
                      ? 'bg-[#2bee79] text-[#0B1F14]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  {t.market.defi}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                <span>{t.market.showing}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{t.market.top} {topMarkets.length}</span>
              </div>
            </div>

            {/* Table */}
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:border-[#2bee79]/10 dark:bg-[#2bee79]/5 dark:text-slate-500">
                    <th className="px-6 py-4 w-12">{t.market.table.rank}</th>
                    <th className="px-6 py-4">{t.market.table.asset}</th>
                    <th className="px-6 py-4 text-right">{t.market.table.price}</th>
                    <th className="px-6 py-4 text-right">{t.market.table.change24h}</th>
                    <th className="px-6 py-4 text-right">{t.market.table.change7d}</th>
                    <th className="px-6 py-4 text-right">{t.market.table.marketCap}</th>
                    <th className="px-6 py-4 text-right">{t.market.table.volume}</th>
                    <th className="px-6 py-4 text-center">{t.market.table.last7Days}</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {topMarkets.map((coin, index) => (
                    <tr
                      key={coin.id}
                      onClick={() => handleAssetClick(coin)}
                      className="group cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-[#2bee79]/5 dark:hover:bg-[#2bee79]/5"
                    >
                      <td className="px-6 py-5 tabular-nums text-slate-500 dark:text-slate-400">{index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="size-8 rounded-full" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{coin.name}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-500">{coin.symbol?.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        {formatCurrency(coin.current_price)}
                      </td>
                      <td
                        className={`px-6 py-5 text-right font-medium tabular-nums ${
                          coin.price_change_percentage_24h >= 0 ? 'text-[#2bee79]' : 'text-red-500'
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </td>
                      <td
                        className={`px-6 py-5 text-right font-medium tabular-nums ${
                          coin.price_change_percentage_7d_in_currency >= 0 ? 'text-[#2bee79]' : 'text-red-500'
                        }`}
                      >
                        {coin.price_change_percentage_7d_in_currency >= 0 ? '+' : ''}
                        {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                      </td>
                      <td className="px-6 py-5 text-right tabular-nums text-slate-900 dark:text-slate-100">{formatCompactCurrency(coin.market_cap)}</td>
                      <td className="px-6 py-5 text-right tabular-nums text-slate-900 dark:text-slate-100">{formatCompactCurrency(coin.total_volume)}</td>
                      <td className="px-6 py-5 w-32">
                        <div className="h-8 w-full">
                          {coin.sparkline_in_7d?.price && (
                            <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                              <path
                                d={generateSparklinePath(coin.sparkline_in_7d.price)}
                                fill="none"
                                stroke={coin.price_change_percentage_7d_in_currency >= 0 ? '#2bee79' : '#ff4d4d'}
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <button className="text-slate-400 transition-colors hover:text-[#2bee79] dark:text-slate-300">
                          <span className="material-symbols-outlined text-lg">star</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-center border-t border-slate-200 bg-slate-50 p-4 dark:border-[#2bee79]/10 dark:bg-[#2bee79]/5">
              <button className="text-xs font-bold text-[#2bee79] hover:underline">
                {t.market.viewAll} ({markets.length}+)
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Asset Preview Drawer */}
      {selectedAsset && (
        <AssetPreviewDrawer
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onViewInPortfolio={handleViewInPortfolio}
        />
      )}
    </>
  )
}

function generateSparklinePath(prices) {
  if (!prices || prices.length === 0) return ''

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * 100
    const y = 30 - ((price - min) / range) * 30
    return `${x},${y}`
  })

  return `M ${points.join(' L ')}`
}
