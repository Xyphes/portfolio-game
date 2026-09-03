// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LanguageContext } from '../../shared/language'
import { ClassicPage } from './ClassicPage'

function renderClassicPage(hash = '') {
  window.history.replaceState(null, '', `/${hash}`)
  return render(
    <MemoryRouter initialEntries={['/en/classic']}>
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

  it('opens the compact menu, selects a category, and closes with Escape', () => {
    renderClassicPage('#projects')
    const menuButton = screen.getByRole('button', { name: 'Menu' })

    expect(screen.getByRole('heading', { name: 'C# video game' })).toBeInTheDocument()
    fireEvent.click(menuButton)

    const mobileNavigation = screen.getByRole('navigation', { name: 'Section navigation' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(within(mobileNavigation).getByRole('link', { name: /Switch to adventure/ })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(mobileNavigation).toHaveAttribute('hidden')
  })
})
