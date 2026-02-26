import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../contexts/SettingsContext'
import { useToast } from '../contexts/ToastContext'
import { useTranslations } from '../hooks/useTranslations'
import { translations } from '../i18n/translations'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function SettingsPage() {
  const { theme, toggleTheme, language, toggleLanguage } = useSettings()
  const { success } = useToast()
  const t = useTranslations()
  const navigate = useNavigate()
  const [shouldThrowError, setShouldThrowError] = useState(false)
  useDocumentTitle(t.pageTitles.settings, t.pageDescriptions.settings)

  if (shouldThrowError) {
    throw new Error('🧪 Test Error: Error Boundary is working!')
  }

  const handleThemeToggle = () => {
    toggleTheme()
    success(t.settings.toasts.themeChanged)
  }

  const handleLanguageToggle = () => {
    toggleLanguage()
    setTimeout(() => {
      success(language === 'en' ? translations.es.settings.toasts.languageChanged : translations.en.settings.toasts.languageChanged)
    }, 100)
  }

  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-[#0B1F14] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">{t.settings.title}</h1>
          <p className="text-slate-600 dark:text-slate-400">{t.settings.subtitle}</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-[#152A1E]/80">
            <div className="mb-6">
              <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">{t.settings.appearance.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.appearance.desc}</p>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-[#0B1F14]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-pink-500">
                  <span className="material-symbols-outlined text-white">
                    {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.settings.appearance.theme}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.appearance.themeDesc}</p>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className="relative h-7 w-14 rounded-full bg-slate-300 transition-colors hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-[#2bee79] shadow-lg transition-all ${
                    theme === 'dark' ? 'left-1' : 'left-8'
                  }`}
                >
                  <span className="flex h-full items-center justify-center text-xs material-symbols-outlined text-[#0B1F14]">
                    {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Language Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700/50 dark:bg-[#152A1E]/80 dark:backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">{t.settings.language.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.language.desc}</p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-[#0B1F14]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-500">
                  <span className="material-symbols-outlined text-white">language</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.settings.language.label}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {language === 'en' ? t.settings.language.english : t.settings.language.spanish}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLanguageToggle}
                className="relative h-7 w-14 rounded-full bg-slate-300 transition-colors hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-[#2bee79] shadow-lg transition-all ${
                    language === 'en' ? 'left-1' : 'left-8'
                  }`}
                >
                  <span className="flex h-full items-center justify-center text-[9px] font-bold text-[#0B1F14]">
                    {language === 'en' ? 'EN' : 'ES'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Notifications Section (Future Feature) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 opacity-50 shadow-sm dark:border-slate-700/50 dark:bg-[#152A1E]/80 dark:backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-white">{t.settings.notifications.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.notifications.desc}</p>
            </div>

            <div className="space-y-4">
              {/* Price Alerts */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-[#0B1F14]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-red-500">
                    <span className="material-symbols-outlined text-white">notifications</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{t.settings.notifications.priceAlerts}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.notifications.priceAlertsDesc}</p>
                  </div>
                </div>
                <div className="relative h-7 w-14 rounded-full bg-slate-300 dark:bg-slate-700">
                  <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-[#0B1F14]">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-teal-500">
                    <span className="material-symbols-outlined text-white">mail</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{t.settings.notifications.emailNotifications}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.notifications.emailNotificationsDesc}</p>
                  </div>
                </div>
                <div className="relative h-7 w-14 rounded-full bg-slate-300 dark:bg-slate-700">
                  <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-slate-400 dark:bg-slate-600"></div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-500/10 px-4 py-3">
              <p className="text-xs text-blue-600 dark:text-blue-400">{t.settings.notifications.comingSoon}</p>
            </div>
          </div>

          {/* Developer Tools Section (Development Only) */}
          {import.meta.env.DEV && (
            <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/5 p-6 shadow-sm backdrop-blur-sm dark:border-red-500/20 dark:bg-red-500/10">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400">{t.settings.developer.title}</h2>
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                    DEV
                  </span>
                </div>
                <p className="text-sm text-red-600/80 dark:text-red-400/80">{t.settings.developer.desc}</p>
              </div>

              <div className="space-y-4">
                {/* Test Error Boundary */}
                <div className="flex items-center justify-between rounded-xl bg-white/50 p-4 dark:bg-black/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-red-500 to-rose-600">
                      <span className="material-symbols-outlined text-white">bug_report</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{t.settings.developer.testErrorBoundary}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.developer.testErrorBoundaryDesc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShouldThrowError(true)}
                    className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">error</span>
                    {t.settings.developer.testErrorBoundary}
                  </button>
                </div>

                {/* Test 404 Page */}
                <div className="flex items-center justify-between rounded-xl bg-white/50 p-4 dark:bg-black/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-amber-600">
                      <span className="material-symbols-outlined text-white">search_off</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{t.settings.developer.test404}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings.developer.test404Desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/test-404-page-does-not-exist')}
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">open_in_new</span>
                    {t.settings.developer.test404}
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-red-500/10 px-4 py-3">
                <p className="text-xs font-medium text-red-600 dark:text-red-400">⚠️ {t.settings.developer.devOnly}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
