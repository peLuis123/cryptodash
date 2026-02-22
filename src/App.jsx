import { useMemo, useState } from 'react'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'portafolio', label: 'Portafolio', icon: 'account_balance_wallet' },
  { key: 'analisis', label: 'Análisis', icon: 'analytics' },
  { key: 'transacciones', label: 'Transacciones', icon: 'history' },
  { key: 'mercado', label: 'Mercado', icon: 'public' },
]

const sectionContent = {
  dashboard: {
    title: 'Resumen del Panel',
    subtitle: 'Bienvenido de nuevo, Alex. Aquí tienes lo último del mercado.',
  },
  portafolio: {
    title: 'Portafolio',
    subtitle: 'Visualiza el estado actual de tus activos y su distribución.',
  },
  analisis: {
    title: 'Análisis',
    subtitle: 'Monitorea tendencias y señales clave para tus operaciones.',
  },
  transacciones: {
    title: 'Transacciones',
    subtitle: 'Revisa tu historial de compras, ventas y movimientos recientes.',
  },
  mercado: {
    title: 'Mercado',
    subtitle: 'Consulta el comportamiento general y activos en tendencia.',
  },
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const currentSection = useMemo(
    () => sectionContent[activeSection] ?? sectionContent.dashboard,
    [activeSection],
  )

  return (
    <div className="flex h-screen overflow-hidden bg-[#102217] text-slate-100">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0c1c13]">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2bee79]">
              <span className="material-symbols-outlined text-xl font-bold text-[#102217]">currency_bitcoin</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">CryptoDash</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-r-2 border-[#2bee79] bg-[#2bee79]/10 text-[#2bee79]'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-[#2bee79]'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-medium leading-normal">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 transition-all duration-200 hover:bg-slate-900 hover:text-[#2bee79]"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium leading-normal">Ajustes</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-[#102217] px-8">
          <div className="flex flex-1 items-center">
            <div className="group relative w-full max-w-md">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#2bee79]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar activos, mercados o transacciones..."
                className="w-full rounded-lg border-none bg-slate-900 py-2 pr-4 pl-10 text-sm text-slate-100 placeholder-slate-500 outline-none ring-0 focus:ring-1 focus:ring-[#2bee79]"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden flex-col items-end border-r border-slate-800 px-4 md:flex">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Valor del Portafolio</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">$124,592.00</span>
                <span className="rounded bg-[#2bee79]/10 px-1.5 py-0.5 text-xs font-medium text-[#2bee79]">+2.4%</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800"
              >
                <span className="material-symbols-outlined">dark_mode</span>
              </button>
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full border-2 border-[#102217] bg-[#2bee79]" />
              </button>
            </div>

            <div className="group flex cursor-pointer items-center gap-3 border-l border-slate-800 pl-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white transition-colors group-hover:text-[#2bee79]">Alex Rivera</p>
                <p className="text-xs text-slate-500">Pro Trader</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfB7TBUHdKKCxKzPndrVRbPFCrQkw-ZcoiSiuruCx35a5u6llAr1JDsFiyENDce7aIYJNZ8PJU0kEaa0anZZQF6uDStIzY732rgwum-ZKFdI8m8c1Pae1ELb34pMjq4612wN00eGpxg8Hl6578DsX2q-EBWESRk84rRzeFc-q4PRF5sHKN0BST3IPT5bjDY_dD_tpylCgsvNvvUoVY80U_zruO9u9lHzfLCGb647vmyos2vrH30CwqO7gtsa5QRe4G53dO1WymHDg"
                  alt="Avatar de usuario"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#102217]/70 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">{currentSection.title}</h1>
              <p className="mt-1 text-slate-400">{currentSection.subtitle}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-bold text-slate-200 transition-all hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Exportar
              </button>
              <button type="button" className="rounded-lg bg-[#2bee79] px-4 py-2 text-sm font-bold text-[#102217] transition-all hover:opacity-90">
                + Nueva Operación
              </button>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-800/30">
              <span className="text-sm italic text-slate-500">Métrica de Portafolio</span>
            </div>
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-800/30">
              <span className="text-sm italic text-slate-500">Métrica de Rendimiento</span>
            </div>
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-800/30">
              <span className="text-sm italic text-slate-500">Activos Totales</span>
            </div>
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-800/30">
              <span className="text-sm italic text-slate-500">Balance en Efectivo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 flex h-96 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-800 bg-slate-800/30">
              <span className="material-symbols-outlined text-4xl text-slate-600">show_chart</span>
              <span className="text-sm italic text-slate-500">Gráfico Principal de Análisis</span>
            </div>
            <div className="flex h-96 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-800 bg-slate-800/30">
              <span className="material-symbols-outlined text-4xl text-slate-600">list_alt</span>
              <span className="text-sm italic text-slate-500">Activos en Tendencia</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
