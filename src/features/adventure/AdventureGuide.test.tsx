// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AdventureGuide } from './AdventureGuide'

describe('AdventureGuide', () => {
  it('explains the complete recruiter loop and offers the classic escape route', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <AdventureGuide locale="fr" onClose={onClose} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('dialog', { name: 'L’essentiel en quelques secondes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Découvrez un récit' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Explorez à votre rythme' })).toBeInTheDocument()
    expect(screen.getByText(/Le fragment de la zone est obtenu immédiatement/)).toBeInTheDocument()
    expect(screen.getByText('Un récit dans chacune des trois zones termine le parcours professionnel. La voie personnelle est un épilogue entièrement facultatif.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ouvrir le mode classique' })).toHaveAttribute('href', '/fr/classic')
    expect(screen.getByRole('button', { name: 'Commencer l’exploration' })).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders English controls', () => {
    render(
      <MemoryRouter>
        <AdventureGuide locale="en" onClose={vi.fn()} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Arrow keys · WASD · ZQSD')).toBeInTheDocument()
    expect(screen.getByText('E · Space · A button')).toBeInTheDocument()
    expect(screen.getByText('Click a destination or an item')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open classic mode' })).toHaveAttribute('href', '/en/classic')
  })
})
