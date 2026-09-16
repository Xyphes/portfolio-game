// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LanguageContext } from '../../shared/language'
import { LandingPage } from './LandingPage'

afterEach(() => {
  cleanup()
  document.head.innerHTML = ''
})

describe('LandingPage contact', () => {
  it('offers a direct email link without entering either mode', () => {
    render(
      <MemoryRouter>
        <LanguageContext.Provider value={{ locale: 'fr', setLocale: vi.fn() }}>
          <LandingPage />
        </LanguageContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Me contacter' }))
      .toHaveAttribute('href', 'mailto:willy.somkhit@epita.fr')
  })
})
