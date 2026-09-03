import { createContext, useContext } from 'react'
import type { Locale } from '../content/portfolio.schema'

export type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
export const LANGUAGE_KEY = 'portfolio-game:locale'

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

export function normalizeLocale(candidate: string | undefined): Locale {
  return candidate === 'en' ? 'en' : 'fr'
}
