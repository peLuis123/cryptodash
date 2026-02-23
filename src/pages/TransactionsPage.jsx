import { useState } from 'react'

import TransactionDetailModal from '../components/transactions/TransactionDetailModal'
import { formatCurrency } from '../utils/dashboardFormatters'

// Mock data con totales matemáticamente coherentes
const MOCK_TRANSACTIONS = [
  {
    id: 'TX-90245',
    date: '2026-02-18T14:30:00',
    asset: { name: 'Bitcoin', symbol: 'BTC', icon: 'currency_bitcoin', color: 'orange' },
    type: 'buy',
    amount: 0.12,
    priceUsd: 34240.5,
    totalUsd: 4108.86,
    feeUsd: 12.33,
    status: 'completed',
    hash: '0x7f3b8c2a9e1d4f6b8a2c5e9f1a3b7c4d9e2f5a8b1c6d3e7f9a2b4c8d1e5f7a9b',
  },
  {
    id: 'TX-89112',
    date: '2026-02-17T09:15:00',
    asset: { name: 'Ethereum', symbol: 'ETH', icon: 'monetization_on', color: 'indigo' },
    type: 'sell',
    amount: 2.5,
    priceUsd: 1850.2,
    totalUsd: 4625.5,
    feeUsd: 9.25,
    status: 'completed',
    hash: '0x3c9f2e5b7a4d1c8f6e9b2a5d3c7f1e4b8a6c2d9e5f7a3b1c4d8e2f6a9c5b7e',
  },
  {
    id: 'TX-88001',
    date: '2026-02-17T08:45:00',
    asset: { name: 'Solana', symbol: 'SOL', icon: 'token', color: 'emerald' },
    type: 'buy',
    amount: 45.0,
    priceUsd: 32.12,
    totalUsd: 1445.4,
    feeUsd: 4.34,
    status: 'pending',
    hash: '0x1a8e4f2c9b6d3a7e5c2f8b4a1d7c9e3f6b2a8c5d1e9f7a4b3c6d8e2f5a9b1c',
  },
  {
    id: 'TX-87995',
    date: '2026-02-16T18:20:00',
    asset: { name: 'USDC', symbol: 'USDC', icon: 'attach_money', color: 'blue' },
    type: 'buy',
    amount: 1200.0,
    priceUsd: 1.0,
    totalUsd: 1200.0,
    feeUsd: 3.6,
    status: 'failed',
    hash: '0x9e5b3c7f1a4d8e2b6c9f3a5d1c8e4b7f2a6c9d3e5f8a1b4c7d9e2f6a3b5c8e',
  },
  {
    id: 'TX-86542',
    date: '2026-02-16T10:05:00',
    asset: { name: 'Bitcoin', symbol: 'BTC', icon: 'currency_bitcoin', color: 'orange' },
    type: 'sell',
    amount: 0.05,
    priceUsd: 33980.1,
    totalUsd: 1699.0,
    feeUsd: 5.1,
    status: 'completed',
    hash: '0x2f7a4c9e1b6d8f3a5c2e7b9a4d1c6f8e3b5a9c2d7e1f4a8b6c3d9e5f2a7b4c',
  },
]

// Calcular totales reales para coherencia
const TOTAL_TRANSACTIONS = MOCK_TRANSACTIONS.length
const BUY_COUNT = MOCK_TRANSACTIONS.filter((t) => t.type === 'buy').length
const SELL_COUNT = MOCK_TRANSACTIONS.filter((t) => t.type === 'sell').length
const TOTAL_VOLUME = MOCK_TRANSACTIONS.reduce((acc, t) => acc + t.totalUsd, 0)

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAsset, setFilterAsset] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Filtrado de transacciones
  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' || tx.type === filterType
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus
    const matchesAsset = filterAsset === 'all' || tx.asset.symbol === filterAsset

    return matchesSearch && matchesType && matchesStatus && matchesAsset
  })

  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
      <div className="flex w-full flex-col gap-6 pb-10">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-100">Historial de Transacciones</h2>
            <p className="text-slate-400">Rastrea tu actividad comercial y movimientos de cartera</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-all hover:border-[#2bee79] dark:border-[#2bee79]/10 dark:bg-[#152A1E]">
              <span className="material-symbols-outlined mr-2 text-[#2bee79]">calendar_today</span>
              <span>Últimos 30 días</span>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-[#2bee79] bg-[#2bee79]/10 px-5 py-2 text-sm font-bold text-[#2bee79] transition-all hover:bg-[#2bee79] hover:text-[#0B1F14]">
              <span className="material-symbols-outlined text-sm">download</span>
              Exportar CSV
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Transacciones */}
          <div className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#2bee79]/20 dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-[#2bee79]/10 p-2 transition-colors group-hover:bg-[#2bee79]/20">
                <span className="material-symbols-outlined text-[#2bee79]">receipt_long</span>
              </div>
              <div className="flex items-center text-xs font-bold text-[#2bee79]">
                <span className="material-symbols-outlined mr-1 text-xs">trending_up</span>
                +12.5%
              </div>
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">Total Transacciones</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black">{TOTAL_TRANSACTIONS}</h3>
              <div className="flex h-7.5 w-20 items-end gap-1 rounded bg-linear-to-t from-[#2bee79]/20 to-transparent px-1">
                <div className="h-1/2 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-2/3 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-1/3 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-3/4 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-full w-1 rounded-t bg-[#2bee79]"></div>
              </div>
            </div>
          </div>

          {/* Volumen Total */}
          <div className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#2bee79]/20 dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-[#2bee79]/10 p-2">
                <span className="material-symbols-outlined text-[#2bee79]">payments</span>
              </div>
              <div className="flex items-center text-xs font-bold text-[#2bee79]">
                <span className="material-symbols-outlined mr-1 text-xs">trending_up</span>
                +8.4%
              </div>
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">Volumen Total</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black">{formatCurrency(TOTAL_VOLUME)}</h3>
              <div className="flex h-7.5 w-20 items-end gap-1 rounded bg-linear-to-t from-[#2bee79]/20 to-transparent px-1">
                <div className="h-2/3 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-1/2 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-4/5 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-2/3 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-3/4 w-1 rounded-t bg-[#2bee79]"></div>
              </div>
            </div>
          </div>

          {/* Compras */}
          <div className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#2bee79]/20 dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-[#2bee79]/10 p-2">
                <span className="material-symbols-outlined text-[#2bee79]">add_shopping_cart</span>
              </div>
              <div className="flex items-center text-xs font-bold text-red-500">
                <span className="material-symbols-outlined mr-1 text-xs">trending_down</span>
                -2.1%
              </div>
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">Compras Totales</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black">{BUY_COUNT}</h3>
              <div className="flex h-7.5 w-20 items-end gap-1 rounded bg-linear-to-t from-red-500/20 to-transparent px-1">
                <div className="h-full w-1 rounded-t bg-red-500"></div>
                <div className="h-3/4 w-1 rounded-t bg-red-500"></div>
                <div className="h-2/3 w-1 rounded-t bg-red-500"></div>
                <div className="h-1/2 w-1 rounded-t bg-red-500"></div>
                <div className="h-1/3 w-1 rounded-t bg-red-500"></div>
              </div>
            </div>
          </div>

          {/* Ventas */}
          <div className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#2bee79]/20 dark:border-[#2bee79]/5 dark:bg-[#152A1E]">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-lg bg-[#2bee79]/10 p-2">
                <span className="material-symbols-outlined text-[#2bee79]">sell</span>
              </div>
              <div className="flex items-center text-xs font-bold text-[#2bee79]">
                <span className="material-symbols-outlined mr-1 text-xs">trending_up</span>
                +5.1%
              </div>
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">Ventas Totales</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black">{SELL_COUNT}</h3>
              <div className="flex h-7.5 w-20 items-end gap-1 rounded bg-linear-to-t from-[#2bee79]/20 to-transparent px-1">
                <div className="h-1/3 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-1/2 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-2/3 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-3/4 w-1 rounded-t bg-[#2bee79]"></div>
                <div className="h-full w-1 rounded-t bg-[#2bee79]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#2bee79]/10 dark:bg-[#152A1E]">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative min-w-70 flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar ID de transacción, activo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-none bg-slate-50 py-2 pl-10 pr-4 text-sm transition-all focus:ring-1 focus:ring-[#2bee79] dark:bg-[#0B1F14] dark:placeholder:text-slate-500"
              />
            </div>

            {/* Tipo Filter */}
            <div className="flex items-center gap-2">
              <label className="ml-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tipo:
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="min-w-30 rounded-lg border-none bg-slate-50 py-2 pr-8 text-sm focus:ring-1 focus:ring-[#2bee79] dark:bg-[#0B1F14]"
              >
                <option value="all">Todos</option>
                <option value="buy">Compra</option>
                <option value="sell">Venta</option>
              </select>
            </div>

            {/* Estado Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Estado:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="min-w-35 rounded-lg border-none bg-slate-50 py-2 pr-8 text-sm focus:ring-1 focus:ring-[#2bee79] dark:bg-[#0B1F14]"
              >
                <option value="all">Todos</option>
                <option value="completed">Completado</option>
                <option value="pending">Pendiente</option>
                <option value="failed">Fallido</option>
              </select>
            </div>

            {/* Activo Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Activo:
              </label>
              <select
                value={filterAsset}
                onChange={(e) => setFilterAsset(e.target.value)}
                className="min-w-30 rounded-lg border-none bg-slate-50 py-2 pr-8 text-sm focus:ring-1 focus:ring-[#2bee79] dark:bg-[#0B1F14]"
              >
                <option value="all">Todos</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="SOL">SOL</option>
              </select>
            </div>

            {/* Filter Icon */}
            <button className="ml-auto rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#2bee79]/10 hover:text-[#2bee79]">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </section>

        {/* Transactions Table */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#2bee79]/10 dark:bg-[#152A1E]">
          <div className="custom-scrollbar overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-[#2bee79]/10 dark:bg-[#2bee79]/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ID Transacción
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Activo</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Cantidad</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Precio (USD)</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Fee (USD)</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Total (USD)</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Hash</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#2bee79]/5">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-[#2bee79]/5"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-[#2bee79] group-hover:underline">{tx.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(tx.date).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-full bg-${tx.asset.color}-500/20`}
                        >
                          <span className={`material-symbols-outlined text-${tx.asset.color}-500 text-lg`}>
                            {tx.asset.icon}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold">{tx.asset.name}</p>
                          <p className="text-[10px] font-bold uppercase text-slate-500">{tx.asset.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tx.type === 'buy' ? (
                        <span className="inline-flex rounded-full border border-[#2bee79]/30 bg-[#2bee79]/20 px-2.5 py-1 text-[10px] font-black uppercase text-[#2bee79]">
                          COMPRA
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/20 px-2.5 py-1 text-[10px] font-black uppercase text-red-500">
                          VENTA
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {tx.amount} {tx.asset.symbol}
                    </td>
                    <td className="px-6 py-4 text-sm">{formatCurrency(tx.priceUsd)}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatCurrency(tx.feeUsd)}</td>
                    <td
                      className={`px-6 py-4 text-sm font-bold ${tx.type === 'buy' ? 'text-[#2bee79]' : 'text-red-500'}`}
                    >
                      {formatCurrency(tx.totalUsd)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="group/hash relative flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(tx.hash)
                          }}
                          className="opacity-0 transition-opacity group-hover/hash:opacity-100"
                        >
                          <span className="material-symbols-outlined text-sm text-slate-400 hover:text-[#2bee79]">
                            content_copy
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'completed' && (
                        <div className="flex items-center gap-1.5 text-[#2bee79]">
                          <div className="size-1.5 animate-pulse rounded-full bg-[#2bee79]"></div>
                          <span className="text-xs font-bold">Completado</span>
                        </div>
                      )}
                      {tx.status === 'pending' && (
                        <div className="flex items-center gap-1.5 text-yellow-500">
                          <div className="size-1.5 rounded-full bg-yellow-500"></div>
                          <span className="text-xs font-bold">Pendiente</span>
                        </div>
                      )}
                      {tx.status === 'failed' && (
                        <div className="flex items-center gap-1.5 text-red-500">
                          <div className="size-1.5 rounded-full bg-red-500"></div>
                          <span className="text-xs font-bold">Fallido</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <button className="transition-colors hover:text-[#2bee79]">
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-6 py-8 text-center text-sm font-semibold text-slate-400">
                      No se encontraron transacciones
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-[#2bee79]/10 dark:bg-[#2bee79]/5">
            <p className="text-sm text-slate-500">
              Mostrando <span className="font-bold text-slate-900 dark:text-slate-100">1 - 5</span> de{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">{TOTAL_TRANSACTIONS}</span> transacciones
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="rounded-md border border-slate-200 px-3 py-1 text-sm transition-colors hover:bg-[#2bee79]/10 disabled:opacity-50 dark:border-[#2bee79]/20"
              >
                Anterior
              </button>
              <button className="rounded-md bg-[#2bee79] px-3 py-1 text-sm font-bold text-[#0B1F14]">1</button>
              <button className="rounded-md border border-slate-200 px-3 py-1 text-sm transition-colors hover:bg-[#2bee79]/10 dark:border-[#2bee79]/20">
                2
              </button>
              <button className="rounded-md border border-slate-200 px-3 py-1 text-sm transition-colors hover:bg-[#2bee79]/10 dark:border-[#2bee79]/20">
                3
              </button>
              <span className="text-slate-500">...</span>
              <button className="rounded-md border border-slate-200 px-3 py-1 text-sm transition-colors hover:bg-[#2bee79]/10 dark:border-[#2bee79]/20">
                26
              </button>
              <button className="rounded-md border border-slate-200 px-3 py-1 text-sm transition-colors hover:bg-[#2bee79]/10 dark:border-[#2bee79]/20">
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}
    </div>
  )
}