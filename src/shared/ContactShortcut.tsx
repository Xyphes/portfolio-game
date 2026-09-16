import { portfolio } from '../content/portfolio.data'
import type { Locale } from '../content/portfolio.schema'

const contactCopy = {
  fr: 'Me contacter',
  en: 'Contact me',
} as const

const emailContact = portfolio.links.find(({ kind }) => kind === 'email')

type ContactShortcutProps = {
  locale: Locale
  className?: string
}

export function ContactShortcut({ locale, className }: ContactShortcutProps) {
  if (!emailContact) return null

  return (
    <a
      className={['contact-shortcut', className].filter(Boolean).join(' ')}
      href={emailContact.href}
      aria-label={contactCopy[locale]}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m4 7 8 6 8-6" />
      </svg>
      <span>{contactCopy[locale]}</span>
    </a>
  )
}
