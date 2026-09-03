// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useModalFocus } from './useModalFocus'

function DialogHarness({ active, onDismiss }: { active: boolean; onDismiss: () => void }) {
  const dialogRef = useRef<HTMLElement>(null)
  useModalFocus(active, dialogRef, onDismiss)

  return active ? (
    <section ref={dialogRef} tabIndex={-1} role="dialog">
      <button type="button">First</button>
      <button type="button">Last</button>
    </section>
  ) : null
}

describe('useModalFocus', () => {
  it('traps focus, dismisses with Escape, and restores the previous focus', () => {
    const onDismiss = vi.fn()
    const { rerender } = render(
      <>
        <button type="button">Outside</button>
        <DialogHarness active={false} onDismiss={onDismiss} />
      </>,
    )
    screen.getByRole('button', { name: 'Outside' }).focus()

    rerender(
      <>
        <button type="button">Outside</button>
        <DialogHarness active onDismiss={onDismiss} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()

    screen.getByRole('button', { name: 'Last' }).focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onDismiss).toHaveBeenCalledOnce()

    rerender(
      <>
        <button type="button">Outside</button>
        <DialogHarness active={false} onDismiss={onDismiss} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus()
  })
})
