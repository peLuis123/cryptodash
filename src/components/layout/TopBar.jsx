export default function TopBar({ marketCapValue, marketCapChange, marketCapPositive, volumeValue }) {
  return (
    <header className="z-10 flex h-16 items-center justify-between border-b border-[#1a2e23] bg-[#102217]/50 px-8 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Cap. de Mercado:</span>
          <span className="text-sm font-bold text-slate-100">{marketCapValue}</span>
          <span className={`flex items-center text-xs font-bold ${marketCapPositive ? 'text-[#2bee79]' : 'text-red-500'}`}>
            <span className="material-symbols-outlined text-xs">{marketCapPositive ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
            {marketCapChange}
          </span>
        </div>
        <div className="h-4 w-px bg-[#1a2e23]" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Vol 24h:</span>
          <span className="text-sm font-bold text-slate-100">{volumeValue}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="cursor-pointer text-slate-500 transition-colors hover:text-[#2bee79]">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button
          type="button"
          className="rounded-lg bg-[#1a2e23] p-2 text-slate-300 transition-colors hover:text-[#2bee79]"
        >
          <span className="material-symbols-outlined text-[20px]">dark_mode</span>
        </button>
        <div className="flex items-center gap-3 border-l border-[#1a2e23] pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-100">Alex Rivera</p>
            <p className="text-[10px] font-bold text-[#2bee79] uppercase">Inversor Pro</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#2bee79]/50 bg-[#2bee79]/30">
            <img
              className="h-full w-full object-cover"
              alt="User profile avatar portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc7m-JVmuLCZstOmHxoEHZpYYFx-BeAVCWR38mmYOc3KKfuZaNdjK0b6nd904DXMm0CbihhNmPjn_kA7DVqDNZBW7PacZUbve0kq0haG9I30_q1cdt8wN0t4DtCYlQE0z-9Tq2uvcNqAG1XAV29S_t2_v_NTFRbn0JQ85socX8Mp8lxVqIgejE0IDhynTLY93pPwR3Lma5VEZhQF9uuO6I5UbGB3zmEZUkyH7DwC9ZAAo6U-Jv_qbWd701YrpoZJn1-IaJdN962o8"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
