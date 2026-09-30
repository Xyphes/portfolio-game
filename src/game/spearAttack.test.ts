import { describe, expect, it } from 'vitest'
import { getSpearAttackGeometry, rectanglesOverlap } from './spearAttack'

describe('spear attack geometry', () => {
  it('places a directional hitbox only in front of the hero', () => {
    const origin = { x: 100, y: 100 }

    const right = getSpearAttackGeometry(origin, 'right')
    expect(rectanglesOverlap(right.hitbox, { x: 116, y: 96, width: 10, height: 8 })).toBe(true)
    expect(rectanglesOverlap(right.hitbox, { x: 78, y: 96, width: 10, height: 8 })).toBe(false)

    const up = getSpearAttackGeometry(origin, 'up')
    expect(rectanglesOverlap(up.hitbox, { x: 96, y: 76, width: 8, height: 10 })).toBe(true)
    expect(rectanglesOverlap(up.hitbox, { x: 96, y: 114, width: 8, height: 10 })).toBe(false)
  })

  it('rotates the spear consistently for every facing direction', () => {
    expect(getSpearAttackGeometry({ x: 0, y: 0 }, 'up').angle).toBe(0)
    expect(getSpearAttackGeometry({ x: 0, y: 0 }, 'right').angle).toBe(90)
    expect(getSpearAttackGeometry({ x: 0, y: 0 }, 'down').angle).toBe(180)
    expect(getSpearAttackGeometry({ x: 0, y: 0 }, 'left').angle).toBe(-90)
  })
})
