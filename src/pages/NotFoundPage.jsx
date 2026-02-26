import { useNavigate } from 'react-router-dom'
import { useTranslations } from '../hooks/useTranslations'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  const t = useTranslations()
  const navigate = useNavigate()
  useDocumentTitle(t.pageTitles.notFound, t.pageDescriptions.notFound)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-[#102217] sm:p-8">
      <div className="w-full max-w-2xl text-center">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-[#2bee79]/20"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#2bee79] bg-white dark:bg-[#14281d] sm:h-32 sm:w-32">
              <span className="material-symbols-outlined text-5xl text-[#2bee79] sm:text-6xl">error</span>
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="mb-4 bg-linear-to-r from-[#2bee79] to-emerald-400 bg-clip-text text-6xl font-black text-transparent sm:text-8xl">
          404
        </h1>

        {/* Message */}
        <h2 className="mb-3 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          {t.notFound?.title || 'Page Not Found'}
        </h2>
        <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
          {t.notFound?.message || 'The page you are looking for does not exist or has been moved.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 rounded-lg bg-[#2bee79] px-6 py-3 text-sm font-bold text-[#0B1F14] transition-all hover:bg-[#25d66b] hover:shadow-lg"
          >
            <span className="material-symbols-outlined">home</span>
            {t.notFound?.goHome || 'Go to Dashboard'}
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-[#2bee79] hover:text-[#2bee79] dark:border-[#2bee79]/30 dark:bg-[#14281d] dark:text-slate-300"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            {t.notFound?.goBack || 'Go Back'}
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
          <div className="h-16 w-16 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700"></div>
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700"></div>
          <div className="h-20 w-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700"></div>
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700"></div>
          <div className="h-16 w-16 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700"></div>
        </div>
      </div>
    </div>
  )
}
