import {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { localeSchema, type Locale } from '../content/portfolio.schema'
import { LANGUAGE_KEY, LanguageContext } from './language'

function readInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY)
    const parsed = localeSchema.safeParse(stored)
    if (parsed.success) return parsed.data
  } catch {
    // Use the browser preference when storage is unavailable.
  }

  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr'
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    try {
      window.localStorage.setItem(LANGUAGE_KEY, locale)
    } catch {
      // The selected language still works for the current session.
    }
  }, [locale])

  const value = useMemo(
    () => ({ locale, setLocale: setLocaleState }),
    [locale],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
