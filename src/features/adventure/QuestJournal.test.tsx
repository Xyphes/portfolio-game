// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { addFragment, createInitialProgress, PROOF_FRAGMENT_ID } from '../../domain/progression'
import { QuestJournal } from './QuestJournal'

describe('QuestJournal', () => {
  it('separates the professional route from the optional epilogue', () => {
    const onClose = vi.fn()
    const onReset = vi.fn()
    const progress = addFragment(createInitialProgress(), PROOF_FRAGMENT_ID)

    render(
      <QuestJournal
        locale="fr"
        progress={progress}
        currentScreenId="thales-grove"
        onClose={onClose}
        onReset={onReset}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Fragments du parcours' })).toBeInTheDocument()
    expect(screen.getAllByText('Quête principale')).toHaveLength(3)
    expect(screen.getByText('Épilogue facultatif')).toBeInTheDocument()
    expect(screen.getByText('Zone actuelle')).toBeInTheDocument()
    expect(screen.getByText('Fragment obtenu')).toBeInTheDocument()
    expect(screen.getAllByText('Fragment à retrouver')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Fermer le journal' })).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('requires explicit confirmation before resetting progress', () => {
    const onReset = vi.fn()
    render(
      <QuestJournal
        locale="en"
        progress={createInitialProgress()}
        currentScreenId="training-clearing"
        onClose={vi.fn()}
        onReset={onReset}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Restart adventure' }))
    expect(screen.getByRole('group', { name: 'Clear game progress?' })).toBeInTheDocument()
    expect(onReset).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Yes, restart' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('group', { name: 'Clear game progress?' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restart adventure' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Restart adventure' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, restart' }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
