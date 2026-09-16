import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { portfolio } from '../../content/portfolio.data'
import type { Locale } from '../../content/portfolio.schema'
import { getSkillLabel, localize } from '../../content/selectors'
import { ContactShortcut } from '../../shared/ContactShortcut'
import { LanguageSwitch } from '../../shared/LanguageSwitch'
import { normalizeLocale, useLanguage } from '../../shared/language'
import { usePageMetadata } from '../../shared/usePageMetadata'
import { PixelBlastBackdrop } from '../../shared/PixelBlastBackdrop'
import { prepareAdventureOrientation } from '../adventure/orientation'
import { ClassicIcon, type ClassicIconName } from './ClassicIcon'
import { collectInterestMedia } from './interestMedia'

const interestPhotoModules = import.meta.glob('../../assets/interests-optimized/*/*.{avif,jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const interestVideoModules = import.meta.glob('../../assets/interests/*/*.{mp4,webm}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

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
    interestPicker: 'Choisir une activité',
    interestGallery: 'Galerie photo et vidéo',
    photosComingSoon: 'Photos et vidéos à venir',
    photoSingular: 'photo',
    photoPlural: 'photos',
    videoSingular: 'vidéo',
    videoPlural: 'vidéos',
    previousMedia: 'Média précédent',
    nextMedia: 'Média suivant',
    showMedia: 'Afficher le média',
    missions: 'Missions sélectionnées',
    documents: 'Documents',
    cvPreviewTitle: 'Le CV en aperçu',
    cvPreviewDescription: 'Parcourez la version française ou anglaise ici, sans téléchargement.',
    cvPreviewLanguage: 'Langue de l’aperçu du CV',
    cvPreviewScroll: 'Faites défiler pour lire la page entière.',
    openCv: 'Ouvrir le PDF complet',
    contact: 'Contact',
    reader: 'Contenu du portfolio',
    sectionNavigation: 'Navigation des sections',
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
    interestPicker: 'Choose an activity',
    interestGallery: 'Photo and video gallery',
    photosComingSoon: 'Photos and videos coming soon',
    photoSingular: 'photo',
    photoPlural: 'photos',
    videoSingular: 'video',
    videoPlural: 'videos',
    previousMedia: 'Previous media item',
    nextMedia: 'Next media item',
    showMedia: 'Show media item',
    missions: 'Selected assignments',
    documents: 'Documents',
    cvPreviewTitle: 'Resume preview',
    cvPreviewDescription: 'Read the French or English version here, without downloading.',
    cvPreviewLanguage: 'Resume preview language',
    cvPreviewScroll: 'Scroll to read the full page.',
    openCv: 'Open the full PDF',
    contact: 'Contact',
    reader: 'Portfolio content',
    sectionNavigation: 'Section navigation',
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
  leathercraft: 'leathercraft',
  jewelry: 'jewelry',
  woodworking: 'woodworking',
  lockpicking: 'lockpicking',
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

const cvDocument = portfolio.documents.find(({ id }) => id === 'cv')

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
  const [activeInterestId, setActiveInterestId] = useState(() => portfolio.interests[0]?.id ?? '')
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [cvPreviewOverride, setCvPreviewOverride] = useState<{ forLocale: Locale; previewLocale: Locale }>()
  const cvPreviewLocale = cvPreviewOverride?.forLocale === routeLocale
    ? cvPreviewOverride.previewLocale
    : routeLocale
  const contentRef = useRef<HTMLDivElement>(null)
  const mobileRibbonRef = useRef<HTMLElement>(null)
  const carouselPointerStartX = useRef<number | null>(null)
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

  useEffect(() => {
    const ribbon = mobileRibbonRef.current
    const activeButton = ribbon?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!ribbon || !activeButton) return
    ribbon.scrollTo?.({
      left: activeButton.offsetLeft - ribbon.offsetLeft - (ribbon.clientWidth - activeButton.clientWidth) / 2,
      behavior: 'auto',
    })
  }, [activeSectionId])

  const selectSection = (sectionId: SectionId) => {
    setActiveSectionId(sectionId)
    contentRef.current?.scrollTo?.({ top: 0 })
    window.history.replaceState(null, '', `#${sectionId}`)
  }

  const activeSectionLabel = navigationItems.find(({ id }) => id === activeSectionId)?.label ?? text.about
  const activeInterest = portfolio.interests.find(({ id }) => id === activeInterestId) ?? portfolio.interests[0]
  const activeInterestMedia = activeInterest
    ? collectInterestMedia(activeInterest.mediaFolder, interestPhotoModules, interestVideoModules)
    : []
  const activeMedia = activeInterestMedia[activeMediaIndex] ?? activeInterestMedia[0]
  const displayedMediaIndex = activeMedia
    ? Math.max(0, activeInterestMedia.findIndex(({ path }) => path === activeMedia.path))
    : 0
  const photoCount = activeInterestMedia.filter(({ kind }) => kind === 'photo').length
  const videoCount = activeInterestMedia.length - photoCount

  const changeMedia = (offset: number) => {
    if (activeInterestMedia.length < 2) return
    setActiveMediaIndex((currentIndex) => (
      currentIndex + offset + activeInterestMedia.length
    ) % activeInterestMedia.length)
  }

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

        <nav
          ref={mobileRibbonRef}
          className="classic-mobile-ribbon"
          aria-label={text.sectionNavigation}
        >
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
            className="classic-ribbon-adventure"
            to={`/${routeLocale}/adventure`}
            onClick={prepareAdventureOrientation}
          >
            <ClassicIcon name="rocket" />
            {text.adventure}
          </Link>
        </nav>

        <div
          ref={contentRef}
          className={`classic-scroll${activeSectionId === 'interests' ? ' is-interests' : ''}`}
          key={activeSectionId}
          role="region"
          tabIndex={0}
          aria-label={`${text.reader} — ${activeSectionLabel}`}
          aria-live="polite"
        >
          {activeSectionId === 'about' && (
            <>
              <section id="about" className="profile-intro">
                <div className="profile-intro-copy">
                  <SectionIndex number="01" label={text.about} icon="user" />
                  <h1>{localize(portfolio.profile.title, routeLocale)}</h1>
                  <figure className="profile-portrait">
                    <img
                      src={portfolio.profile.portrait.src}
                      alt={localize(portfolio.profile.portrait.alt, routeLocale)}
                      width="1295"
                      height="1619"
                      decoding="async"
                    />
                  </figure>
                  <p>{localize(portfolio.profile.introduction, routeLocale)}</p>
                  <span className="availability">
                    <i aria-hidden="true" />
                    {localize(portfolio.profile.availability, routeLocale)}
                  </span>
                  <ContactShortcut locale={routeLocale} className="about-contact-shortcut" />
                </div>
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
              <div className="interest-picker" role="group" aria-label={text.interestPicker}>
                {portfolio.interests.map((interest) => (
                  <button
                    type="button"
                    key={interest.id}
                    className={activeInterest?.id === interest.id ? 'is-active' : undefined}
                    aria-pressed={activeInterest?.id === interest.id}
                    onClick={() => {
                      setActiveInterestId(interest.id)
                      setActiveMediaIndex(0)
                    }}
                  >
                    <ClassicIcon name={interestIcons[interest.id] ?? 'compass'} />
                    <span>{localize(interest.label, routeLocale)}</span>
                  </button>
                ))}
              </div>
              {activeInterest && (
                <article className="interest-showcase">
                  <header>
                    <h2>
                      <ClassicIcon name={interestIcons[activeInterest.id] ?? 'compass'} />
                      {localize(activeInterest.label, routeLocale)}
                    </h2>
                    {activeInterestMedia.length > 0 && (
                      <span className="interest-media-count">
                        {photoCount > 0 && (
                          <span>{photoCount} {photoCount === 1 ? text.photoSingular : text.photoPlural}</span>
                        )}
                        {photoCount > 0 && videoCount > 0 && <span aria-hidden="true">·</span>}
                        {videoCount > 0 && (
                          <span>{videoCount} {videoCount === 1 ? text.videoSingular : text.videoPlural}</span>
                        )}
                      </span>
                    )}
                  </header>
                  {activeInterestMedia.length > 0
                    ? (
                        <div
                          className="interest-carousel"
                          role="region"
                          aria-label={`${text.interestGallery} — ${localize(activeInterest.label, routeLocale)}`}
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.target instanceof HTMLVideoElement) return
                            if (event.key === 'ArrowLeft') {
                              event.preventDefault()
                              changeMedia(-1)
                            }
                            if (event.key === 'ArrowRight') {
                              event.preventDefault()
                              changeMedia(1)
                            }
                          }}
                        >
                          <div
                            className="interest-carousel-stage"
                            onPointerDown={(event) => {
                              if (event.target instanceof HTMLVideoElement) return
                              carouselPointerStartX.current = event.clientX
                            }}
                            onPointerUp={(event) => {
                              const pointerStartX = carouselPointerStartX.current
                              carouselPointerStartX.current = null
                              if (pointerStartX === null) return
                              const distance = event.clientX - pointerStartX
                              if (Math.abs(distance) < 44) return
                              changeMedia(distance > 0 ? -1 : 1)
                            }}
                            onPointerCancel={() => {
                              carouselPointerStartX.current = null
                            }}
                          >
                            {activeMedia?.kind === 'photo' && (
                              <img
                                key={activeMedia.path}
                                src={activeMedia.src}
                                alt={`${routeLocale === 'fr' ? 'Photo de' : 'Photo of'} ${localize(activeInterest.label, routeLocale)} — ${displayedMediaIndex + 1} / ${activeInterestMedia.length}`}
                                decoding="async"
                              />
                            )}
                            {activeMedia?.kind === 'video' && (
                              <video
                                key={activeMedia.path}
                                src={activeMedia.src}
                                aria-label={`${routeLocale === 'fr' ? 'Vidéo de' : 'Video of'} ${localize(activeInterest.label, routeLocale)} — ${displayedMediaIndex + 1} / ${activeInterestMedia.length}`}
                                controls
                                playsInline
                                preload="none"
                              />
                            )}
                            {activeInterestMedia.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  className="interest-carousel-arrow is-previous"
                                  aria-label={text.previousMedia}
                                  onClick={() => changeMedia(-1)}
                                >
                                  <span aria-hidden="true">←</span>
                                </button>
                                <button
                                  type="button"
                                  className="interest-carousel-arrow is-next"
                                  aria-label={text.nextMedia}
                                  onClick={() => changeMedia(1)}
                                >
                                  <span aria-hidden="true">→</span>
                                </button>
                              </>
                            )}
                          </div>
                          {activeInterestMedia.length > 1 && (
                            <footer className="interest-carousel-footer">
                              <span className="interest-carousel-count" aria-live="polite">
                                {displayedMediaIndex + 1} / {activeInterestMedia.length}
                              </span>
                              <div className="interest-carousel-dots">
                                {activeInterestMedia.map(({ path, kind }, index) => (
                                  <button
                                    type="button"
                                    key={path}
                                    className={`${kind === 'video' ? 'is-video ' : ''}${displayedMediaIndex === index ? 'is-active' : ''}`.trim()}
                                    aria-label={`${text.showMedia} ${index + 1} (${kind === 'video' ? text.videoSingular : text.photoSingular})`}
                                    aria-current={displayedMediaIndex === index ? 'true' : undefined}
                                    onClick={() => setActiveMediaIndex(index)}
                                  />
                                ))}
                              </div>
                            </footer>
                          )}
                        </div>
                      )
                    : <p className="interest-empty">{text.photosComingSoon}</p>}
                </article>
              )}
            </section>
          )}

          {activeSectionId === 'documents' && (
            <section id="documents" className="link-section">
              <SectionIndex number="07" label={text.documents} icon="file" />
              {cvDocument?.preview && (
                <div className="cv-preview">
                  <header className="cv-preview-header">
                    <div>
                      <p className="mode-kicker">PDF · FR / EN</p>
                      <h2>{text.cvPreviewTitle}</h2>
                    </div>
                    <div className="cv-preview-languages" role="group" aria-label={text.cvPreviewLanguage}>
                      {(['fr', 'en'] as const).map((previewLocale) => (
                        <button
                          key={previewLocale}
                          type="button"
                          className={cvPreviewLocale === previewLocale ? 'is-active' : undefined}
                          aria-pressed={cvPreviewLocale === previewLocale}
                          onClick={() => setCvPreviewOverride({ forLocale: routeLocale, previewLocale })}
                        >
                          {previewLocale.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </header>
                  <div className="cv-preview-layout">
                    <div
                      className="cv-preview-page"
                      role="region"
                      tabIndex={0}
                      aria-label={cvPreviewLocale === 'fr' ? 'Aperçu du CV en français' : 'English resume preview'}
                    >
                      <img
                        src={cvDocument.preview[cvPreviewLocale]}
                        alt={cvPreviewLocale === 'fr' ? 'Première page du CV de Willy Somkhit en français' : 'English page of Willy Somkhit’s resume'}
                        width="844"
                        height="1219"
                        decoding="async"
                      />
                    </div>
                    <div className="cv-preview-aside">
                      <p>{text.cvPreviewDescription}</p>
                      <a href={cvDocument.href} target="_blank" rel="noopener noreferrer" className="primary-link">
                        <ClassicIcon name="external" />
                        {text.openCv}
                      </a>
                      <small>{text.cvPreviewScroll}</small>
                    </div>
                  </div>
                </div>
              )}
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
