import { describe, expect, it } from 'vitest'
import { getPointerMovement } from './pointerNavigation'

describe('pointer navigation', () => {
  it('moves toward a destination at the requested constant speed', () => {
    const movement = getPointerMovement({ x: 10, y: 20 }, { x: 40, y: 60 }, 50)

    expect(movement.reached).toBe(false)
    expect(movement.velocityX).toBeCloseTo(30)
    expect(movement.velocityY).toBeCloseTo(40)
    expect(Math.hypot(movement.velocityX, movement.velocityY)).toBeCloseTo(50)
  })

  it('stops inside the destination arrival radius', () => {
    expect(getPointerMovement({ x: 10, y: 10 }, { x: 13, y: 14 }, 72, 5)).toEqual({
      reached: true,
      velocityX: 0,
      velocityY: 0,
    })
  })
})
