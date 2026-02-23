import { useEffect, useMemo, useState } from 'react'

const animationDurationMs = 900

export default function CountUpValue({ value = 0, formatter }) {
  const targetValue = Number(value) || 0
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!targetValue) {
      setDisplayValue(0)
      return
    }

    let rafId = null
    const startAt = performance.now()

    function animate(now) {
      const progress = Math.min((now - startAt) / animationDurationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplayValue(targetValue * eased)

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [targetValue])

  const formattedValue = useMemo(() => {
    if (typeof formatter === 'function') {
      return formatter(displayValue)
    }

    return String(displayValue)
  }, [displayValue, formatter])

  return <>{formattedValue}</>
}
