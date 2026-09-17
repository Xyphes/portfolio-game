// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LanguageContext } from '../../shared/language'
import { LandingPage } from './LandingPage'

afterEach(() => {
  cleanup()
  document.head.innerHTML = ''
})

describe('LandingPage contact', () => {
  it.each([
    ['fr', 'Contacts', 'Téléphone', 'E-mail'],
    ['en', 'Contact links', 'Phone', 'Email'],
  ] as const)('shows all four contact icons below the mode cards in %s', (locale, navigationLabel, phoneLabel, emailLabel) => {
    render(
      <MemoryRouter>
        <LanguageContext.Provider value={{ locale, setLocale: vi.fn() }}>
          <LandingPage />
        </LanguageContext.Provider>
      </MemoryRouter>,
    )

    const contacts = screen.getByRole('navigation', { name: navigationLabel })
    expect(within(contacts).getAllByRole('link')).toHaveLength(4)
    expect(within(contacts).getByRole('link', { name: phoneLabel }))
      .toHaveAttribute('href', 'tel:+33695523317')
    expect(within(contacts).getByRole('link', { name: emailLabel }))
      .toHaveAttribute('href', 'mailto:willy.somkhit@epita.fr')
    expect(within(contacts).getByRole('link', { name: 'GitHub' }))
      .toHaveAttribute('href', 'https://github.com/Xyphes')
    expect(within(contacts).getByRole('link', { name: 'LinkedIn' }))
      .toHaveAttribute('href', 'https://www.linkedin.com/in/willy-somkhit/')
    expect(contacts.parentElement?.previousElementSibling).toHaveClass('mode-grid')
    expect(screen.queryByText(/Portfolio interactif|Interactive portfolio|Une seule source de contenu|One shared content source/))
      .not.toBeInTheDocument()
  })
})
