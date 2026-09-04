import { describe, expect, it, vi } from 'vitest'
import { AdventureBridge } from './AdventureBridge'

describe('AdventureBridge', () => {
  it('translates held controls and consumes actions only once', () => {
    const bridge = new AdventureBridge()

    bridge.setDirection('left', true)
    bridge.queueAction()

    expect(bridge.isDirectionHeld('left')).toBe(true)
    expect(bridge.consumeAction()).toBe(true)
    expect(bridge.consumeAction()).toBe(false)

    bridge.setDirection('left', false)
    expect(bridge.isDirectionHeld('left')).toBe(false)

    bridge.setRuntimeState({ inputEnabled: false })
    bridge.setDirection('up', true)
    bridge.queueAction()
    expect(bridge.isDirectionHeld('up')).toBe(false)
    expect(bridge.consumeAction()).toBe(false)
  })

  it('notifies React-facing listeners and releases state on disposal', () => {
    const reference = { kind: 'experience', id: 'thales' } as const
    const bridge = new AdventureBridge({
      lastScreenId: 'thales-grove',
      discoveredContentKeys: ['experience:thales'],
    })
    const listener = vi.fn()
    const eventListener = vi.fn()
    bridge.onInteraction(listener)
    bridge.onEvent(eventListener)

    bridge.emitInteraction(reference)
    expect(listener).toHaveBeenCalledWith(reference)
    expect(eventListener).toHaveBeenCalledWith({ type: 'content', reference })
    expect(bridge.isContentDiscovered(reference)).toBe(true)
    expect(bridge.getRuntimeState().lastScreenId).toBe('thales-grove')

    bridge.setDirection('up', true)
    bridge.queueAction()
    bridge.dispose()
    bridge.emitInteraction(reference)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(eventListener).toHaveBeenCalledTimes(1)
    expect(bridge.isDirectionHeld('up')).toBe(false)
    expect(bridge.consumeAction()).toBe(false)
  })

  it('shares player visual state with the overlay and releases its observer', () => {
    const bridge = new AdventureBridge()
    const visualListener = vi.fn()
    const unsubscribe = bridge.onPlayerVisual(visualListener)

    expect(visualListener).toHaveBeenCalledWith({ x: 240, y: 220, frame: 0, visible: true })
    bridge.emitPlayerVisual({ x: 180, y: 120, frame: 6, visible: true })
    bridge.emitPlayerVisual({ x: 180, y: 120, frame: 6, visible: true })
    expect(visualListener).toHaveBeenCalledTimes(2)

    unsubscribe()
    bridge.emitPlayerVisual({ x: 190, y: 120, frame: 6, visible: false })
    expect(visualListener).toHaveBeenCalledTimes(2)
  })
})
