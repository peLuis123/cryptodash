import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import CountUpValue from '../components/common/CountUpValue'
import PortfolioAssetsTable from '../components/portfolio/PortfolioAssetsTable'
import PortfolioPerformanceChart from '../components/portfolio/PortfolioPerformanceChart'
import { formatCompactCurrency, formatCurrency, formatSignedPercent } from '../utils/dashboardFormatters'

function normalizePortfolioRows({ primaryPortfolio, markets, portfolioTotal }) {
  if (!primaryPortfolio?.positions?.length) {
    return []
  }

  const marketById = new Map(markets.map((coin) => [coin.id, coin]))

  return primaryPortfolio.positions
    .map((position) => {
      const coin = marketById.get(position.assetId)

      if (!coin) {
        return null
      }

      const amount = Number(position.amount) || 0
      const currentPrice = Number(coin.current_price) || 0
      const currentValueUsd = amount * currentPrice
      const allocationPercent = portfolioTotal > 0 ? (currentValueUsd / portfolioTotal) * 100 : 0

      return {
        assetId: position.assetId,
        name: coin.name,
        symbol: coin.symbol?.toUpperCase() ?? '--',
        amount,
        amountLabel: `${amount.toFixed(4)} ${coin.symbol?.toUpperCase() ?? ''}`,
        investedUsd: Number(position.investedUsd) || 0,
        currentPrice,
        currentValueUsd,
        allocationPercent,
        change24h: Number(coin.price_change_percentage_24h) || 0,
        change7d: Number(coin.price_change_percentage_7d_in_currency) || 0,
      }
    })
    .filter(Boolean)
}

export default function PortfolioPage() {
  const {
    loading,
    error,
    markets,
    primaryPortfolio,
    portfolioSummary,
    portfolioPerformancePath,
    portfolioPerformancePriceLabel,
    portfolioPerformanceChangeLabel,
    portfolioPerformancePositive,
    defaultPortfolioAllocationUsd,
    addAssetToPortfolio,
  } = useOutletContext()

  const [searchValue, setSearchValue] = useState('')
  const [sortValue, setSortValue] = useState('value')
  const [newAssetId, setNewAssetId] = useState('')
  const [newAllocationUsd, setNewAllocationUsd] = useState(defaultPortfolioAllocationUsd)
  const [isAddingAsset, setIsAddingAsset] = useState(false)
  const [addAssetError, setAddAssetError] = useState('')

  const baseRows = useMemo(
    () =>
      normalizePortfolioRows({
        primaryPortfolio,
        markets,
        portfolioTotal: portfolioSummary.totalValueUsd,
      }),
    [markets, portfolioSummary.totalValueUsd, primaryPortfolio],
  )

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()

    const matchingRows = normalizedSearch
      ? baseRows.filter(
          (row) => row.name.toLowerCase().includes(normalizedSearch) || row.symbol.toLowerCase().includes(normalizedSearch),
        )
      : baseRows

    const sorterByKey = {
      value: (row) => row.currentValueUsd,
      price: (row) => row.currentPrice,
      balance: (row) => row.amount,
      change24h: (row) => row.change24h,
    }

    const sortSelector = sorterByKey[sortValue] ?? sorterByKey.value

    return [...matchingRows].sort((left, right) => sortSelector(right) - sortSelector(left))
  }, [baseRows, searchValue, sortValue])

  const strongestAsset = useMemo(() => {
    if (!filteredRows.length) {
      return null
    }

    return [...filteredRows].sort((left, right) => right.change7d - left.change7d)[0]
  }, [filteredRows])

  const topAllocation = useMemo(() => {
    return [...filteredRows].sort((left, right) => right.allocationPercent - left.allocationPercent).slice(0, 4)
  }, [filteredRows])

  const availableAssets = useMemo(() => {
    const selectedAssetIds = new Set((primaryPortfolio?.positions ?? []).map((position) => position.assetId))
    return markets.filter((coin) => !selectedAssetIds.has(coin.id))
  }, [markets, primaryPortfolio])

  async function handleAddAsset() {
    if (!newAssetId) {
      setAddAssetError('Selecciona una moneda para añadir.')
      return
    }

    try {
      setIsAddingAsset(true)
      setAddAssetError('')
      await addAssetToPortfolio({
        assetId: newAssetId,
        allocationUsd: Number(newAllocationUsd) || defaultPortfolioAllocationUsd,
      })
      setNewAssetId('')
      setNewAllocationUsd(defaultPortfolioAllocationUsd)
    } catch (addError) {
      setAddAssetError(addError?.message ?? 'No se pudo añadir el activo.')
    } finally {
      setIsAddingAsset(false)
    }
  }

  if (loading) {
    return (
      <div className="custom-scrollbar flex flex-1 items-center justify-center overflow-y-auto p-8">
        <p className="text-sm font-semibold text-slate-400">Cargando portafolio...</p>
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
    <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
      <div className="flex w-full flex-col gap-8 pb-10">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-100">Mi Portafolio</h1>
            <p className="mt-1 text-sm text-slate-400">Resumen general de tus activos digitales</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-[#1a2e23] bg-[#1a2e23] px-4 py-2 text-sm font-bold text-slate-200 transition-colors hover:text-[#2bee79]"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar CSV
            </button>
            <select
              value={newAssetId}
              onChange={(event) => setNewAssetId(event.target.value)}
              className="max-w-52 rounded-lg border border-[#1a2e23] bg-[#14281d] px-3 py-2 text-sm font-medium text-slate-200 outline-none transition-colors focus:border-[#2bee79]/50"
            >
              <option value="">Selecciona red/moneda</option>
              {availableAssets.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol?.toUpperCase()})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              step="50"
              value={newAllocationUsd}
              onChange={(event) => setNewAllocationUsd(event.target.value)}
              className="w-32 rounded-lg border border-[#1a2e23] bg-[#14281d] px-3 py-2 text-sm font-medium text-slate-200 outline-none transition-colors focus:border-[#2bee79]/50"
              placeholder="USD"
            />
            <button
              type="button"
              onClick={handleAddAsset}
              disabled={isAddingAsset || !availableAssets.length}
              className="flex items-center gap-2 rounded-lg bg-[#2bee79] px-4 py-2 text-sm font-black text-[#102217] shadow-lg shadow-[#2bee79]/20 transition-opacity hover:opacity-90"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              {isAddingAsset ? 'Añadiendo...' : 'Añadir Activo'}
            </button>
          </div>
        </section>

        {addAssetError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400">
            {addAssetError}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-2xl border border-[#1a2e23] bg-[#14281d] p-8">
            <p className="text-sm font-medium text-slate-400">Valor Total del Portafolio</p>
            <h3 className="mt-2 text-4xl font-black tracking-tight text-slate-100 sm:text-5xl">
              <CountUpValue value={portfolioSummary.totalValueUsd} formatter={formatCurrency} />
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-bold ${
                  portfolioSummary.change24hUsd >= 0 ? 'bg-[#2bee79]/10 text-[#2bee79]' : 'bg-red-500/10 text-red-500'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {portfolioSummary.change24hUsd >= 0 ? 'trending_up' : 'trending_down'}
                </span>
                <CountUpValue value={portfolioSummary.change24hUsd} formatter={formatCompactCurrency} />
              </span>
              <span
                className={`text-sm font-bold ${portfolioSummary.change24hUsd >= 0 ? 'text-[#2bee79]' : 'text-red-500'}`}
              >
                {formatSignedPercent(portfolioSummary.change24hPercent)}
                <span className="ml-1 font-medium text-slate-500">(24h)</span>
              </span>
            </div>

            <div className="mt-10 h-24 w-full sm:w-72">
              <svg className="h-full w-full text-[#2bee79]" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d={portfolioPerformancePath} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {topAllocation.map((row) => (
                <div key={row.assetId} className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#2bee79]" />
                  <span className="text-xs font-bold text-slate-300">
                    {row.symbol} {row.allocationPercent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-2xl border border-[#1a2e23] bg-[#14281d] p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Activo más fuerte</span>
                <span className="material-symbols-outlined text-[#2bee79]">rocket_launch</span>
              </div>
              <p className="text-lg font-black text-slate-100">{strongestAsset?.name ?? 'Sin datos'}</p>
              <p className="mt-1 text-sm text-slate-400">
                {strongestAsset ? `${strongestAsset.change7d >= 0 ? '+' : '-'}${Math.abs(strongestAsset.change7d).toFixed(2)}% semanal` : '--'}
              </p>
            </div>

            <div className="flex-1 rounded-2xl border border-[#1a2e23] bg-[#14281d] p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Próximo Desbloqueo</span>
                <span className="material-symbols-outlined text-slate-400">timer</span>
              </div>
              <p className="text-lg font-black text-slate-100">Solana (Staked)</p>
              <p className="mt-1 text-sm text-slate-400">En 2 días, 14 horas</p>
            </div>
          </div>
        </section>

        <PortfolioPerformanceChart
          chartPath={portfolioPerformancePath}
          totalValueLabel={portfolioPerformancePriceLabel}
          changeLabel={portfolioPerformanceChangeLabel}
          positive={portfolioPerformancePositive}
        />

        <section className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative w-full flex-1">
            <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-500">
              search
            </span>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full rounded-lg border border-[#1a2e23] bg-[#14281d] py-2 pr-4 pl-10 text-sm text-slate-100 outline-none transition-colors focus:border-[#2bee79]/50"
              placeholder="Buscar activo..."
            />
          </div>

          <select
            value={sortValue}
            onChange={(event) => setSortValue(event.target.value)}
            className="w-full rounded-lg border border-[#1a2e23] bg-[#14281d] px-3 py-2 text-sm font-medium text-slate-200 outline-none transition-colors focus:border-[#2bee79]/50 sm:w-56"
          >
            <option value="value">Ordenar por valor</option>
            <option value="price">Precio (Mayor a menor)</option>
            <option value="balance">Balance (Mayor a menor)</option>
            <option value="change24h">Rendimiento 24h</option>
          </select>
        </section>

        <PortfolioAssetsTable rows={filteredRows} />
      </div>
    </div>
  )
}
