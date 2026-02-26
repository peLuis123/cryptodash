import { useTranslations } from '../hooks/useTranslations'

export default function SectionPlaceholderPage({ title }) {
  const t = useTranslations()

  return (
    <div className="custom-scrollbar flex flex-1 items-center justify-center overflow-y-auto p-8">
      <div className="rounded-2xl border border-white/10 bg-[#14281d] px-10 py-8 text-center">
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
        <p className="mt-2 text-slate-400">{t.common.comingSoon || 'Contenido en construcción'}</p>
      </div>
    </div>
  )
}
