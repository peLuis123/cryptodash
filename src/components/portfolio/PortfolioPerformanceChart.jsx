import { useTranslations } from '../../hooks/useTranslations'
import { useChartTooltip } from '../../hooks/useChartTooltip'
import { formatCompactCurrency } from '../../utils/dashboardFormatters'

export default function PortfolioPerformanceChart({ chartPath, chartData = [], totalValueLabel, changeLabel, positive }) {
  const t = useTranslations()
  const { tooltip, svgRef, handleMouseMove, handleMouseLeave } = useChartTooltip(chartData, formatCompactCurrency)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#1a2e23] dark:bg-[#14281d]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t.portfolio.performance} {t.dashboard.period['30d']}</p>
          <p className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">{tooltip.visible ? tooltip.value : totalValueLabel}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${
            positive ? 'bg-[#2bee79]/10 text-[#2bee79]' : 'bg-red-500/10 text-red-500'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{positive ? 'trending_up' : 'trending_down'}</span>
          {changeLabel}
        </span>
      </div>

      <div className="relative h-52 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1a2e23] dark:bg-[#102217]/70">
        <svg 
          ref={svgRef}
          className="h-full w-full text-[#2bee79]" 
          viewBox="0 0 100 30" 
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'crosshair' }}
        >
          <defs>
            <linearGradient id="portfolio-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chartPath} fill="none" stroke="currentColor" strokeWidth="0.1" strokeLinecap="round" />
          <path d={`${chartPath} L 100 30 L 0 30 Z`} fill="url(#portfolio-area)" />
          {tooltip.visible && tooltip.index !== null && chartData.length > 0 && (
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
                opacity="0.7"
                vectorEffect="non-scaling-stroke"
              />
              {/* Dot */}
              <circle
                cx={(tooltip.index / (chartData.length - 1)) * 100}
                cy={30 - ((chartData[tooltip.index] - Math.min(...chartData)) / (Math.max(...chartData) - Math.min(...chartData))) * 30}
                r="0.8"
                fill="black"
                stroke="currentColor"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
      </div>
    </section>
  )
}
