import { describe, expect, it } from 'vitest'
import { getKnockbackVelocity } from './combatFeedback'

describe('combat feedback', () => {
  it('pushes the player directly away from the enemy', () => {
    expect(getKnockbackVelocity(
      { x: 80, y: 50 },
      { x: 100, y: 50 },
      160,
      { x: 0, y: 1 },
    )).toEqual({ x: -160, y: 0 })

    const diagonal = getKnockbackVelocity(
      { x: 110, y: 110 },
      { x: 100, y: 100 },
      160,
      { x: 0, y: 1 },
    )
    expect(Math.hypot(diagonal.x, diagonal.y)).toBeCloseTo(160)
    expect(diagonal.x).toBeGreaterThan(0)
    expect(diagonal.y).toBeGreaterThan(0)
  })

  it('uses the facing fallback when both sprites have the same position', () => {
    expect(getKnockbackVelocity(
      { x: 100, y: 100 },
      { x: 100, y: 100 },
      160,
      { x: 0, y: -1 },
    )).toEqual({ x: 0, y: -160 })
  })
})
