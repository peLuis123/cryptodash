import { NavLink } from 'react-router-dom'

import { navItems } from '../../constants/navigation'

function SidebarNavItem({ item }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
          isActive
            ? 'bg-[#2bee79] font-bold text-slate-900 shadow-lg shadow-[#2bee79]/20'
            : 'text-slate-400 hover:bg-[#1a2e23] hover:text-[#2bee79]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="material-symbols-outlined transition-transform group-hover:scale-110">{item.icon}</span>
          <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <aside className="z-20 flex w-64 flex-col border-r border-[#1a2e23] bg-[#102217]">
      <div className="flex items-center gap-3 p-6">
        <div className="rounded-lg bg-[#2bee79]/20 p-2">
          <span className="material-symbols-outlined text-3xl text-[#2bee79]">rocket_launch</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">CryptoDash</h1>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Pro Terminal</p>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-4">
        {navItems.map((item) => (
          <SidebarNavItem key={item.key} item={item} />
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-[#2bee79]/20 bg-[#2bee79]/10 p-4">
          <p className="mb-1 text-xs font-bold text-[#2bee79] uppercase">Plan Pro</p>
          <p className="mb-3 text-sm leading-tight text-slate-400">Acceso a análisis premium activo.</p>
          <button
            type="button"
            className="w-full rounded-lg bg-[#2bee79]/20 py-2 text-xs font-bold text-[#2bee79] transition-colors hover:bg-[#2bee79]/30"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </aside>
  )
}
