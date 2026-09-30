// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdventureBridge } from '../../game/bridge/AdventureBridge'
import { konamiDirectionEventName } from '../../shared/konamiInput'
import { TouchControls } from './TouchControls'

describe('TouchControls', () => {
  afterEach(cleanup)

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
      configurable: true,
      value: vi.fn(),
    })
  })

  it('follows a captured pointer across cardinal and diagonal directions', () => {
    const bridge = new AdventureBridge()
    render(<TouchControls bridge={bridge} locale="en" />)

    const rightButton = screen.getByRole('button', { name: 'Right' })
    const upButton = screen.getByRole('button', { name: 'Up' })
    const dpad = rightButton.parentElement!
    vi.spyOn(dpad, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100))

    fireEvent.pointerDown(rightButton, { pointerId: 7, clientX: 95, clientY: 50 })
    expect(bridge.isDirectionHeld('right')).toBe(true)
    expect(rightButton).toHaveClass('is-active')

    fireEvent.pointerMove(rightButton, { pointerId: 7, clientX: 82, clientY: 18 })
    expect(bridge.isDirectionHeld('right')).toBe(true)
    expect(bridge.isDirectionHeld('up')).toBe(true)
    expect(rightButton).toHaveClass('is-active')
    expect(upButton).toHaveClass('is-active')

    fireEvent.pointerMove(rightButton, { pointerId: 7, clientX: 50, clientY: 4 })
    expect(bridge.isDirectionHeld('right')).toBe(false)
    expect(bridge.isDirectionHeld('up')).toBe(true)

    fireEvent.pointerUp(rightButton, { pointerId: 7, clientX: 50, clientY: 4 })
    expect(bridge.isDirectionHeld('up')).toBe(false)
    expect(upButton).not.toHaveClass('is-active')
  })

  it('emits each newly pressed pad direction for the secret sequence', () => {
    const bridge = new AdventureBridge()
    const receivedDirections: string[] = []
    const handleDirection = (event: Event) => {
      receivedDirections.push((event as CustomEvent<string>).detail)
    }
    window.addEventListener(konamiDirectionEventName, handleDirection)
    render(<TouchControls bridge={bridge} locale="en" />)

    const upButton = screen.getByRole('button', { name: 'Up' })
    const dpad = upButton.parentElement!
    vi.spyOn(dpad, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100))

    fireEvent.pointerDown(upButton, { pointerId: 8, clientX: 50, clientY: 4 })
    fireEvent.pointerUp(upButton, { pointerId: 8, clientX: 50, clientY: 4 })

    expect(receivedDirections).toEqual(['up'])
    window.removeEventListener(konamiDirectionEventName, handleDirection)
  })
})
