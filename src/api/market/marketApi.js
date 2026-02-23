import apiClient from '../axios'

const MARKET_CACHE_TTL_MS = 5 * 60 * 1000
const topMarketCoinsCache = new Map()
const performanceChartCache = new Map()

function getCachedEntry(cacheMap, key) {
  const cached = cacheMap.get(key)

  if (!cached) {
    return null
  }

  if (cached.data && Date.now() - cached.timestamp < MARKET_CACHE_TTL_MS) {
    return cached
  }

  if (!cached.inFlight) {
    cacheMap.delete(key)
    return null
  }

  return cached
}

export async function getTopMarketCoins({
  vsCurrency = 'usd',
  order = 'market_cap_desc',
  perPage = 10,
  page = 1,
  sparkline = true,
  priceChangePercentage = '24h,7d',
} = {}) {
  const requestParams = {
    vs_currency: vsCurrency,
    order,
    per_page: perPage,
    page,
    sparkline,
    price_change_percentage: priceChangePercentage,
  }

  const cacheKey = JSON.stringify(requestParams)
  const cached = getCachedEntry(topMarketCoinsCache, cacheKey)

  if (cached?.data) {
    return cached.data
  }

  if (cached?.inFlight) {
    return cached.inFlight
  }

  const inFlight = apiClient
    .get('/coins/markets', { params: requestParams })
    .then(({ data }) => {
      const normalizedData = data ?? []
      topMarketCoinsCache.set(cacheKey, {
        data: normalizedData,
        timestamp: Date.now(),
        inFlight: null,
      })

      return normalizedData
    })
    .catch((error) => {
      topMarketCoinsCache.delete(cacheKey)
      throw error
    })

  topMarketCoinsCache.set(cacheKey, {
    data: null,
    timestamp: 0,
    inFlight,
  })

  return inFlight
}

export async function getCoinPerformanceChart({ coinId = 'bitcoin', vsCurrency = 'usd', days = 30 } = {}) {
  const requestParams = {
    coinId,
    vs_currency: vsCurrency,
    days,
  }

  const cacheKey = JSON.stringify(requestParams)
  const cached = getCachedEntry(performanceChartCache, cacheKey)

  if (cached?.data) {
    return cached.data
  }

  if (cached?.inFlight) {
    return cached.inFlight
  }

  const inFlight = apiClient
    .get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vsCurrency,
        days,
      },
    })
    .then(({ data }) => {
      const normalizedData = data ?? { prices: [] }
      performanceChartCache.set(cacheKey, {
        data: normalizedData,
        timestamp: Date.now(),
        inFlight: null,
      })

      return normalizedData
    })
    .catch((error) => {
      performanceChartCache.delete(cacheKey)
      throw error
    })

  performanceChartCache.set(cacheKey, {
    data: null,
    timestamp: 0,
    inFlight,
  })

  return inFlight
}
