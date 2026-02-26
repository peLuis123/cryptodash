import { useState, useCallback, useRef } from 'react'

/**
 * Hook for managing chart tooltip interactions
 * @param {Array} dataPoints - Array of data values to display
 * @param {Function} formatValue - Function to format the tooltip value
 * @returns {Object} Tooltip state and handlers
 */
export function useChartTooltip(dataPoints = [], formatValue = (v) => v) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: null, index: null })
  const svgRef = useRef(null)

  const handleMouseMove = useCallback(
    (event) => {
      if (!svgRef.current || !dataPoints.length) return

      const svg = svgRef.current
      const rect = svg.getBoundingClientRect()
      const x = event.clientX - rect.left
      const relativeX = x / rect.width

      const index = Math.round(relativeX * (dataPoints.length - 1))
      const clampedIndex = Math.max(0, Math.min(dataPoints.length - 1, index))
      const value = dataPoints[clampedIndex]

      setTooltip({
        visible: true,
        x: x,
        y: rect.height / 2,
        value: formatValue(value),
        index: clampedIndex,
      })
    },
    [dataPoints, formatValue]
  )

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, x: 0, y: 0, value: null, index: null })
  }, [])

  return {
    tooltip,
    svgRef,
    handleMouseMove,
    handleMouseLeave,
  }
}
