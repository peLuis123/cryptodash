import { useTranslations } from '../../hooks/useTranslations'
import { useChartTooltip } from '../../hooks/useChartTooltip'
import { formatPrice } from '../../utils/dashboardFormatters'

export default function MainPerformanceChart({ chartPath, chartData = [], priceLabel, changeLabel, positive }) {
  const t = useTranslations()
  const { tooltip, svgRef, handleMouseMove, handleMouseLeave } = useChartTooltip(chartData, formatPrice)

  return (
    <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#14281d]">
      <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-white/5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.dashboard.performance}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Bitcoin {t.dashboard.period['30d']}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{tooltip.visible ? tooltip.value : priceLabel}</p>
          <p className={`text-sm font-bold ${positive ? 'text-emerald-600 dark:text-[#2bee79]' : 'text-red-500'}`}>{changeLabel}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="relative h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-[#102217]/60">
          <svg 
            ref={svgRef}
            className="h-full w-full" 
            viewBox="0 0 100 30" 
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'crosshair' }}
          >
            <path
              d={chartPath}
              fill="none"
              stroke="currentColor"
              className={positive ? 'text-emerald-600 dark:text-[#2bee79]' : 'text-red-500'}
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {tooltip.visible && tooltip.index !== null && (
              <>
                {/* Vertical line */}
                <line
                  x1={(tooltip.index / (chartData.length - 1)) * 100}
                  y1="0"
                  x2={(tooltip.index / (chartData.length - 1)) * 100}
                  y2="30"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  opacity="0.5"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Dot */}
                <circle
                  cx={(tooltip.index / (chartData.length - 1)) * 100}
                  cy={30 - ((chartData[tooltip.index] - Math.min(...chartData)) / (Math.max(...chartData) - Math.min(...chartData))) * 30}
                  r="0.8"
                  fill="black"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
