import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { portfolio } from '../../content/portfolio.data'
import { getSkillLabel, localize } from '../../content/selectors'
import { LanguageSwitch } from '../../shared/LanguageSwitch'
import { normalizeLocale, useLanguage } from '../../shared/language'
import { usePageMetadata } from '../../shared/usePageMetadata'
import { PixelBlastBackdrop } from '../../shared/PixelBlastBackdrop'
import { prepareAdventureOrientation } from '../adventure/orientation'
import { ClassicIcon, type ClassicIconName } from './ClassicIcon'

const copy = {
  fr: {
    mode: 'Mode classique',
    home: 'Accueil',
    adventure: 'Passer à l’aventure',
    about: 'À propos',
    skills: 'Compétences',
    languageSkills: 'Langages',
    frameworks: 'Frameworks',
    domains: 'Domaines',
    tools: 'Outils',
    spokenLanguages: 'Langues',
    softSkills: 'Compétences humaines',
    education: 'Études',
    experiences: 'Expériences',
    projects: 'Projets',
    interests: 'En dehors du code',
    missions: 'Missions sélectionnées',
    documents: 'Documents',
    contact: 'Contact',
    reader: 'Contenu du portfolio',
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
    milestone: 'Une source, deux parcours',
    milestoneText: 'Ces expériences, études et projets sont les mêmes entités que celles découvertes dans le jeu.',
    metaTitle: 'Willy Somkhit — Ingénieur logiciel | Portfolio',
  },
  en: {
    mode: 'Classic mode',
    home: 'Home',
    adventure: 'Switch to adventure',
    about: 'About',
    skills: 'Skills',
    languageSkills: 'Programming languages',
    frameworks: 'Frameworks',
    domains: 'Domains',
    tools: 'Tools',
    spokenLanguages: 'Languages',
    softSkills: 'Human skills',
    education: 'Education',
    experiences: 'Experience',
    projects: 'Projects',
    interests: 'Beyond code',
    missions: 'Selected assignments',
    documents: 'Documents',
    contact: 'Contact',
    reader: 'Portfolio content',
    menu: 'Menu',
    closeMenu: 'Close menu',
    milestone: 'One source, two journeys',
    milestoneText: 'These experiences, studies, and projects are the same entities discovered in the game.',
    metaTitle: 'Willy Somkhit — Software Engineer | Portfolio',
  },
} as const

const sectionIds = [
  'about',
  'skills',
  'education',
  'experiences',
  'projects',
  'interests',
  'documents',
  'contact',
] as const
type SectionId = typeof sectionIds[number]

const interestIcons: Record<string, ClassicIconName> = {
  climbing: 'climbing',
  crafting: 'crafting',
  swimming: 'swimming',
  traveling: 'traveling',
}

const contactIcons: Record<(typeof portfolio.links)[number]['kind'], ClassicIconName> = {
  phone: 'phone',
  email: 'email',
  github: 'github',
  linkedin: 'linkedin',
  discord: 'people',
}

function getHashSection(): SectionId | undefined {
  const candidate = window.location.hash.slice(1)
  return sectionIds.find((sectionId) => sectionId === candidate)
}

function SectionIndex({
  number,
  label,
  icon,
}: {
  number: string
  label: string
  icon: ClassicIconName
}) {
  return (
    <p className="section-index">
      <ClassicIcon name={icon} />
      <span>{number} — {label}</span>
    </p>
  )
}

export function ClassicPage() {
  const params = useParams()
  const routeLocale = normalizeLocale(params.locale)
  const { locale, setLocale } = useLanguage()
  const text = copy[routeLocale]
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(() => getHashSection() ?? 'about')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const skillGroups: Array<{
    id: 'language' | 'framework' | 'domain' | 'tool'
    label: string
    icon: ClassicIconName
  }> = [
    { id: 'language', label: text.languageSkills, icon: 'code' },
    { id: 'framework', label: text.frameworks, icon: 'layers' },
    { id: 'domain', label: text.domains, icon: 'compass' },
    { id: 'tool', label: text.tools, icon: 'tool' },
  ] as const
  const navigationItems: Array<{ id: SectionId; label: string; icon: ClassicIconName }> = [
    { id: 'about', label: text.about, icon: 'user' },
    { id: 'skills', label: text.skills, icon: 'code' },
    { id: 'education', label: text.education, icon: 'graduation' },
    { id: 'experiences', label: text.experiences, icon: 'briefcase' },
    { id: 'projects', label: text.projects, icon: 'rocket' },
    { id: 'interests', label: text.interests, icon: 'compass' },
    { id: 'documents', label: text.documents, icon: 'file' },
    { id: 'contact', label: text.contact, icon: 'email' },
  ]

  useEffect(() => {
    if (locale !== routeLocale) setLocale(routeLocale)
  }, [locale, routeLocale, setLocale])

  useEffect(() => {
    const syncSectionFromHash = () => {
      const sectionId = getHashSection()
      if (sectionId) setActiveSectionId(sectionId)
    }
    window.addEventListener('hashchange', syncSectionFromHash)
    return () => window.removeEventListener('hashchange', syncSectionFromHash)
  }, [])

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const menu = mobileMenuRef.current
    const menuButton = menuButtonRef.current
    const firstItem = menu?.querySelector<HTMLButtonElement>('button')
    firstItem?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeMobileMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      menuButton?.focus()
    }
  }, [closeMobileMenu, mobileMenuOpen])

  const selectSection = (sectionId: SectionId) => {
    setActiveSectionId(sectionId)
    closeMobileMenu()
    contentRef.current?.scrollTo?.({ top: 0 })
    window.history.replaceState(null, '', `#${sectionId}`)
  }

  const activeSectionLabel = navigationItems.find(({ id }) => id === activeSectionId)?.label ?? text.about

  usePageMetadata({
    locale: routeLocale,
    title: text.metaTitle,
    description: localize(portfolio.profile.introduction, routeLocale),
    canonicalPath: `/${routeLocale}/classic`,
    alternatePaths: { fr: '/fr/classic', en: '/en/classic' },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: portfolio.profile.name,
      jobTitle: localize(portfolio.profile.title, routeLocale),
      description: localize(portfolio.profile.introduction, routeLocale),
      sameAs: portfolio.links
        .filter(({ kind }) => kind === 'github' || kind === 'linkedin')
        .map(({ href }) => href),
      knowsAbout: portfolio.skills.map((skill) => localize(skill.label, routeLocale)),
    },
  })

  return (
    <main className="classic-shell">
      <aside className="classic-sidebar">
        <Link className="brand-lockup" to="/">
          <span className="monogram" aria-hidden="true">WS</span>
          <span>
            <strong>{portfolio.profile.name}</strong>
            <small>{localize(portfolio.profile.title, routeLocale)}</small>
          </span>
        </Link>

        <nav className="classic-nav" aria-label={routeLocale === 'fr' ? 'Navigation principale' : 'Main navigation'}>
          {navigationItems.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={activeSectionId === id ? 'is-active' : undefined}
              aria-current={activeSectionId === id ? 'page' : undefined}
              onClick={() => selectSection(id)}
            >
              <ClassicIcon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="classic-mobile-controls">
            <LanguageSwitch />
            <button
              ref={menuButtonRef}
              type="button"
              className="classic-menu-button"
              aria-expanded={mobileMenuOpen}
              aria-controls="classic-mobile-menu"
              aria-label={mobileMenuOpen ? text.closeMenu : text.menu}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
          <Link
            className="mode-switch-link"
            to={`/${routeLocale}/adventure`}
            onClick={prepareAdventureOrientation}
          >
            <span className="tiny-pixels" aria-hidden="true" />
            {text.adventure}
          </Link>
        </div>
      </aside>

      <section className="classic-content">
        <PixelBlastBackdrop context="classic" />
        <header className="classic-topbar">
          <div>
            <p className="eyebrow">{text.mode}</p>
            <p className="breadcrumb">{text.home} / {activeSectionLabel}</p>
          </div>
        </header>

        {mobileMenuOpen && (
          <button
            type="button"
            className="classic-menu-scrim"
            aria-label={text.closeMenu}
            onClick={closeMobileMenu}
          />
        )}
        <nav
          id="classic-mobile-menu"
          ref={mobileMenuRef}
          className="classic-mobile-nav"
          aria-label={routeLocale === 'fr' ? 'Navigation des sections' : 'Section navigation'}
          hidden={!mobileMenuOpen}
        >
          <span className="mode-kicker">{text.menu}</span>
          {navigationItems.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={activeSectionId === id ? 'is-active' : undefined}
              aria-current={activeSectionId === id ? 'page' : undefined}
              onClick={() => selectSection(id)}
            >
              <ClassicIcon name={icon} />
              <span>{label}</span>
            </button>
          ))}
          <Link
            className="classic-mobile-mode-link"
            to={`/${routeLocale}/adventure`}
            onClick={prepareAdventureOrientation}
          >
            <span className="tiny-pixels" aria-hidden="true" />
            {text.adventure}
          </Link>
        </nav>

        <div
          ref={contentRef}
          className="classic-scroll"
          key={activeSectionId}
          role="region"
          tabIndex={0}
          aria-label={`${text.reader} — ${activeSectionLabel}`}
          aria-live="polite"
        >
          {activeSectionId === 'about' && (
            <>
              <section id="about" className="profile-intro">
                <SectionIndex number="01" label={text.about} icon="user" />
                <h1>{localize(portfolio.profile.title, routeLocale)}</h1>
                <p>{localize(portfolio.profile.introduction, routeLocale)}</p>
                <span className="availability">
                  <i aria-hidden="true" />
                  {localize(portfolio.profile.availability, routeLocale)}
                </span>
              </section>
              <section className="proof-callout">
                <span className="fragment-glyph" aria-hidden="true">◆</span>
                <div>
                  <strong>{text.milestone}</strong>
                  <p>{text.milestoneText}</p>
                </div>
              </section>
            </>
          )}

          {activeSectionId === 'skills' && (
            <section id="skills" className="classic-section">
              <SectionIndex number="02" label={text.skills} icon="code" />
              <div className="skill-groups">
                {skillGroups.map((group) => (
                  <div key={group.id}>
                    <h2><ClassicIcon name={group.icon} />{group.label}</h2>
                    <div className="skill-list skill-catalog">
                      {portfolio.skills
                        .filter(({ category }) => category === group.id)
                        .map((skill) => (
                          <span key={skill.id}>{localize(skill.label, routeLocale)}</span>
                        ))}
                    </div>
                  </div>
                ))}
                <div>
                  <h2><ClassicIcon name="globe" />{text.spokenLanguages}</h2>
                  <div className="skill-list skill-catalog">
                    {portfolio.languages.map((language) => (
                      <span key={language.id}>
                        {localize(language.label, routeLocale)} · {localize(language.level, routeLocale)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2><ClassicIcon name="people" />{text.softSkills}</h2>
                  <div className="skill-list skill-catalog">
                    {portfolio.softSkills.map((skill) => (
                      <span key={skill.id}>{localize(skill.label, routeLocale)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSectionId === 'education' && (
            <section id="education" className="classic-section">
              <SectionIndex number="03" label={text.education} icon="graduation" />
              <div className="education-grid">
                {portfolio.education.map((education) => (
                  <article key={education.id} className="content-card">
                    <h2>{education.institution}</h2>
                    <p className="card-kicker">{localize(education.program, routeLocale)}</p>
                    <ul>
                      {education.highlights.map((highlight) => (
                        <li key={highlight.fr}>{localize(highlight, routeLocale)}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSectionId === 'experiences' && (
            <section id="experiences" className="classic-section">
              <SectionIndex number="04" label={text.experiences} icon="briefcase" />
              <div className="experience-list">
                {portfolio.experiences.map((experience) => (
                  <article key={experience.id} className="experience-panel">
                    <div className="experience-heading">
                      <div>
                        <h2>{experience.company}</h2>
                        <p>{localize(experience.role, routeLocale)}</p>
                      </div>
                      <span className="period">{localize(experience.period, routeLocale)}</span>
                    </div>
                    <p className="experience-summary">{localize(experience.summary, routeLocale)}</p>
                    <div className="detail-grid">
                      <div>
                        <h3>{text.missions}</h3>
                        <ul>
                          {experience.missions.map((mission) => (
                            <li key={mission.fr}>{localize(mission, routeLocale)}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3>{text.skills}</h3>
                        <div className="skill-list">
                          {experience.skillIds.map((skillId) => (
                            <span key={skillId}>{getSkillLabel(skillId, routeLocale)}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSectionId === 'projects' && (
            <section id="projects" className="classic-section">
              <SectionIndex number="05" label={text.projects} icon="rocket" />
              <div className="project-grid">
                {portfolio.projects.map((project) => (
                  <article key={project.id} className="content-card project-card">
                    <p className="card-kicker">{localize(project.context, routeLocale)}</p>
                    <h2>{localize(project.title, routeLocale)}</h2>
                    <p>{localize(project.summary, routeLocale)}</p>
                    <div className="skill-list">
                      {project.skillIds.map((skillId) => (
                        <span key={skillId}>{getSkillLabel(skillId, routeLocale)}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeSectionId === 'interests' && (
            <section id="interests" className="classic-section personal-section">
              <SectionIndex number="06" label={text.interests} icon="compass" />
              <div className="interest-list">
                {portfolio.interests.map((interest) => (
                  <span key={interest.id}>
                    <ClassicIcon name={interestIcons[interest.id] ?? 'compass'} />
                    {localize(interest.label, routeLocale)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {activeSectionId === 'documents' && (
            <section id="documents" className="link-section">
              <SectionIndex number="07" label={text.documents} icon="file" />
              <div className="document-grid">
                {portfolio.documents.map((document) => (
                  <a key={document.id} href={document.href} download>
                    <span className="document-label">
                      <ClassicIcon name="file" />
                      {localize(document.label, routeLocale)}
                    </span>
                    <ClassicIcon name="download" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {activeSectionId === 'contact' && (
            <section id="contact" className="link-section">
              <SectionIndex number="08" label={text.contact} icon="email" />
              <div className="contact-list">
                {portfolio.links.map((link) => (
                  <a
                    key={link.kind}
                    href={link.href}
                    target={link.kind === 'github' || link.kind === 'linkedin' ? '_blank' : undefined}
                    rel="noreferrer"
                  >
                    <span className="contact-label">
                      <ClassicIcon name={contactIcons[link.kind]} />
                      {localize(link.label, routeLocale)}
                    </span>
                    <ClassicIcon name="external" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  )
}
