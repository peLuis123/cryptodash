import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { formatCurrency } from '../../utils/dashboardFormatters'

export default function TransactionDetailModal({ transaction, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transaction.hash)
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(transaction.id)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 overflow-y-auto bg-black/60 backdrop-blur-sm"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative my-8 w-full max-w-2xl rounded-2xl border border-[#2bee79]/20 bg-[#0B1F14] p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-[#2bee79]/10 hover:text-[#2bee79]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <div className={`flex size-12 items-center justify-center rounded-full bg-${transaction.asset.color}-500/20`}>
              <span className={`material-symbols-outlined text-${transaction.asset.color}-500 text-2xl`}>
                {transaction.asset.icon}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-100">Detalle de Transacción</h2>
              <p className="text-sm text-slate-400">
                {transaction.asset.name} ({transaction.asset.symbol})
              </p>
            </div>
            {transaction.type === 'buy' ? (
              <span className="rounded-full border border-[#2bee79]/30 bg-[#2bee79]/20 px-3 py-1.5 text-xs font-black uppercase text-[#2bee79]">
                COMPRA
              </span>
            ) : (
              <span className="rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-xs font-black uppercase text-red-500">
                VENTA
              </span>
            )}
          </div>
        </div>

        {/* Transaction ID */}
        <div className="mb-6 rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">ID de Transacción</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold text-[#2bee79]">{transaction.id}</span>
            <button
              onClick={handleCopyId}
              className="rounded-lg p-2 transition-colors hover:bg-[#2bee79]/10 hover:text-[#2bee79]"
            >
              <span className="material-symbols-outlined text-slate-400">content_copy</span>
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Date */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Fecha y Hora</p>
            <p className="text-sm font-semibold text-slate-100">
              {new Date(transaction.date).toLocaleString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</p>
            {transaction.status === 'completed' && (
              <div className="flex items-center gap-2 text-[#2bee79]">
                <div className="size-2 animate-pulse rounded-full bg-[#2bee79]"></div>
                <span className="text-sm font-bold">Completado</span>
              </div>
            )}
            {transaction.status === 'pending' && (
              <div className="flex items-center gap-2 text-yellow-500">
                <div className="size-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-bold">Pendiente</span>
              </div>
            )}
            {transaction.status === 'failed' && (
              <div className="flex items-center gap-2 text-red-500">
                <div className="size-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-bold">Fallido</span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Cantidad</p>
            <p className="text-lg font-black text-slate-100">
              {transaction.amount} {transaction.asset.symbol}
            </p>
          </div>

          {/* Price */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Precio Unitario</p>
            <p className="text-lg font-black text-slate-100">{formatCurrency(transaction.priceUsd)}</p>
          </div>

          {/* Fee */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Comisión (Fee)</p>
            <p className="text-lg font-black text-slate-400">{formatCurrency(transaction.feeUsd)}</p>
          </div>

          {/* Total */}
          <div className="rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Total</p>
            <p
              className={`text-lg font-black ${transaction.type === 'buy' ? 'text-[#2bee79]' : 'text-red-500'}`}
            >
              {formatCurrency(transaction.totalUsd)}
            </p>
          </div>
        </div>

        {/* Hash Blockchain */}
        <div className="mb-6 rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Hash de Blockchain</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-mono text-sm text-slate-400" title={transaction.hash}>
                {transaction.hash}
              </p>
            </div>
            <button
              onClick={handleCopyHash}
              className="flex items-center gap-2 rounded-lg border border-[#2bee79]/30 bg-[#2bee79]/10 px-3 py-2 text-sm font-bold text-[#2bee79] transition-colors hover:bg-[#2bee79]/20"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copiar
            </button>
          </div>
        </div>

        {/* Network Info */}
        <div className="rounded-xl border border-[#2bee79]/10 bg-[#152A1E] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Red</p>
              <p className="text-sm font-semibold text-slate-100">
                {transaction.asset.symbol === 'BTC' && 'Bitcoin Network'}
                {transaction.asset.symbol === 'ETH' && 'Ethereum Network (ERC-20)'}
                {transaction.asset.symbol === 'SOL' && 'Solana Network'}
                {transaction.asset.symbol === 'USDC' && 'Ethereum Network (ERC-20)'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Confirmaciones</p>
              <p className="text-sm font-semibold text-slate-100">
                {transaction.status === 'completed' ? '✓ 12/12' : transaction.status === 'pending' ? '⏳ 3/12' : '✗ 0/12'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#2bee79]/30 px-4 py-3 font-bold text-[#2bee79] transition-colors hover:bg-[#2bee79]/10"
          >
            Cerrar
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-[#2bee79] bg-[#2bee79]/10 px-4 py-3 font-bold text-[#2bee79] transition-colors hover:bg-[#2bee79] hover:text-[#0B1F14]">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Ver en Explorer
          </button>
        </div>
      </div>
      </div>
    </div>,
    document.body,
  )
}
