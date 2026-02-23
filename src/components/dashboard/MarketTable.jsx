export default function MarketTable({ marketRows, loading, error }) {
  return (
    <>
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#14281d] shadow-xl">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/5 p-6 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-slate-100">Principales Activos por Capitalización</h2>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg bg-[#1a2e23] px-4 py-2 text-sm font-semibold text-[#2bee79]">
              Todos
            </button>
            <button type="button" className="rounded-lg bg-[#1a2e23]/50 px-4 py-2 text-sm font-semibold text-slate-400">
              Tendencia
            </button>
            <button type="button" className="rounded-lg bg-[#1a2e23]/50 px-4 py-2 text-sm font-semibold text-slate-400">
              Ganadores
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#1a2e23]/20 text-xs font-bold tracking-wider text-slate-400 uppercase">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Activo</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">24h %</th>
                <th className="px-6 py-4">Cap. de Mercado</th>
                <th className="px-6 py-4">Volumen</th>
                <th className="px-6 py-4">Tendencia (7d)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {marketRows.map((row) => (
                <tr key={row.rank} className="group cursor-pointer transition-colors hover:bg-[#1a2e23]/30">
                  <td className="px-6 py-5 text-sm font-medium text-slate-400">{row.rank}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${row.iconBg}`}>
                        <span className={`material-symbols-outlined text-lg ${row.iconColor}`}>{row.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{row.name}</p>
                        <p className="text-xs font-medium text-slate-400">{row.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-100">{row.price}</td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-0.5 font-bold ${row.positive ? 'text-[#2bee79]' : 'text-red-500'}`}>
                      <span className="material-symbols-outlined text-sm">{row.positive ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                      {row.change}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-400">{row.marketCap}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-400">{row.volume}</td>
                  <td className="px-6 py-5">
                    <div className={`h-8 w-24 ${row.positive ? 'text-[#2bee79]' : 'text-red-500'}`}>
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

        <div className="bg-[#1a2e23]/10 p-6 text-center">
          <button type="button" className="text-sm font-bold text-[#2bee79] hover:underline">
            Ver Todos los Activos (2,500+)
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-6 text-center text-sm text-slate-400">Cargando datos de mercado...</div>
      )}
    </>
  )
}
