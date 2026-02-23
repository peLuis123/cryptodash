export default function PortfolioPerformanceChart({ chartPath, totalValueLabel, changeLabel, positive }) {
  return (
    <section className="rounded-2xl border border-[#1a2e23] bg-[#14281d] p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-400">Portfolio Performance 30D</p>
          <p className="mt-1 text-2xl font-black text-slate-100">{totalValueLabel}</p>
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

      <div className="h-52 w-full rounded-xl border border-[#1a2e23] bg-[#102217]/70 p-4">
        <svg className="h-full w-full text-[#2bee79]" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="portfolio-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={chartPath} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d={`${chartPath} L 100 30 L 0 30 Z`} fill="url(#portfolio-area)" />
        </svg>
      </div>
    </section>
  )
}
