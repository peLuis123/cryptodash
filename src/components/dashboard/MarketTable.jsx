import { useTranslations } from '../../hooks/useTranslations'

export default function MarketTable({ marketRows, loading, error }) {
  const t = useTranslations()

  return (
    <>
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-white/5 dark:bg-[#14281d]">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center dark:border-white/5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.dashboard.topAssets}</h2>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-[#1a2e23] dark:text-[#2bee79]">
              {t.transactions.filters.all}
            </button>
            <button type="button" className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-[#1a2e23]/50 dark:text-slate-400">
              {t.dashboard.trending || 'Tendencia'}
            </button>
            <button type="button" className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-[#1a2e23]/50 dark:text-slate-400">
              {t.dashboard.gainers || 'Ganadores'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-100 text-xs font-bold tracking-wider text-slate-600 uppercase dark:bg-[#1a2e23]/20 dark:text-slate-400">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">{t.dashboard.asset}</th>
                <th className="px-6 py-4">{t.dashboard.price}</th>
                <th className="px-6 py-4">{t.dashboard.change24h}</th>
                <th className="px-6 py-4">{t.dashboard.marketCap}</th>
                <th className="px-6 py-4">{t.market.table.volume}</th>
                <th className="px-6 py-4">{t.market.table.last7Days}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {marketRows.map((row) => (
                <tr key={row.rank} className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-[#1a2e23]/30">
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{row.rank}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${row.iconBg}`}>
                        <span className={`material-symbols-outlined text-lg ${row.iconColor}`}>{row.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{row.name}</p>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{row.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-900 dark:text-slate-100">{row.price}</td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-0.5 font-bold ${row.positive ? 'text-emerald-600 dark:text-[#2bee79]' : 'text-red-500'}`}>
                      <span className="material-symbols-outlined text-sm">{row.positive ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                      {row.change}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{row.marketCap}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{row.volume}</td>
                  <td className="px-6 py-5">
                    <div className={`h-8 w-24 ${row.positive ? 'text-emerald-600 dark:text-[#2bee79]' : 'text-red-500'}`}>
                      <svg className="h-full w-full" viewBox="0 0 100 30">
                        <path d={row.trendPath} fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-100 p-6 text-center dark:bg-[#1a2e23]/10">
          <button type="button" className="text-sm font-bold text-emerald-600 hover:underline dark:text-[#2bee79]">
            {t.dashboard.viewAll}
          </button>
        </div>
      </div>
    </>
  )
}
