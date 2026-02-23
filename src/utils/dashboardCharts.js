export function getChartPoints(values) {
  if (!Array.isArray(values) || values.length < 2) {
    return []
  }

  const maxPoints = 120
  const step = Math.max(1, Math.ceil(values.length / maxPoints))
  const sampledValues = values.filter((_, index) => index % step === 0)

  if (sampledValues[sampledValues.length - 1] !== values[values.length - 1]) {
    sampledValues.push(values[values.length - 1])
  }

  const min = Math.min(...sampledValues)
  const max = Math.max(...sampledValues)
  const range = max - min || 1

  return sampledValues.map((value, index) => {
    const x = (index / (sampledValues.length - 1)) * 100
    const normalized = (value - min) / range
    const y = 30 - normalized * 30

    return {
      x,
      y,
      value,
    }
  })
}

export function getTrendPath(values) {
  const points = getChartPoints(values)

  if (points.length < 2) {
    return 'M0 15 L 100 15'
  }

  return points
    .map((point, index) => {
      return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    })
    .join(' ')
}

export function getCoinIcon(symbol) {
  const normalizedSymbol = (symbol ?? '').toUpperCase()

  if (normalizedSymbol === 'BTC') {
    return { icon: 'currency_bitcoin', iconBg: 'bg-orange-500/20', iconColor: 'text-orange-500' }
  }
  if (normalizedSymbol === 'ETH') {
    return { icon: 'eco', iconBg: 'bg-indigo-500/20', iconColor: 'text-indigo-500' }
  }
  if (normalizedSymbol === 'SOL') {
    return { icon: 'bolt', iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-500' }
  }
  if (normalizedSymbol === 'BNB') {
    return { icon: 'diamond', iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-500' }
  }

  return { icon: 'token', iconBg: 'bg-slate-500/20', iconColor: 'text-slate-300' }
}
