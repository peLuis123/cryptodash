const PORTFOLIO_STORAGE_KEY = 'crypto_dash_portfolios'
const DEFAULT_ALLOCATION_USD = 2000

function safeParsePortfolios(rawValue) {
  try {
    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readPortfolios() {
  const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY)
  if (!raw) {
    return []
  }

  return safeParsePortfolios(raw)
}

function writePortfolios(portfolios) {
  localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolios))
}

function buildDefaultPosition(assetId, currentPrice) {
  const safePrice = Number(currentPrice) || 1

  return {
    assetId,
    investedUsd: DEFAULT_ALLOCATION_USD,
    amount: DEFAULT_ALLOCATION_USD / safePrice,
    createdAt: new Date().toISOString(),
  }
}

export function getOrCreatePrimaryPortfolio(marketCoins = []) {
  const portfolios = readPortfolios()

  if (!portfolios.length) {
    const coinById = new Map(marketCoins.map((coin) => [coin.id, coin]))
    const preferredDefaultAssetIds = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple']

    const defaultAssetIds = preferredDefaultAssetIds.filter((assetId) => coinById.has(assetId))
    const fallbackAssetIds = marketCoins
      .map((coin) => coin.id)
      .filter((assetId) => !defaultAssetIds.includes(assetId))

    const selectedAssetIds = [...defaultAssetIds, ...fallbackAssetIds].slice(0, 5)

    const positions = selectedAssetIds
      .filter((assetId) => coinById.has(assetId))
      .map((assetId) => buildDefaultPosition(assetId, coinById.get(assetId)?.current_price))

    const newPortfolio = {
      id: 'main',
      name: 'Portafolio Principal',
      positions,
      createdAt: new Date().toISOString(),
    }

    writePortfolios([newPortfolio])
    return newPortfolio
  }

  return portfolios[0]
}

export function addAssetToPrimaryPortfolio({ assetId, currentPrice, allocationUsd = DEFAULT_ALLOCATION_USD }) {
  const portfolios = readPortfolios()

  if (!portfolios.length) {
    return null
  }

  const [primary, ...rest] = portfolios
  const alreadyExists = primary.positions?.some((position) => position.assetId === assetId)

  if (alreadyExists) {
    return primary
  }

  const safePrice = Number(currentPrice) || 1
  const safeAllocation = Number(allocationUsd) || DEFAULT_ALLOCATION_USD

  const nextPrimary = {
    ...primary,
    positions: [
      ...(primary.positions ?? []),
      {
        assetId,
        investedUsd: safeAllocation,
        amount: safeAllocation / safePrice,
        createdAt: new Date().toISOString(),
      },
    ],
  }

  writePortfolios([nextPrimary, ...rest])
  return nextPrimary
}

export function getDefaultAllocationUsd() {
  return DEFAULT_ALLOCATION_USD
}
