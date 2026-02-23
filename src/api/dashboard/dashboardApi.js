import apiClient from '../axios'

const GLOBAL_STATS_TTL_MS = 5 * 60 * 1000

let globalStatsCache = {
  data: null,
  timestamp: 0,
  inFlight: null,
}

export async function getGlobalStats() {
  const now = Date.now()

  if (globalStatsCache.data && now - globalStatsCache.timestamp < GLOBAL_STATS_TTL_MS) {
    return globalStatsCache.data
  }

  if (globalStatsCache.inFlight) {
    return globalStatsCache.inFlight
  }

  globalStatsCache.inFlight = apiClient
    .get('/global')
    .then(({ data }) => {
      const normalizedData = data?.data ?? null
      globalStatsCache = {
        data: normalizedData,
        timestamp: Date.now(),
        inFlight: null,
      }

      return normalizedData
    })
    .catch((error) => {
      globalStatsCache = {
        ...globalStatsCache,
        inFlight: null,
      }

      throw error
    })

  return globalStatsCache.inFlight
}
