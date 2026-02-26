export default function SummaryCardsGrid({ summaryCards }) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-300 dark:border-white/5 dark:bg-[#14281d] dark:hover:border-[#2bee79]/50"
        >
          <div className="mb-4 flex items-start justify-between">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.title}</p>
            <span
              className={`rounded px-2 py-1 text-xs font-bold ${
                card.positive ? 'bg-emerald-100 text-emerald-700 dark:bg-[#2bee79]/10 dark:text-[#2bee79]' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500'
              }`}
            >
              {card.change}
            </span>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{card.value}</h3>
          <div className="h-12 w-full">
            <svg
              className={`h-full w-full ${card.positive ? 'text-emerald-600 dark:text-[#2bee79] sparkline-svg' : 'text-red-500'}`}
              viewBox="0 0 100 30"
            >
              <path d={card.path} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d={`${card.path} V 30 H 0 Z`} fill="currentColor" fillOpacity="0.1" stroke="none" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}
