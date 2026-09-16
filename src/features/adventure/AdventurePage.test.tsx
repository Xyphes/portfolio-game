// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
  it('makes email contact available before playing or collecting fragments', () => {
    render(
      <MemoryRouter initialEntries={['/en/adventure']}>
        <LanguageContext.Provider value={{ locale: 'en', setLocale: vi.fn() }}>
          <Routes>
            <Route path="/:locale/adventure" element={<AdventurePage />} />
          </Routes>
        </LanguageContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Contact me' }))
      .toHaveAttribute('href', 'mailto:willy.somkhit@epita.fr')
  })
})
