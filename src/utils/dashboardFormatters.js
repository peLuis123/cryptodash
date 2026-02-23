const compactUsdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }

  return usdFormatter.format(Number(value))
}

export function formatSignedPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }

  const numericValue = Number(value)
  return `${numericValue >= 0 ? '+' : '-'}${Math.abs(numericValue).toFixed(2)}%`
}

export function formatPrice(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }

  const numericValue = Number(value)
  if (numericValue >= 1) {
    return formatCurrency(numericValue)
  }

  return `$${numericValue.toFixed(6)}`
}

export function formatCompactCurrency(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }

  return compactUsdFormatter.format(Number(value))
}
