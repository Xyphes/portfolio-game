import { Link } from 'react-router-dom'
import { portfolioProfile } from '../../content/profile.data'
import { localize } from '../../content/selectors'
import { LanguageSwitch } from '../../shared/LanguageSwitch'
import { useLanguage } from '../../shared/language'
import { usePageMetadata } from '../../shared/usePageMetadata'

const copy = {
  fr: {
    eyebrow: 'Portfolio interactif · prototype d’architecture',
    lead: 'Choisissez une lecture directe ou explorez un premier fragment de parcours.',
    classic: 'Mode classique',
    classicDescription: 'Consulter immédiatement mon profil, mon expérience et mes documents.',
    adventure: 'Mode aventure',
    adventureDescription: 'Entrer dans une salle 8-bit et découvrir la même expérience en jouant.',
    enterClassic: 'Consulter le portfolio',
    enterAdventure: 'Commencer l’aventure',
    proof: 'Une seule source de contenu alimente les deux modes.',
    metaTitle: 'Willy Somkhit — Portfolio d’ingénieur logiciel',
  },
  en: {
    eyebrow: 'Interactive portfolio · architecture prototype',
    lead: 'Choose a direct reading experience or explore the first fragment of my journey.',
    classic: 'Classic mode',
    classicDescription: 'Read my profile, featured experience, and documents immediately.',
    adventure: 'Adventure mode',
    adventureDescription: 'Enter an 8-bit room and discover the same experience through play.',
    enterClassic: 'View the portfolio',
    enterAdventure: 'Start the adventure',
    proof: 'One shared content source powers both modes.',
    metaTitle: 'Willy Somkhit — Software Engineer Portfolio',
  },
} as const

export function LandingPage() {
  const { locale } = useLanguage()
  const text = copy[locale]
  usePageMetadata({
    locale,
    title: text.metaTitle,
    description: localize(portfolioProfile.introduction, locale),
    canonicalPath: '/',
  })

  return (
    <main className="landing-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="landing-header">
        <LanguageSwitch />
      </header>

      <section className="hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{portfolioProfile.name}</h1>
        <p className="hero-title">{localize(portfolioProfile.title, locale)}</p>
        <p className="hero-lead">{text.lead}</p>
      </section>

      <section className="mode-grid" aria-label={locale === 'fr' ? 'Choix du mode' : 'Choose a mode'}>
        <article className="mode-card classic-card">
          <span className="mode-number">01</span>
          <div>
            <p className="mode-kicker">CV / WEB</p>
            <h2>{text.classic}</h2>
            <p>{text.classicDescription}</p>
          </div>
          <Link className="primary-link" to={`/${locale}/classic`}>
            {text.enterClassic}<span aria-hidden="true"> →</span>
          </Link>
        </article>

        <article className="mode-card adventure-card">
          <span className="mode-number">02</span>
          <div className="pixel-window" aria-hidden="true">
            <i /><i /><i /><i /><b />
          </div>
          <div>
            <p className="mode-kicker">8-BIT / QUEST</p>
            <h2>{text.adventure}</h2>
            <p>{text.adventureDescription}</p>
          </div>
          <Link className="primary-link gold" to={`/${locale}/adventure`}>
            {text.enterAdventure}<span aria-hidden="true"> →</span>
          </Link>
        </article>
      </section>

      <footer className="landing-footer">
        <span className="status-dot" aria-hidden="true" />
        {text.proof}
      </footer>
    </main>
  )
}
