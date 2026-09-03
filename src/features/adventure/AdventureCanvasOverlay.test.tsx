// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { act, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdventureBridge } from '../../game/bridge/AdventureBridge'
import { AdventureCanvasOverlay } from './AdventureCanvasOverlay'

describe('AdventureCanvasOverlay', () => {
  it('moves the transparent hero copy with the Phaser player without rerendering React', () => {
    const bridge = new AdventureBridge()
    const { container } = render(
      <AdventureCanvasOverlay
        bridge={bridge}
        locale="fr"
        screenId="study-ruins"
        tutorialCompleted
        fragmentState="ready"
      />,
    )
    const playerVisual = container.querySelector<HTMLElement>('.canvas-player-visual')!

    expect(playerVisual.style.left).toBe('50%')
    expect(Number.parseFloat(playerVisual.style.top)).toBeCloseTo(76.3889, 4)

    act(() => bridge.emitPlayerVisual({ x: 120, y: 96, frame: 6, visible: true }))

    expect(playerVisual.style.left).toBe('25%')
    expect(Number.parseFloat(playerVisual.style.top)).toBeCloseTo(33.3333, 4)
    const [backgroundX, backgroundY] = playerVisual.style.backgroundPosition.split(' ').map(Number.parseFloat)
    expect(backgroundX).toBeCloseTo(66.6667, 4)
    expect(backgroundY).toBeCloseTo(16.6667, 4)

    act(() => bridge.emitPlayerVisual({ x: 120, y: 96, frame: 6, visible: false }))
    expect(playerVisual).not.toBeVisible()
  })

  it('keeps the locked-beacon instruction out of the persistent game overlay', () => {
    const bridge = new AdventureBridge()
    const { queryByText } = render(
      <AdventureCanvasOverlay
        bridge={bridge}
        locale="fr"
        screenId="study-ruins"
        tutorialCompleted
        fragmentState="locked"
      />,
    )

    expect(queryByText(/récit/i)).not.toBeInTheDocument()
  })
})
