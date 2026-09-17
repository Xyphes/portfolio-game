import { portfolio } from '../content/portfolio.data'
import type { Locale } from '../content/portfolio.schema'
import { localize } from '../content/selectors'
import { ClassicIcon, type ClassicIconName } from './ClassicIcon'

const icons: Record<(typeof portfolio.links)[number]['kind'], ClassicIconName> = {
  phone: 'phone',
  email: 'email',
  github: 'github',
  linkedin: 'linkedin',
  discord: 'people',
}

type ContactIconLinksProps = {
  locale: Locale
  className?: string
}

export function ContactIconLinks({ locale, className }: ContactIconLinksProps) {
  return (
    <nav
      className={['contact-icon-links', className].filter(Boolean).join(' ')}
      aria-label={locale === 'fr' ? 'Contacts' : 'Contact links'}
    >
      {portfolio.links.map((link) => (
        <a
          key={link.kind}
          href={link.href}
          aria-label={localize(link.label, locale)}
          title={localize(link.label, locale)}
          target={link.kind === 'github' || link.kind === 'linkedin' ? '_blank' : undefined}
          rel={link.kind === 'github' || link.kind === 'linkedin' ? 'noopener noreferrer' : undefined}
        >
          <ClassicIcon name={icons[link.kind]} />
        </a>
      ))}
    </nav>
  )
}
