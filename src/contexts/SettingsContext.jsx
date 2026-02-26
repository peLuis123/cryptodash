import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('crypto-dash-theme')
    return saved || 'dark'
  })

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('crypto-dash-language')
    return saved || 'en'
  })
 
  useEffect(() => {
    const savedTheme = localStorage.getItem('crypto-dash-theme') || 'dark'
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('crypto-dash-theme', theme)
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('crypto-dash-language', language)
  }, [language])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    language,
    setLanguage,
    toggleLanguage,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
