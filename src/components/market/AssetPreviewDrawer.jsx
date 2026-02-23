import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { formatCurrency, formatCompactCurrency } from '../../utils/dashboardFormatters'

export default function AssetPreviewDrawer({ asset, onClose, onViewInPortfolio }) {
  // Prevent body scroll and handle ESC key when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const change24h = asset.price_change_percentage_24h || 0
  const isPositive = change24h >= 0

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9998 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
        onClick={onClose}
      ></div>

      {/* Drawer Panel */}
      <aside
        className="fixed right-0 top-0 z-9999 flex h-screen w-96 flex-col overflow-y-auto border-l border-[#2bee79]/10 bg-[#152A1E] shadow-2xl"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2bee79]/10 p-6">
          <h3 className="font-bold text-slate-100">Vista Previa</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-[#2bee79]/10 hover:text-slate-100"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8 p-8">
          {/* Asset Header */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center overflow-hidden rounded-2xl shadow-lg">
              <img src={asset.image} alt={asset.name} className="size-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{asset.name}</h2>
            <p className="font-medium text-slate-500">
              {asset.symbol?.toUpperCase()} / USD
            </p>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-4xl font-bold tabular-nums text-slate-100">{formatCurrency(asset.current_price)}</span>
              <span
                className={`mt-1 flex items-center gap-1 font-bold ${isPositive ? 'text-[#2bee79]' : 'text-red-500'}`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                </span>
                {isPositive ? '+' : ''}
                {change24h.toFixed(2)}% (24h)
              </span>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#0B1F14]/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rendimiento 7D</span>
              <span
                className={`text-[10px] font-bold ${
                  asset.price_change_percentage_7d_in_currency >= 0 ? 'text-[#2bee79]' : 'text-red-500'
                }`}
              >
                {asset.price_change_percentage_7d_in_currency >= 0 ? '+' : ''}
                {asset.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </span>
            </div>
            <div className="relative h-24 w-full">
              {asset.sparkline_in_7d?.price && (
                <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`gradient-${asset.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={asset.price_change_percentage_7d_in_currency >= 0 ? '#2bee79' : '#ff4d4d'}
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor={asset.price_change_percentage_7d_in_currency >= 0 ? '#2bee79' : '#ff4d4d'}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={generateSparklinePath(asset.sparkline_in_7d.price)}
                    fill={`url(#gradient-${asset.id})`}
                    stroke={asset.price_change_percentage_7d_in_currency >= 0 ? '#2bee79' : '#ff4d4d'}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Market Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">Cap. Mercado</p>
              <p className="text-sm font-bold tabular-nums text-slate-100">{formatCompactCurrency(asset.market_cap)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">Volumen (24h)</p>
              <p className="text-sm font-bold tabular-nums text-slate-100">{formatCompactCurrency(asset.total_volume)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">Suministro Circulante</p>
              <p className="text-sm font-bold tabular-nums text-slate-100">
                {asset.circulating_supply
                  ? `${(asset.circulating_supply / 1000000).toFixed(1)}M ${asset.symbol?.toUpperCase()}`
                  : 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">Máximo (24h)</p>
              <p className="text-sm font-bold tabular-nums text-[#2bee79]">{formatCurrency(asset.high_24h)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">Mínimo (24h)</p>
              <p className="text-sm font-bold tabular-nums text-red-500">{formatCurrency(asset.low_24h)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-500">ATH</p>
              <p className="text-sm font-bold tabular-nums text-slate-100">{formatCurrency(asset.ath)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => onViewInPortfolio(asset.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2bee79] py-3 font-bold text-[#0B1F14] shadow-lg shadow-[#2bee79]/10 transition-all hover:bg-[#2bee79]/90"
            >
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              Ver en Portafolio
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a2e24]/50 py-3 font-bold text-slate-100 transition-all hover:bg-[#1a2e24]">
              <span className="material-symbols-outlined text-xl">notifications_active</span>
              Seguir Activo
            </button>
          </div>

          {/* Market Insights */}
          <div className="border-t border-[#2bee79]/10 pt-6">
            <p className="mb-3 text-[10px] font-bold uppercase text-slate-500">Market Insights (Demo)</p>
            <div className="space-y-4">
              <div className="group cursor-pointer">
                <h4 className="line-clamp-2 text-xs font-bold text-slate-100 transition-colors group-hover:text-[#2bee79]">
                  Análisis técnico: {asset.name} muestra señales de consolidación
                </h4>
                <p className="mt-1 text-[10px] text-slate-500">Datos de mercado simulados</p>
              </div>
              <div className="group cursor-pointer">
                <h4 className="line-clamp-2 text-xs font-bold text-slate-100 transition-colors group-hover:text-[#2bee79]">
                  Volumen institucional incrementa interés en {asset.symbol?.toUpperCase()}
                </h4>
                <p className="mt-1 text-[10px] text-slate-500">Información de demostración</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#0B1F14]/50 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">Información Adicional</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Ranking:</span>
                <span className="font-bold text-slate-100">#{asset.market_cap_rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Última actualización:</span>
                <span className="font-bold text-slate-100">
                  {asset.last_updated ? new Date(asset.last_updated).toLocaleTimeString('es-ES') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>,
    document.body,
  )
}

// Helper para generar path del sparkline con área rellena
function generateSparklinePath(prices) {
  if (!prices || prices.length === 0) return ''

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const points = prices.map((price, index) => {
    const x = (index / (prices.length - 1)) * 100
    const y = 40 - ((price - min) / range) * 35
    return `${x},${y}`
  })

  // Create a closed path for fill
  const pathData = `M 0,40 L ${points.join(' L ')} L 100,40 Z`
  return pathData
}
