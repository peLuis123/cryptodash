import { useEffect, useMemo, useState } from 'react'

import { getGlobalStats } from '../api/dashboard/dashboardApi'
import { getCoinPerformanceChart, getTopMarketCoins } from '../api/market/marketApi'
import { addAssetToPrimaryPortfolio, getDefaultAllocationUsd, getOrCreatePrimaryPortfolio } from '../api/portfolio/portfolioApi'
import { getCoinIcon, getTrendPath } from '../utils/dashboardCharts'
import { formatCompactCurrency, formatPrice, formatSignedPercent } from '../utils/dashboardFormatters'

function buildPortfolioPerformanceSeries(positions, markets) {
  if (!positions?.length || !markets?.length) {
    return []
  }

  const amountByAssetId = new Map(positions.map((position) => [position.assetId, Number(position.amount) || 0]))
  const marketByAssetId = new Map(markets.map((coin) => [coin.id, coin]))

  const validPriceSeries = positions
    .map((entry) => ({
      assetId: entry.assetId,
      prices: (marketByAssetId.get(entry.assetId)?.sparkline_in_7d?.price ?? [])
        .map((item) => Number(item) || 0)
        .filter((price) => price > 0),
    }))
    .filter((entry) => entry.prices.length)

  if (!validPriceSeries.length) {
    return []
  }

  const minLength = Math.min(...validPriceSeries.map((entry) => entry.prices.length))

  if (!Number.isFinite(minLength) || minLength < 2) {
    return []
  }

  return Array.from({ length: minLength }, (_, index) => {
    return validPriceSeries.reduce((accumulator, entry) => {
      const amount = amountByAssetId.get(entry.assetId) ?? 0
      return accumulator + amount * entry.prices[index]
    }, 0)
  })
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [globalData, setGlobalData] = useState(null)
  const [markets, setMarkets] = useState([])
  const [primaryPortfolio, setPrimaryPortfolio] = useState(null)
  const [mainPerformanceSeries, setMainPerformanceSeries] = useState([])
  const [portfolioPerformanceSeries, setPortfolioPerformanceSeries] = useState([])

  useEffect(() => {
    let isMounted = true

    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError('')

        const [globalStats, topMarketCoins, btcChart] = await Promise.all([
          getGlobalStats(),
          getTopMarketCoins(),
          getCoinPerformanceChart({ coinId: 'bitcoin', days: 30 }),
        ])

        if (!isMounted) {
          return
        }

        const nextPrimaryPortfolio = getOrCreatePrimaryPortfolio(topMarketCoins)
        const nextPortfolioSeries = buildPortfolioPerformanceSeries(nextPrimaryPortfolio?.positions ?? [], topMarketCoins)

        if (!isMounted) {
          return
        }

        setGlobalData(globalStats)
        setMarkets(topMarketCoins)
        setMainPerformanceSeries((btcChart?.prices ?? []).map((item) => item[1]))
        setPrimaryPortfolio(nextPrimaryPortfolio)
        setPortfolioPerformanceSeries(nextPortfolioSeries)
      } catch {
        if (!isMounted) {
          return
        }

        setError('No se pudieron cargar datos desde CoinGecko en este momento.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  const marketCapValue = useMemo(() => formatCompactCurrency(globalData?.total_market_cap?.usd), [globalData])
  const marketCapChange = useMemo(() => formatSignedPercent(globalData?.market_cap_change_percentage_24h_usd), [globalData])
  const marketCapPositive = (globalData?.market_cap_change_percentage_24h_usd ?? 0) >= 0
  const volumeValue = useMemo(() => formatCompactCurrency(globalData?.total_volume?.usd), [globalData])

  const portfolioSummary = useMemo(() => {
    if (!primaryPortfolio?.positions?.length) {
      return {
        name: primaryPortfolio?.name ?? 'Portafolio Principal',
        totalValueUsd: 0,
        investedUsd: 0,
        change24hUsd: 0,
        change24hPercent: 0,
      }
    }

    const marketById = new Map(markets.map((coin) => [coin.id, coin]))

    const aggregation = primaryPortfolio.positions.reduce(
      (accumulator, position) => {
        const coin = marketById.get(position.assetId)
        if (!coin) {
          return accumulator
        }

        const amount = Number(position.amount) || 0
        const currentPrice = Number(coin.current_price) || 0
        const currentValue = amount * currentPrice
        const dailyDelta = amount * (Number(coin.price_change_24h) || 0)

        return {
          investedUsd: accumulator.investedUsd + (Number(position.investedUsd) || 0),
          totalValueUsd: accumulator.totalValueUsd + currentValue,
          change24hUsd: accumulator.change24hUsd + dailyDelta,
        }
      },
      { investedUsd: 0, totalValueUsd: 0, change24hUsd: 0 },
    )

    const previousValue = aggregation.totalValueUsd - aggregation.change24hUsd
    const change24hPercent = previousValue > 0 ? (aggregation.change24hUsd / previousValue) * 100 : 0

    return {
      name: primaryPortfolio.name,
      investedUsd: aggregation.investedUsd,
      totalValueUsd: aggregation.totalValueUsd,
      change24hUsd: aggregation.change24hUsd,
      change24hPercent,
    }
  }, [markets, primaryPortfolio])

  const summaryCards = useMemo(() => {
    const btc = markets.find((coin) => coin.symbol?.toUpperCase() === 'BTC')
    const eth = markets.find((coin) => coin.symbol?.toUpperCase() === 'ETH')
    const portfolioDailyDeltaValue = `${portfolioSummary.change24hUsd >= 0 ? '+' : '-'}${formatCompactCurrency(
      Math.abs(portfolioSummary.change24hUsd),
    )}`

    return [
      {
        title: 'Total Portfolio Balance',
        value: formatCompactCurrency(portfolioSummary.totalValueUsd),
        change: formatSignedPercent(portfolioSummary.change24hPercent),
        positive: portfolioSummary.change24hUsd >= 0,
        path: btc ? getTrendPath(btc.sparkline_in_7d?.price) : 'M0 15 L 100 15',
      },
      {
        title: 'Portfolio 24h Change',
        value: portfolioDailyDeltaValue,
        change: formatSignedPercent(portfolioSummary.change24hPercent),
        positive: portfolioSummary.change24hUsd >= 0,
        path: eth ? getTrendPath(eth.sparkline_in_7d?.price) : 'M0 15 L 100 15',
      },
      {
        title: 'Precio BTC',
        value: formatPrice(btc?.current_price),
        change: formatSignedPercent(btc?.price_change_percentage_24h),
        positive: (btc?.price_change_percentage_24h ?? 0) >= 0,
        path: btc ? getTrendPath(btc.sparkline_in_7d?.price) : 'M0 15 L 100 15',
      },
      {
        title: 'Precio ETH',
        value: formatPrice(eth?.current_price),
        change: formatSignedPercent(eth?.price_change_percentage_24h),
        positive: (eth?.price_change_percentage_24h ?? 0) >= 0,
        path: eth ? getTrendPath(eth.sparkline_in_7d?.price) : 'M0 15 L 100 15',
      },
    ]
  }, [markets, portfolioSummary])

  const marketRows = useMemo(
    () =>
      markets.map((coin) => {
        const iconData = getCoinIcon(coin.symbol)

        return {
          rank: coin.market_cap_rank,
          name: coin.name,
          symbol: coin.symbol?.toUpperCase(),
          price: formatPrice(coin.current_price),
          change: formatSignedPercent(coin.price_change_percentage_24h).replace('+', ''),
          positive: (coin.price_change_percentage_24h ?? 0) >= 0,
          marketCap: formatCompactCurrency(coin.market_cap),
          volume: formatCompactCurrency(coin.total_volume),
          iconBg: iconData.iconBg,
          iconColor: iconData.iconColor,
          icon: iconData.icon,
          trendPath: getTrendPath(coin.sparkline_in_7d?.price),
        }
      }),
    [markets],
  )

  const mainPerformancePath = useMemo(() => getTrendPath(mainPerformanceSeries), [mainPerformanceSeries])
  const mainPerformanceFirst = mainPerformanceSeries[0]
  const mainPerformanceLast = mainPerformanceSeries[mainPerformanceSeries.length - 1]
  const mainPerformanceChange =
    mainPerformanceFirst && mainPerformanceLast
      ? ((mainPerformanceLast - mainPerformanceFirst) / mainPerformanceFirst) * 100
      : null
  const mainPerformancePositive = (mainPerformanceChange ?? 0) >= 0
  const mainPerformancePriceLabel = formatPrice(mainPerformanceLast)
  const mainPerformanceChangeLabel = formatSignedPercent(mainPerformanceChange)

  const portfolioPerformancePath = useMemo(() => getTrendPath(portfolioPerformanceSeries), [portfolioPerformanceSeries])
  const portfolioPerformanceFirst = portfolioPerformanceSeries[0]
  const portfolioPerformanceLast = portfolioPerformanceSeries[portfolioPerformanceSeries.length - 1]
  const portfolioPerformanceChange =
    portfolioPerformanceFirst && portfolioPerformanceLast
      ? ((portfolioPerformanceLast - portfolioPerformanceFirst) / portfolioPerformanceFirst) * 100
      : null
  const portfolioPerformancePositive = (portfolioPerformanceChange ?? 0) >= 0
  const portfolioPerformancePriceLabel = formatPrice(portfolioPerformanceLast)
  const portfolioPerformanceChangeLabel = formatSignedPercent(portfolioPerformanceChange)

  useEffect(() => {
    setPortfolioPerformanceSeries(buildPortfolioPerformanceSeries(primaryPortfolio?.positions ?? [], markets))
  }, [markets, primaryPortfolio])

  async function addAssetToPortfolio({ assetId, allocationUsd = getDefaultAllocationUsd() }) {
    if (!assetId) {
      throw new Error('Debes seleccionar un activo.')
    }

    const marketCoin = markets.find((coin) => coin.id === assetId)
    if (!marketCoin) {
      throw new Error('Activo no disponible en el mercado actual.')
    }

    const updatedPortfolio = addAssetToPrimaryPortfolio({
      assetId,
      currentPrice: marketCoin.current_price,
      allocationUsd,
    })

    if (!updatedPortfolio) {
      throw new Error('No se pudo actualizar el portafolio.')
    }

    setPrimaryPortfolio(updatedPortfolio)

    return updatedPortfolio
  }

  return {
    loading,
    error,
    marketCapValue,
    marketCapChange,
    marketCapPositive,
    volumeValue,
    summaryCards,
    marketRows,
    mainPerformancePath,
    mainPerformancePriceLabel,
    mainPerformanceChangeLabel,
    mainPerformancePositive,
    markets,
    primaryPortfolio,
    portfolioPerformancePath,
    portfolioPerformancePriceLabel,
    portfolioPerformanceChangeLabel,
    portfolioPerformancePositive,
    defaultPortfolioAllocationUsd: getDefaultAllocationUsd(),
    portfolioSummary,
    addAssetToPortfolio,
  }
}
