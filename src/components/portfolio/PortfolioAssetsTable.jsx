import { getCoinIcon } from '../../utils/dashboardCharts'
import { formatCurrency, formatPrice } from '../../utils/dashboardFormatters'

function WeeklyTrendBadge({ value }) {
  const numericValue = Number(value) || 0
  const positive = numericValue >= 0

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold ${positive ? 'text-[#2bee79]' : 'text-red-500'}`}>
        {positive ? '+' : '-'}{Math.abs(numericValue).toFixed(2)}%
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#1a2e23]">
        <div
          className={`h-full rounded-full ${positive ? 'bg-[#2bee79]' : 'bg-red-500'}`}
          style={{ width: `${Math.min(Math.abs(numericValue) * 8, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default function PortfolioAssetsTable({ rows }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#1a2e23] bg-[#14281d]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-230 text-left">
          <thead className="border-b border-[#1a2e23] bg-[#102217]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Activo</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tenencias</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Precio actual</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Valor (USD)</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">24h %</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Tendencia 7D</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Asignación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a2e23]">
            {rows.map((row) => {
              const iconData = getCoinIcon(row.symbol)
              const positive24h = row.change24h >= 0

              return (
                <tr
                  key={row.assetId}
                  className="cursor-default transition-all duration-200 hover:translate-x-0.5 hover:bg-[#2bee79]/5"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-full ${iconData.iconBg} ${iconData.iconColor}`}>
                        <span className="material-symbols-outlined text-xl">{iconData.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100">{row.name}</p>
                        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{row.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-200">{row.amountLabel}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(row.investedUsd)}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-200">{formatPrice(row.currentPrice)}</td>
                  <td className="px-6 py-5 text-right text-sm font-black text-slate-100">{formatCurrency(row.currentValueUsd)}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1 text-sm font-bold ${positive24h ? 'text-[#2bee79]' : 'text-red-500'}`}>
                      <span className="material-symbols-outlined text-xs">{positive24h ? 'arrow_upward' : 'arrow_downward'}</span>
                      {Math.abs(row.change24h).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <WeeklyTrendBadge value={row.change7d} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#1a2e23]">
                        <div className="h-full rounded-full bg-[#2bee79]" style={{ width: `${row.allocationPercent.toFixed(1)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-300">{row.allocationPercent.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#1a2e23] bg-[#102217] px-6 py-4">
        <p className="text-xs font-medium text-slate-500">Mostrando {rows.length} activos del portafolio</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="cursor-not-allowed rounded border border-[#1a2e23] px-3 py-1 text-xs font-bold text-slate-500 opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            className="rounded border border-[#1a2e23] px-3 py-1 text-xs font-bold text-slate-300 transition-colors hover:border-[#2bee79]/40 hover:text-[#2bee79]"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  )
}
