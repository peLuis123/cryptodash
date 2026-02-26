import { useSettings } from '../../contexts/SettingsContext'
import { useTranslations } from '../../hooks/useTranslations'

export default function TopBar({ marketCapValue, marketCapChange, marketCapPositive, volumeValue, onMenuClick }) {
  const { language, toggleLanguage, theme, toggleTheme } = useSettings()
  const t = useTranslations()

  return (
    <header className="z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-[#1a2e23] dark:bg-[#102217]/50 md:px-8">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button - only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1a2e23] dark:hover:text-[#2bee79] md:hidden"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Market Stats - responsive */}
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1 md:gap-2">
            <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:inline">{t.topBar.marketCap}:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 md:text-sm">{marketCapValue}</span>
            <span className={`flex items-center text-xs font-bold ${marketCapPositive ? 'text-emerald-600 dark:text-[#2bee79]' : 'text-red-500'}`}>
              <span className="material-symbols-outlined text-xs">{marketCapPositive ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
              {marketCapChange}
            </span>
          </div>
          <div className="hidden h-4 w-px bg-slate-200 dark:bg-[#1a2e23] sm:block" />
          <div className="hidden items-center gap-1 sm:flex md:gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.topBar.volume24h}:</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 md:text-sm">{volumeValue}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-[#1a2e23] dark:text-slate-300 dark:hover:bg-[#2bee79]/10 dark:hover:text-[#2bee79]"
          title={theme === 'dark' ? (language === 'en' ? 'Switch to Light Mode' : 'Cambiar a Modo Claro') : (language === 'en' ? 'Switch to Dark Mode' : 'Cambiar a Modo Oscuro')}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Language Selector */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-[#1a2e23] dark:text-slate-300 dark:hover:bg-[#2bee79]/10 dark:hover:text-[#2bee79]"
          title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        >
          <span className="material-symbols-outlined text-[18px]">language</span>
          <span className="text-xs font-bold uppercase">{language === 'en' ? 'EN' : 'ES'}</span>
        </button>
        <div className="flex items-center gap-3 border-l border-slate-300 pl-4 dark:border-[#1a2e23]">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Pedro Luis Ramos Calla</p>
            <p className="text-[10px] font-bold text-[#2bee79] uppercase">Gestor de Portafolio</p>
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
