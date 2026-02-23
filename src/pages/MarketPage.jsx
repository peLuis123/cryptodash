import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import AssetPreviewDrawer from '../components/market/AssetPreviewDrawer'
import { formatCurrency, formatCompactCurrency } from '../utils/dashboardFormatters'

export default function MarketPage() {
  const { markets, loading, error } = useOutletContext()
  const navigate = useNavigate()
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Calcular estadísticas globales del mercado
  const globalStats = {
    totalMarketCap: markets.reduce((acc, coin) => acc + (coin.market_cap || 0), 0),
    totalVolume24h: markets.reduce((acc, coin) => acc + (coin.total_volume || 0), 0),
    btcDominance: markets.length > 0 ? ((markets[0]?.market_cap || 0) / markets.reduce((acc, coin) => acc + (coin.market_cap || 0), 0)) * 100 : 0,
  }

  // Filtrado de activos
  const filteredMarkets = markets.filter((coin) => {
    const matchesSearch =
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
      <div className="custom-scrollbar flex flex-1 items-center justify-center overflow-y-auto p-8">
        <p className="text-sm font-semibold text-slate-400">Cargando mercado...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="custom-scrollbar flex flex-1 items-center justify-center overflow-y-auto p-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-6 text-center">
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
        <div className="flex w-full flex-col gap-6 pb-10">
          {/* Header */}
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-100">Mercado Cripto</h2>
              <p className="text-slate-400">Explora los activos digitales más negociados</p>
            </div>
            <div className="relative max-w-md flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar activo, ticker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-none bg-[#152A1E] py-2 pl-10 pr-4 text-sm transition-all focus:ring-1 focus:ring-[#2bee79] placeholder:text-slate-500"
              />
            </div>
          </header>

          {/* Global Stats Cards */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Market Cap Total */}
            <div className="group relative overflow-hidden rounded-xl border border-[#2bee79]/5 bg-[#152A1E] p-6">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                <span className="material-symbols-outlined text-4xl">database</span>
              </div>
              <p className="mb-1 text-xs font-medium text-slate-400">Cap. de Mercado Total</p>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-black tabular-nums">{formatCompactCurrency(globalStats.totalMarketCap)}</h3>
              </div>
            </div>

            {/* Volumen 24h */}
            <div className="group relative overflow-hidden rounded-xl border border-[#2bee79]/5 bg-[#152A1E] p-6">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                <span className="material-symbols-outlined text-4xl">show_chart</span>
              </div>
              <p className="mb-1 text-xs font-medium text-slate-400">Volumen 24h</p>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-black tabular-nums">{formatCompactCurrency(globalStats.totalVolume24h)}</h3>
              </div>
            </div>

            {/* Dominancia BTC */}
            <div className="group relative overflow-hidden rounded-xl border border-[#2bee79]/5 bg-[#152A1E] p-6">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                <span className="material-symbols-outlined text-4xl">token</span>
              </div>
              <p className="mb-1 text-xs font-medium text-slate-400">Dominancia BTC</p>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-black tabular-nums">{globalStats.btcDominance.toFixed(1)}%</h3>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-[#2bee79]" style={{ width: `${globalStats.btcDominance}%` }}></div>
              </div>
            </div>
          </section>

          {/* Market Table */}
          <section className="overflow-hidden rounded-xl border border-[#2bee79]/10 bg-[#152A1E]">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-[#2bee79]/10 p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#2bee79] text-[#0B1F14]'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  Criptomonedas
                </button>
                <button
                  onClick={() => setActiveTab('defi')}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'defi'
                      ? 'bg-[#2bee79] text-[#0B1F14]'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  DeFi
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Mostrando:</span>
                <span className="font-bold text-slate-100">Top {topMarkets.length}</span>
              </div>
            </div>

            {/* Table */}
            <div className="custom-scrollbar overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#2bee79]/10 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 w-12">#</th>
                    <th className="px-6 py-4">Activo</th>
                    <th className="px-6 py-4 text-right">Precio</th>
                    <th className="px-6 py-4 text-right">24h %</th>
                    <th className="px-6 py-4 text-right">7d %</th>
                    <th className="px-6 py-4 text-right">Cap. de Mercado</th>
                    <th className="px-6 py-4 text-right">Volumen (24h)</th>
                    <th className="px-6 py-4 text-center">Últimos 7 Días</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {topMarkets.map((coin, index) => (
                    <tr
                      key={coin.id}
                      onClick={() => handleAssetClick(coin)}
                      className="group cursor-pointer border-b border-[#2bee79]/5 transition-colors hover:bg-[#2bee79]/5"
                    >
                      <td className="px-6 py-5 tabular-nums text-slate-400">{index + 1}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="size-8 rounded-full" />
                          <div>
                            <p className="font-bold">{coin.name}</p>
                            <p className="text-xs text-slate-500">{coin.symbol?.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-semibold tabular-nums">
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
                      <td className="px-6 py-5 text-right tabular-nums">{formatCompactCurrency(coin.market_cap)}</td>
                      <td className="px-6 py-5 text-right tabular-nums">{formatCompactCurrency(coin.total_volume)}</td>
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
                        <button className="text-slate-300 transition-colors hover:text-[#2bee79]">
                          <span className="material-symbols-outlined text-lg">star</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex justify-center border-t border-[#2bee79]/10 p-4">
              <button className="text-xs font-bold text-[#2bee79] hover:underline">
                Ver todos los activos ({markets.length}+)
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

// Helper para generar path del sparkline
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
