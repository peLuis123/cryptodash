export default function MainPerformanceChart({ chartPath, priceLabel, changeLabel, positive }) {
  return (
    <div className="mb-10 overflow-hidden rounded-3xl border border-white/5 bg-[#14281d] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Main Performance Chart</h2>
          <p className="text-sm text-slate-400">Bitcoin rendimiento 30 días</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-100">{priceLabel}</p>
          <p className={`text-sm font-bold ${positive ? 'text-[#2bee79]' : 'text-red-500'}`}>{changeLabel}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="h-56 w-full rounded-2xl border border-white/5 bg-[#102217]/60 p-4">
          <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path
              d={chartPath}
              fill="none"
              stroke="currentColor"
              className={positive ? 'text-[#2bee79]' : 'text-red-500'}
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
