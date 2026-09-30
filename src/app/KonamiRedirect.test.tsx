// @vitest-environment jsdom

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { dispatchKonamiDirection } from '../shared/konamiInput'
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

  it('accepts the equivalent WASD sequence', () => {
    const onComplete = vi.fn()
    render(<KonamiRedirect onComplete={onComplete} />)

    ;['w', 'w', 's', 's', 'a', 'd', 'a', 'd'].forEach((key) => {
      fireEvent.keyDown(window, { key })
    })

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('accepts directions emitted by the touch pad', () => {
    const onComplete = vi.fn()
    render(<KonamiRedirect onComplete={onComplete} />)

    ;(['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right'] as const)
      .forEach(dispatchKonamiDirection)

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
