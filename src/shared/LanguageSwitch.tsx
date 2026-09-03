import { useLocation, useNavigate } from 'react-router-dom'
import type { Locale } from '../content/portfolio.schema'
import { useLanguage } from './language'

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  const select = (nextLocale: Locale) => {
    setLocale(nextLocale)
    const localizedPath = location.pathname.match(/^\/(fr|en)(\/|$)/)
    if (localizedPath) {
      navigate(location.pathname.replace(/^\/(fr|en)/, `/${nextLocale}`))
    }
  }

  return (
    <div className="language-switch" aria-label={locale === 'fr' ? 'Langue' : 'Language'}>
      {(['fr', 'en'] as const).map((option) => (
        <button
          type="button"
          key={option}
          className={locale === option ? 'is-active' : undefined}
          aria-pressed={locale === option}
          onClick={() => select(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
