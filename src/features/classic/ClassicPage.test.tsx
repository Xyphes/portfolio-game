// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LanguageContext } from '../../shared/language'
import { ClassicPage } from './ClassicPage'

function renderClassicPage(hash = '', locale = 'en') {
  window.history.replaceState(null, '', `/${hash}`)
  return render(
    <MemoryRouter initialEntries={[`/${locale}/classic`]}>
      <LanguageContext.Provider value={{ locale: 'en', setLocale: vi.fn() }}>
        <Routes>
          <Route path="/:locale/classic" element={<ClassicPage />} />
        </Routes>
      </LanguageContext.Provider>
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
  document.head.innerHTML = ''
})

describe('ClassicPage category navigation', () => {
  it.each([
    ['en', 'Contact links', 'Phone', 'Email'],
    ['fr', 'Contacts', 'Téléphone', 'E-mail'],
  ] as const)('offers every contact method from About in %s', (locale, navigationLabel, phoneLabel, emailLabel) => {
    renderClassicPage('', locale)

    const contacts = screen.getByRole('navigation', { name: navigationLabel })
    expect(within(contacts).getAllByRole('link')).toHaveLength(4)
    expect(within(contacts).getByRole('link', { name: phoneLabel }))
      .toHaveAttribute('href', 'tel:+33695523317')
    expect(within(contacts).getByRole('link', { name: emailLabel }))
      .toHaveAttribute('href', 'mailto:willy.somkhit@epita.fr')
    expect(within(contacts).getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(within(contacts).getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Contact me' })).not.toBeInTheDocument()
  })

  it('replaces the right-hand content and preserves the active category in the hash', () => {
    renderClassicPage()
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })

    expect(screen.getByRole('heading', { name: 'Full-stack Software Engineer' })).toBeInTheDocument()
    fireEvent.click(within(navigation).getByRole('button', { name: 'Skills' }))

    expect(screen.queryByRole('heading', { name: 'Full-stack Software Engineer' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Programming languages' })).toBeInTheDocument()
    expect(within(navigation).getByRole('button', { name: 'Skills' })).toHaveAttribute('aria-current', 'page')
    expect(window.location.hash).toBe('#skills')
  })

  it('keeps every category and the adventure link in the horizontal mobile ribbon', () => {
    renderClassicPage('#projects')
    const mobileNavigation = screen.getByRole('navigation', { name: 'Section navigation' })
    expect(screen.getByRole('heading', { name: 'C# video game' })).toBeInTheDocument()
    expect(within(mobileNavigation).getAllByRole('button')).toHaveLength(8)
    expect(within(mobileNavigation).getByRole('link', { name: /Switch to adventure/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Menu' })).not.toBeInTheDocument()

    fireEvent.click(within(mobileNavigation).getByRole('button', { name: 'Skills' }))
    expect(screen.getByRole('heading', { name: 'Programming languages' })).toBeInTheDocument()
    expect(within(mobileNavigation).getByRole('button', { name: 'Skills' })).toHaveAttribute('aria-current', 'page')
    expect(window.location.hash).toBe('#skills')
  })

  it('renders decorative icons for skills, interests, downloads, and contact methods', () => {
    const { container } = renderClassicPage('#skills')
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })

    expect(within(navigation).getByRole('button', { name: 'Education' })
      .querySelector('[data-icon="graduation"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="code"]')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('[data-icon="globe"]')).toBeInTheDocument()

    fireEvent.click(within(navigation).getByRole('button', { name: 'Beyond code' }))
    expect(container.querySelector('[data-icon="climbing"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="leathercraft"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="jewelry"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="woodworking"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="lockpicking"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="traveling"]')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Lock picking' }))
    expect(screen.getByRole('button', { name: 'Lock picking' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: 'Lock picking' })).toBeInTheDocument()
    const gallery = screen.getByRole('region', { name: 'Photo and video gallery — Lock picking' })
    expect(within(gallery).getAllByRole('img')).toHaveLength(1)
    expect(within(gallery).getByRole('img')).toHaveAccessibleName(/1 \/ 2/)
    fireEvent.click(within(gallery).getByRole('button', { name: 'Next media item' }))
    expect(within(gallery).getByRole('img')).toHaveAccessibleName(/2 \/ 2/)
    fireEvent.keyDown(gallery, { key: 'ArrowLeft' })
    expect(within(gallery).getByRole('img')).toHaveAccessibleName(/1 \/ 2/)

    fireEvent.click(within(navigation).getByRole('button', { name: 'Documents' }))
    expect(container.querySelectorAll('[data-icon="download"]')).toHaveLength(2)
    expect(screen.queryByText('↓')).not.toBeInTheDocument()

    fireEvent.click(within(navigation).getByRole('button', { name: 'Contact' }))
    expect(container.querySelector('[data-icon="phone"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="email"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="github"]')).toBeInTheDocument()
    expect(container.querySelector('[data-icon="linkedin"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-icon="external"]')).toHaveLength(4)
  })

  it('places the two downloads above the compact English resume preview', () => {
    renderClassicPage('#documents')

    const preview = screen.getByRole('figure', { name: 'Resume preview' })
    expect(within(preview).getByRole('img', { name: /Second page/ }))
      .toHaveAttribute('src', '/documents/CV-preview-en.png')
    const cvDownload = screen.getByRole('link', { name: /Download my resume/ })
    const recommendationDownload = screen.getByRole('link', { name: /Recommendation letter/ })
    expect(cvDownload).toHaveAttribute('href', '/documents/CV-Somkhit-Willy-2026-FR-ENG.pdf')
    expect(cvDownload).toHaveAttribute('download')
    expect(recommendationDownload).toHaveAttribute('download')
    expect(cvDownload.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(recommendationDownload.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.queryByRole('link', { name: /Open the full PDF/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Resume preview language' })).not.toBeInTheDocument()
  })

  it('shows page one of the resume automatically on the French route', () => {
    renderClassicPage('#documents', 'fr')

    expect(within(screen.getByRole('figure', { name: 'Le CV en aperçu' })).getByRole('img', { name: /Première page/ }))
      .toHaveAttribute('src', '/documents/CV-preview-fr.png')
  })

  it('shows existing videos in the carousel without autoplay or eager loading', () => {
    const { container } = renderClassicPage('#interests')
    const gallery = screen.getByRole('region', { name: 'Photo and video gallery — Climbing' })

    expect(screen.getByText('1 photo')).toBeInTheDocument()
    expect(screen.getByText('1 video')).toBeInTheDocument()
    expect(container.querySelector('video')).not.toBeInTheDocument()

    fireEvent.click(within(gallery).getByRole('button', { name: 'Next media item' }))
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('playsInline')
    expect(video).toHaveAttribute('preload', 'none')
    expect(video).not.toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('aria-label', 'Video of Climbing — 2 / 2')

    fireEvent.click(screen.getByRole('button', { name: 'Jewelry' }))
    expect(container.querySelector('video')).not.toBeInTheDocument()
  })

  it('keeps the mobile ribbon and mixed gallery labels bilingual', () => {
    renderClassicPage('#interests', 'fr')

    const ribbon = screen.getByRole('navigation', { name: 'Navigation des sections' })
    expect(within(ribbon).getByRole('button', { name: 'En dehors du code' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('region', { name: 'Galerie photo et vidéo — Escalade' })).toBeInTheDocument()
    expect(screen.getByText('1 vidéo')).toBeInTheDocument()
  })
})
