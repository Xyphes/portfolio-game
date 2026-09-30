// @vitest-environment jsdom

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { KonamiRedirect } from './KonamiRedirect'

const sequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
]

describe('KonamiRedirect', () => {
  it('activates after the arrow-only Konami sequence', () => {
    const onComplete = vi.fn()
    render(<KonamiRedirect onComplete={onComplete} />)

    sequence.forEach((key) => fireEvent.keyDown(window, { key }))

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('resets after an incorrect key', () => {
    const onComplete = vi.fn()
    render(<KonamiRedirect onComplete={onComplete} />)

    ;['ArrowUp', 'ArrowUp', 'ArrowRight', ...sequence.slice(2)].forEach((key) => {
      fireEvent.keyDown(window, { key })
    })

    expect(onComplete).not.toHaveBeenCalled()
  })
})
