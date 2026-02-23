import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { getCoinPerformanceChart } from '../api/market/marketApi'
import CountUpValue from '../components/common/CountUpValue'
import { getCoinIcon, getTrendPath } from '../utils/dashboardCharts'
import { formatCompactCurrency, formatCurrency, formatSignedPercent } from '../utils/dashboardFormatters'

function getMeanAbsoluteDailyChangePercent(prices = []) {
  if (!Array.isArray(prices) || prices.length < 2) {
    return 0
  }

  const changes = prices
    .slice(1)
    .map((price, index) => {
      const previous = Number(prices[index]) || 0
      const current = Number(price) || 0
      if (previous <= 0 || current <= 0) {
        return null
      }

      return ((current - previous) / previous) * 100
    })
    .filter((value) => value !== null)

  if (!changes.length) {
    return 0
  }

  return changes.reduce((accumulator, value) => accumulator + Math.abs(value), 0) / changes.length
}

function getSparklinePath(prices = []) {
  if (!Array.isArray(prices) || prices.length < 2) {
    return 'M0 15 L 100 15'
  }

  const cleanPrices = prices.map((value) => Number(value) || 0)
  const min = Math.min(...cleanPrices)
  const max = Math.max(...cleanPrices)
  const range = max - min || 1

  return cleanPrices
    .map((value, index) => {
      const x = (index / (cleanPrices.length - 1)) * 100
      const y = 30 - ((value - min) / range) * 30
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export default function AnalisisPage() {
  const {
    loading,
    error,
    markets,
    primaryPortfolio,
    portfolioSummary,
  } = useOutletContext()
  const [selectedRange, setSelectedRange] = useState('1M')
  const [rangeLoading, setRangeLoading] = useState(false)
  const [rangeError, setRangeError] = useState('')
  const [portfolioSeriesByRange, setPortfolioSeriesByRange] = useState([])
  const [btcSeriesByRange, setBtcSeriesByRange] = useState([])
  const [rangeTimestampsByRange, setRangeTimestampsByRange] = useState([])
  const [topAssetLinesByRange, setTopAssetLinesByRange] = useState([])
  const [visibleTopAssetLineIds, setVisibleTopAssetLineIds] = useState([])
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null)
  const [isPartialDataMode, setIsPartialDataMode] = useState(false)

  const { assetRows, gainsUsd, lossesUsd, totalInvestedUsd, balanceUsd, bestPerformer, highestVariationAsset } = useMemo(() => {
    const marketById = new Map(markets.map((coin) => [coin.id, coin]))

    const rows = (primaryPortfolio?.positions ?? [])
      .map((position) => {
        const coin = marketById.get(position.assetId)
        if (!coin) {
          return null
        }

        const amount = Number(position.amount) || 0
        const investedUsd = Number(position.investedUsd) || 0
        const currentPrice = Number(coin.current_price) || 0
        const currentValueUsd = amount * currentPrice
        const pnlUsd = currentValueUsd - investedUsd

        return {
          assetId: position.assetId,
          name: coin.name,
          symbol: coin.symbol?.toUpperCase() ?? '--',
          iconData: getCoinIcon(coin.symbol),
          investedUsd,
          currentPrice,
          currentValueUsd,
          allocationPercent: portfolioSummary.totalValueUsd > 0 ? (currentValueUsd / portfolioSummary.totalValueUsd) * 100 : 0,
          change7d: Number(coin.price_change_percentage_7d_in_currency) || 0,
          change24h: Number(coin.price_change_percentage_24h) || 0,
          trendPath: getSparklinePath(coin.sparkline_in_7d?.price ?? []),
          meanDailyAbsChangePercent: getMeanAbsoluteDailyChangePercent(coin.sparkline_in_7d?.price ?? []),
          pnlUsd,
        }
      })
      .filter(Boolean)

    const gains = rows.filter((row) => row.pnlUsd > 0).reduce((accumulator, row) => accumulator + row.pnlUsd, 0)
    const losses = rows
      .filter((row) => row.pnlUsd < 0)
      .reduce((accumulator, row) => accumulator + Math.abs(row.pnlUsd), 0)
    const totalInvestedUsd = rows.reduce((accumulator, row) => accumulator + row.investedUsd, 0)

    return {
      assetRows: rows.sort((left, right) => right.currentValueUsd - left.currentValueUsd),
      gainsUsd: gains,
      lossesUsd: losses,
      totalInvestedUsd,
      balanceUsd: gains - losses,
      bestPerformer: [...rows].sort((left, right) => right.change7d - left.change7d)[0] ?? null,
      highestVariationAsset: [...rows].sort((left, right) => Math.abs(right.change7d) - Math.abs(left.change7d))[0] ?? null,
    }
  }, [markets, portfolioSummary.totalValueUsd, primaryPortfolio])

  const topPortfolioAssets = useMemo(
    () => assetRows.filter((asset) => asset.assetId !== 'bitcoin' && asset.symbol !== 'BTC').slice(0, 3),
    [assetRows],
  )

  useEffect(() => {
    let isMounted = true

    async function fetchRangeSeries() {
      const days = DAYS_BY_RANGE[selectedRange] ?? 30
      const positions = primaryPortfolio?.positions ?? []
      const uniqueCoinIds = Array.from(new Set(['bitcoin', ...positions.map((position) => position.assetId).filter(Boolean)]))

      try {
        setRangeLoading(true)
        setRangeError('')

        const coinCharts = await Promise.all(
          uniqueCoinIds.map((coinId) =>
            getCoinPerformanceChart({ coinId, days }).then((chart) => ({
              coinId,
              chart,
            })),
          ),
        )

        if (!isMounted) {
          return
        }

        const chartByCoinId = new Map(coinCharts.map((item) => [item.coinId, item.chart]))
        const btcChart = chartByCoinId.get('bitcoin') ?? { prices: [] }
        const btcSeries = extractChartSeries(btcChart)
        const btcTimestamps = extractChartTimestamps(btcChart)
        const chartByAssetId = new Map(
          positions.map((position) => [position.assetId, extractChartSeries(chartByCoinId.get(position.assetId) ?? { prices: [] })]),
        )
        const portfolioSeries = buildPortfolioSeriesFromCharts(positions, chartByAssetId)
        const nextTopAssetLines = topPortfolioAssets
          .map((asset, index) => {
            const assetSeries = chartByAssetId.get(asset.assetId) ?? []

            if (assetSeries.length < 2) {
              return null
            }

            return {
              assetId: asset.assetId,
              symbol: asset.symbol,
              path: getTrendPath(assetSeries),
              color: TOP_ASSET_LINE_COLORS[index] ?? '#22c55e',
            }
          })
          .filter(Boolean)

        setBtcSeriesByRange(btcSeries)
        setPortfolioSeriesByRange(portfolioSeries)
        setRangeTimestampsByRange(btcTimestamps)
        setTopAssetLinesByRange(nextTopAssetLines)
        setVisibleTopAssetLineIds((previousIds) => {
          if (!previousIds.length) {
            return nextTopAssetLines.map((line) => line.assetId)
          }

          const availableIds = new Set(nextTopAssetLines.map((line) => line.assetId))
          const keptIds = previousIds.filter((assetId) => availableIds.has(assetId))

          return keptIds.length ? keptIds : nextTopAssetLines.map((line) => line.assetId)
        })
        setLastUpdatedAt(new Date())
        setIsPartialDataMode(false)
      } catch {
        if (!isMounted) {
          return
        }

        const hasPreviousData = portfolioSeriesByRange.length > 1 && btcSeriesByRange.length > 1
        setRangeError('No se pudo actualizar la serie para el rango seleccionado.')
        setIsPartialDataMode(hasPreviousData)
      } finally {
        if (isMounted) {
          setRangeLoading(false)
        }
      }
    }

    fetchRangeSeries()

    return () => {
      isMounted = false
    }
  }, [primaryPortfolio, selectedRange, topPortfolioAssets])

  const chartPortfolioPath = useMemo(() => getTrendPath(portfolioSeriesByRange), [portfolioSeriesByRange])
  const chartBtcPath = useMemo(() => getTrendPath(btcSeriesByRange), [btcSeriesByRange])
  const chartDateLabels = useMemo(
    () => buildAxisDateLabels(rangeTimestampsByRange, 4),
    [rangeTimestampsByRange],
  )
  const visibleTopAssetLines = useMemo(
    () => topAssetLinesByRange.filter((line) => visibleTopAssetLineIds.includes(line.assetId)),
    [topAssetLinesByRange, visibleTopAssetLineIds],
  )
  const periodStartValue = portfolioSeriesByRange[0] ?? 0
  const periodEndValue = portfolioSeriesByRange[portfolioSeriesByRange.length - 1] ?? 0
  const totalPnlPercent = useMemo(() => {
    if (!totalInvestedUsd) {
      return 0
    }

    return (balanceUsd / totalInvestedUsd) * 100
  }, [balanceUsd, totalInvestedUsd])
  const rangeTitleLabel = selectedRange === 'TODO' ? 'Histórico' : selectedRange
  const rangePeriodLabel = useMemo(() => {
    const labels = {
      '1D': 'Último día',
      '1S': 'Última semana',
      '1M': 'Último mes',
      '1A': 'Último año',
      TODO: 'Todo el histórico',
    }

    return labels[selectedRange] ?? 'Periodo seleccionado'
  }, [selectedRange])
  const portfolioRangeChange = useMemo(() => getSeriesChangePercent(portfolioSeriesByRange), [portfolioSeriesByRange])
  const btcRangeChange = useMemo(() => getSeriesChangePercent(btcSeriesByRange), [btcSeriesByRange])
  const relativeRangeDelta = portfolioRangeChange - btcRangeChange
  const portfolioRangeChangeLabel = useMemo(() => formatSignedPercent(portfolioRangeChange), [portfolioRangeChange])
  const btcRangeChangeLabel = useMemo(() => formatSignedPercent(btcRangeChange), [btcRangeChange])
  const relativeRangeDeltaPpLabel = useMemo(() => {
    const sign = relativeRangeDelta >= 0 ? '+' : '-'
    return `${sign}${Math.abs(relativeRangeDelta).toFixed(2)} pp`
  }, [relativeRangeDelta])
  const insightMessage = useMemo(() => {
    const rangeLabels = {
      '1D': 'el último día',
      '1S': 'la última semana',
      '1M': 'el último mes',
      '1A': 'el último año',
      TODO: null,
    }
    const rangeLabel = rangeLabels[selectedRange] ?? null

    if (!Number.isFinite(relativeRangeDelta)) {
      return rangeLabel
        ? `Sin señal suficiente para comparar Cartera y BTC en ${rangeLabel}.`
        : 'Sin señal suficiente para comparar Cartera y BTC.'
    }

    if (Math.abs(relativeRangeDelta) < 0.1) {
      return rangeLabel ? `Cartera y BTC van en línea en ${rangeLabel}.` : 'Cartera y BTC van en línea.'
    }

    if (relativeRangeDelta > 0) {
      return rangeLabel
        ? `Diferencia vs BTC: +${Math.abs(relativeRangeDelta).toFixed(2)} pp en ${rangeLabel}.`
        : `Diferencia vs BTC: +${Math.abs(relativeRangeDelta).toFixed(2)} pp.`
    }

    return rangeLabel
        ? `Diferencia vs BTC: -${Math.abs(relativeRangeDelta).toFixed(2)} pp en ${rangeLabel}.`
        : `Diferencia vs BTC: -${Math.abs(relativeRangeDelta).toFixed(2)} pp.`
  }, [relativeRangeDelta, selectedRange])

  if (loading) {
    return (
      <div className="custom-scrollbar flex flex-1 items-center justify-center overflow-y-auto p-8">
        <p className="text-sm font-semibold text-slate-400">Cargando análisis...</p>
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
      <div className="flex w-full flex-col gap-6 pb-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#2bee79]/15 p-2">
              <span className="material-symbols-outlined text-[#2bee79]">monitoring</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-100">Análisis Avanzado</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-[#1a2e23] bg-[#14281d] p-1">
              {RANGE_OPTIONS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedRange(period)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    selectedRange === period ? 'bg-[#2bee79] text-[#102217]' : 'text-slate-400 hover:text-[#2bee79]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {lastUpdatedAt ? `Actualizado ${formatRelativeTime(lastUpdatedAt)}` : 'Esperando primera actualización'}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-[#1a2e23] bg-[#14281d] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">Valor Actual</p>
                <span className="material-symbols-outlined text-[#2bee79]">account_balance_wallet</span>
              </div>
              <h3 className="mt-1 text-3xl font-black tracking-tight text-slate-100">
                <CountUpValue value={portfolioSummary.totalValueUsd} formatter={formatCurrency} />
              </h3>
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold ${
                  balanceUsd >= 0 ? 'bg-[#2bee79]/10 text-[#2bee79]' : 'bg-red-500/10 text-red-500'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {balanceUsd >= 0 ? 'trending_up' : 'trending_down'}
                </span>
                <span>
                  <CountUpValue value={balanceUsd} formatter={formatCompactCurrency} /> ({formatSignedPercent(totalPnlPercent)})
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-500">P/L acumulado</p>
            </div>

            <div className="rounded-2xl border border-[#1a2e23] bg-[#14281d] p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">Crecimiento del periodo</p>
                <span className="material-symbols-outlined text-[#2bee79]">query_stats</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-100">{portfolioRangeChangeLabel}</span>
                <span className="text-xs font-bold text-[#2bee79]">{rangePeriodLabel}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a2e23] bg-[#14281d] p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100">Crecimiento del Portafolio ({rangeTitleLabel})</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2bee79]" />
                  <span className="text-xs font-medium text-slate-400">Cartera</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-slate-400">Promedio BTC</span>
                </div>
                {topAssetLinesByRange.map((assetLine) => (
                  <button
                    key={assetLine.assetId}
                    type="button"
                    onClick={() =>
                      setVisibleTopAssetLineIds((previousIds) =>
                        previousIds.includes(assetLine.assetId)
                          ? previousIds.filter((assetId) => assetId !== assetLine.assetId)
                          : [...previousIds, assetLine.assetId],
                      )
                    }
                    className={`flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                      visibleTopAssetLineIds.includes(assetLine.assetId)
                        ? 'border-[#1a2e23] bg-[#102217] text-slate-300'
                        : 'border-[#1a2e23] bg-transparent text-slate-500'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: assetLine.color }} />
                    <span>{assetLine.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-52 w-full rounded-xl border border-[#1a2e23] bg-[#102217]/70 p-4">
              <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="analysis-chart-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2bee79" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="#2bee79" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${chartPortfolioPath} L 100 30 L 0 30 Z`} fill="url(#analysis-chart-fill)" />
                <path
                  d={chartPortfolioPath}
                  fill="none"
                  stroke="#2bee79"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={chartBtcPath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="2 2"
                  vectorEffect="non-scaling-stroke"
                />
                {visibleTopAssetLines.map((assetLine) => (
                  <path
                    key={assetLine.assetId}
                    d={assetLine.path}
                    fill="none"
                    stroke={assetLine.color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    opacity="1"
                  />
                ))}
              </svg>
            </div>

            {isPartialDataMode && (
              <p className="mt-2 inline-flex items-center gap-1 rounded-md border border-[#1a2e23] bg-[#102217] px-2 py-1 text-xs font-semibold text-slate-300">
                <span className="material-symbols-outlined text-sm text-[#2bee79]">info</span>
                Mostrando último dato válido (modo datos parciales)
              </p>
            )}
            {rangeError && !isPartialDataMode && <p className="mt-2 text-xs font-semibold text-red-400">{rangeError}</p>}
            {rangeLoading && <p className="mt-2 text-xs font-semibold text-slate-400">Actualizando serie…</p>}

            <div className="mt-4 flex items-center justify-between text-[10px] font-bold tracking-wide text-slate-500 uppercase">
              {chartDateLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Inicio: {formatCurrency(periodStartValue)}</span>
              <span>Actual: {formatCurrency(periodEndValue)}</span>
            </div>

            <div className="mt-4 rounded-lg border border-[#1a2e23] bg-[#102217]/70 px-3 py-2">
              <p className="text-xs font-semibold text-slate-300">{insightMessage}</p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">Comparación sobre el mismo rango seleccionado.</p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#1a2e23] bg-[#14281d] px-2 py-1 text-[11px] font-semibold text-slate-300">
                  <span className="text-[#2bee79]">Cartera</span>
                  <span>{portfolioRangeChangeLabel}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#1a2e23] bg-[#14281d] px-2 py-1 text-[11px] font-semibold text-slate-300">
                  <span className="text-red-400">BTC</span>
                  <span>{btcRangeChangeLabel}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#1a2e23] bg-[#14281d] px-2 py-1 text-[11px] font-semibold text-slate-300">
                  <span className="text-cyan-400">Dif. vs BTC</span>
                  <span>{relativeRangeDeltaPpLabel}</span>
                </span>
              </div>

              {!!topPortfolioAssets.length && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {topPortfolioAssets.map((asset) => (
                    <span
                      key={asset.assetId}
                      className="inline-flex items-center gap-1 rounded-full border border-[#1a2e23] bg-[#14281d] px-2 py-1 text-[11px] font-semibold text-slate-300"
                    >
                      <span className="text-[#2bee79]">{asset.symbol}</span>
                      <span>{asset.allocationPercent.toFixed(1)}%</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#1a2e23] bg-[#14281d]">
          <div className="border-b border-[#1a2e23] px-6 py-4">
            <h2 className="text-base font-bold text-slate-100">Comparativa de Activos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-230 text-left">
              <thead className="border-b border-[#1a2e23] bg-[#102217]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Activo</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Precio Actual</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Cambio 24h</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Cambio 7D</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tendencia (7D)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2e23]">
                {assetRows.map((row) => (
                  <tr key={row.assetId} className="transition-colors hover:bg-[#1a2e23]/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-full ${row.iconData.iconBg} ${row.iconData.iconColor}`}>
                          <span className="material-symbols-outlined text-xl">{row.iconData.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-100">{row.name}</p>
                          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{row.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-300">{formatCurrency(row.currentPrice)}</td>
                    <td className={`px-6 py-4 text-sm font-bold ${row.change24h >= 0 ? 'text-[#2bee79]' : 'text-red-500'}`}>
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          {row.change24h >= 0 ? 'north_east' : 'south_east'}
                        </span>
                        {formatSignedPercent(row.change24h)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold ${row.change7d >= 0 ? 'text-[#2bee79]' : 'text-red-500'}`}>
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          {row.change7d >= 0 ? 'north_east' : 'south_east'}
                        </span>
                        {formatSignedPercent(row.change7d)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <svg className="h-8 w-24" viewBox="0 0 100 30">
                        <path
                          d={row.trendPath}
                          fill="none"
                          stroke={row.change7d >= 0 ? '#2bee79' : '#ef4444'}
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </td>
                  </tr>
                ))}
                {!assetRows.length && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm font-semibold text-slate-400" colSpan={5}>
                      Sin activos para comparar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#1a2e23] bg-[#14281d] p-5">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Mejor Desempeño (30D)</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2bee79]/15">
                <span className="material-symbols-outlined text-[#2bee79]">workspace_premium</span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-100">{bestPerformer?.name ?? '--'}</p>
                <p className="text-sm font-black text-[#2bee79]">{formatSignedPercent(bestPerformer?.change7d ?? 0)}</p>
              </div>
            </div>
            <div className="mt-4 border-t border-[#1a2e23] pt-4">
              <p className="text-sm text-slate-400">Dominio del portafolio: {(bestPerformer?.allocationPercent ?? 0).toFixed(1)}%</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a2e23] bg-[#14281d] p-5">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Mayor variación 7D</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2bee79]/15">
                <span className="material-symbols-outlined text-[#2bee79]">bolt</span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-100">{highestVariationAsset?.name ?? '--'}</p>
                <p className="text-sm font-black text-[#2bee79]">
                  Variación 7D: {formatSignedPercent(highestVariationAsset?.change7d ?? 0)}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-[#1a2e23] pt-4">
              <p className="text-sm text-slate-400">
                Mayor movimiento absoluto en 7 días: {formatSignedPercent(Math.abs(highestVariationAsset?.change7d ?? 0))}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a2e23] bg-[#14281d] p-5">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Resumen de P/L</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Ganancias Netas</span>
                <span className="text-xl font-black text-[#2bee79]">{formatCurrency(gainsUsd)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pérdidas Netas</span>
                <span className="text-xl font-black text-red-500">-{formatCurrency(lossesUsd)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#1a2e23] pt-3">
                <span className="text-lg font-black text-slate-100">Balance</span>
                <span className={`text-xl font-black ${balanceUsd >= 0 ? 'text-[#2bee79]' : 'text-red-500'}`}>
                  {formatCurrency(balanceUsd)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

const RANGE_OPTIONS = ['1D', '1S', '1M', '1A', 'TODO']
const DAYS_BY_RANGE = {
  '1D': 1,
  '1S': 7,
  '1M': 30,
  '1A': 365,
  TODO: 1825,
}
const TOP_ASSET_LINE_COLORS = ['#22d3ee', '#facc15', '#a78bfa']

function extractChartSeries(chartResponse) {
  return (chartResponse?.prices ?? [])
    .map((entry) => Number(entry?.[1]) || 0)
    .filter((value) => value > 0)
}

function extractChartTimestamps(chartResponse) {
  return (chartResponse?.prices ?? [])
    .map((entry) => Number(entry?.[0]) || 0)
    .filter((value) => value > 0)
}

function formatAxisDate(timestamp) {
  if (!timestamp) {
    return '--'
  }

  return new Date(timestamp)
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    .replace('.', '')
    .toUpperCase()
}

function buildAxisDateLabels(timestamps, labelCount = 4) {
  if (!Array.isArray(timestamps) || timestamps.length < 2) {
    return Array.from({ length: labelCount }, () => '--')
  }

  return Array.from({ length: labelCount }, (_, index) => {
    const ratio = labelCount === 1 ? 0 : index / (labelCount - 1)
    const timestampIndex = Math.min(
      timestamps.length - 1,
      Math.max(0, Math.round((timestamps.length - 1) * ratio)),
    )

    return formatAxisDate(timestamps[timestampIndex])
  })
}

function buildPortfolioSeriesFromCharts(positions, chartByAssetId) {
  if (!positions?.length) {
    return []
  }

  const normalizedSeries = positions
    .map((position) => {
      const prices = chartByAssetId.get(position.assetId) ?? []
      return {
        amount: Number(position.amount) || 0,
        prices,
      }
    })
    .filter((entry) => entry.amount > 0 && entry.prices.length)

  if (!normalizedSeries.length) {
    return []
  }

  const minLength = Math.min(...normalizedSeries.map((entry) => entry.prices.length))

  if (!Number.isFinite(minLength) || minLength < 2) {
    return []
  }

  return Array.from({ length: minLength }, (_, index) => {
    return normalizedSeries.reduce((total, entry) => total + entry.amount * entry.prices[index], 0)
  })
}

function getSeriesChangePercent(series = []) {
  if (!Array.isArray(series) || series.length < 2) {
    return 0
  }

  const first = Number(series[0]) || 0
  const last = Number(series[series.length - 1]) || 0

  if (first <= 0 || last <= 0) {
    return 0
  }

  return ((last - first) / first) * 100
}

function formatRelativeTime(dateValue) {
  if (!dateValue) {
    return '--'
  }

  const now = Date.now()
  const then = new Date(dateValue).getTime()
  const deltaSeconds = Math.max(0, Math.floor((now - then) / 1000))

  if (deltaSeconds < 60) {
    return `hace ${deltaSeconds}s`
  }

  const deltaMinutes = Math.floor(deltaSeconds / 60)
  if (deltaMinutes < 60) {
    return `hace ${deltaMinutes} min`
  }

  const deltaHours = Math.floor(deltaMinutes / 60)
  if (deltaHours < 24) {
    return `hace ${deltaHours} h`
  }

  const deltaDays = Math.floor(deltaHours / 24)
  return `hace ${deltaDays} d`
}