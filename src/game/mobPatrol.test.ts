import { describe, expect, it } from 'vitest'
import { nextPatrolDirection } from './mobPatrol'

describe('monster patrol', () => {
  it('reverses at each end without reversing again while moving back inside', () => {
    expect(nextPatrolDirection(135, 100, 30, 1, false)).toBe(-1)
    expect(nextPatrolDirection(134, 100, 30, -1, false)).toBe(-1)
    expect(nextPatrolDirection(65, 100, 30, -1, false)).toBe(1)
    expect(nextPatrolDirection(66, 100, 30, 1, false)).toBe(1)
  })

  it('turns around when an obstacle blocks the direction of travel', () => {
    expect(nextPatrolDirection(110, 100, 30, 1, true)).toBe(-1)
    expect(nextPatrolDirection(90, 100, 30, -1, true)).toBe(1)
  })
})
