import { useSettings } from '../contexts/SettingsContext'
import { translations } from '../i18n/translations'

export function useTranslations() {
  const { language } = useSettings()
  return translations[language] || translations.en
}
