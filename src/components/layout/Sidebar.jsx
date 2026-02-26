import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'

import { navItems } from '../../constants/navigation'
import { useTranslations } from '../../hooks/useTranslations'

function SidebarNavItem({ item, label, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
          isActive
            ? 'bg-[#2bee79] font-bold text-slate-900 shadow-lg shadow-[#2bee79]/20'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1a2e23] dark:hover:text-[#2bee79]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="material-symbols-outlined transition-transform group-hover:scale-110">{item.icon}</span>
          <span className={isActive ? 'font-bold' : 'font-medium'}>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const t = useTranslations()

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay - only visible on mobile when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-[#1a2e23] dark:bg-[#102217] md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with close button on mobile */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#2bee79]/20 p-2">
              <span className="material-symbols-outlined text-3xl text-[#2bee79]">rocket_launch</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">CryptoDash</h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Pro Terminal</p>
            </div>
          </div>

          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1a2e23] dark:hover:text-[#2bee79] md:hidden"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-4">
          {navItems.map((item) => (
            <SidebarNavItem key={item.key} item={item} label={t.nav[item.key]} onClick={onClose} />
          ))}
        </nav>

        <div className="mt-auto p-4">
          <div className="rounded-xl border border-[#2bee79]/20 bg-[#2bee79]/10 p-4">
            <p className="mb-1 text-xs font-bold uppercase text-[#2bee79]">{t.proPlan.title}</p>
            <p className="mb-3 text-sm leading-tight text-slate-600 dark:text-slate-400">{t.proPlan.description}</p>
            <button
              type="button"
              className="w-full rounded-lg bg-[#2bee79]/20 py-2 text-xs font-bold text-[#2bee79] transition-colors hover:bg-[#2bee79]/30"
            >
              {t.proPlan.viewDetails}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
