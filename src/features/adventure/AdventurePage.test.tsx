// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createInitialProgress, TUTORIAL_FLAG_ID } from '../../domain/progression'
import { LanguageContext } from '../../shared/language'
import { AdventurePage } from './AdventurePage'

vi.mock('./PhaserHost', () => ({ PhaserHost: () => <div /> }))
vi.mock('./TouchControls', () => ({ TouchControls: () => <div /> }))
vi.mock('./orientation', () => ({
  requestAdventureFullscreen: vi.fn(async () => false),
  requestLandscapeOrientation: vi.fn(async () => ({ status: 'unsupported' })),
  restoreAdventureOrientation: vi.fn(async () => undefined),
}))

afterEach(() => {
  cleanup()
  document.head.innerHTML = ''
  window.localStorage.clear()
})

describe('AdventurePage contact', () => {
  it.each([
    ['fr', 'Contacts', 'Téléphone', 'E-mail'],
    ['en', 'Contact links', 'Phone', 'Email'],
  ] as const)('shows all contact icons before playing in %s', (locale, label, phoneLabel, emailLabel) => {
    render(
      <MemoryRouter initialEntries={[`/${locale}/adventure`]}>
        <LanguageContext.Provider value={{ locale, setLocale: vi.fn() }}>
          <Routes>
            <Route path="/:locale/adventure" element={<AdventurePage />} />
          </Routes>
        </LanguageContext.Provider>
      </MemoryRouter>,
    )

    const contacts = screen.getAllByRole('navigation', { name: label })
    expect(contacts).toHaveLength(2)
    for (const contactGroup of contacts) {
      expect(within(contactGroup).getAllByRole('link')).toHaveLength(4)
      expect(within(contactGroup).getByRole('link', { name: phoneLabel }))
        .toHaveAttribute('href', 'tel:+33695523317')
      expect(within(contactGroup).getByRole('link', { name: emailLabel }))
        .toHaveAttribute('href', 'mailto:willy.somkhit@epita.fr')
      expect(within(contactGroup).getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
      expect(within(contactGroup).getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    }
    expect(screen.queryByRole('link', { name: 'Contact me' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: locale === 'fr' ? 'Informations' : 'Information' }))
    expect(screen.getAllByRole('navigation', { name: label })).toHaveLength(3)
  })

  it('keeps monster mode and its health display disabled until requested', () => {
    render(
      <MemoryRouter initialEntries={['/fr/adventure']}>
        <LanguageContext.Provider value={{ locale: 'fr', setLocale: vi.fn() }}>
          <Routes>
            <Route path="/:locale/adventure" element={<AdventurePage />} />
          </Routes>
        </LanguageContext.Provider>
      </MemoryRouter>,
    )

    const toggle = screen.getByRole('button', { name: 'Mode monstres · Désactivé' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('status', { name: 'Points de vie: 3 / 3' })).not.toBeInTheDocument()

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'Mode monstres · Activé' }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status', { name: 'Points de vie: 3 / 3' })).toBeInTheDocument()
  })

  it('returns to the starting clearing when monster mode is enabled without losing progress', () => {
    window.localStorage.setItem('portfolio-game:progress', JSON.stringify({
      ...createInitialProgress(),
      fragments: ['thales-rigor'],
      flags: [TUTORIAL_FLAG_ID],
      lastScreenId: 'project-workshop',
    }))
    render(
      <MemoryRouter initialEntries={['/fr/adventure']}>
        <LanguageContext.Provider value={{ locale: 'fr', setLocale: vi.fn() }}>
          <Routes>
            <Route path="/:locale/adventure" element={<AdventurePage />} />
          </Routes>
        </LanguageContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByText(/Atelier des projets.*Découvertes/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Mode monstres · Désactivé' }))

    expect(screen.getByText(/Clairière d’initiation.*Découvertes/)).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('portfolio-game:progress')!))
      .toMatchObject({
        lastScreenId: 'training-clearing',
        fragments: ['thales-rigor'],
        flags: [TUTORIAL_FLAG_ID],
      })
  })
})
