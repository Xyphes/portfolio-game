import { describe, expect, it } from 'vitest'
import { adventureWorld } from '../content/adventure.data'
import { ADVENTURE_VIEWPORT, getContentPositions, SCREEN_OBSTACLES } from './worldLayout'
import { SCREEN_DECORATIONS, SCREEN_MOBS } from './adventureEncounters'

describe('adventure encounters', () => {
  it('keeps decorations and mob patrols inside the playable area', () => {
    for (const screen of adventureWorld.screens) {
      for (const decoration of SCREEN_DECORATIONS[screen.kind]) {
        expect(decoration.x).toBeGreaterThan(20)
        expect(decoration.x).toBeLessThan(ADVENTURE_VIEWPORT.width - 20)
        expect(decoration.y).toBeGreaterThan(20)
        expect(decoration.y).toBeLessThan(ADVENTURE_VIEWPORT.height - 20)
      }

      for (const mob of SCREEN_MOBS[screen.kind]) {
        const min = (mob.axis === 'horizontal' ? mob.x : mob.y) - mob.range
        const max = (mob.axis === 'horizontal' ? mob.x : mob.y) + mob.range
        const boundary = mob.axis === 'horizontal'
          ? ADVENTURE_VIEWPORT.width
          : ADVENTURE_VIEWPORT.height
        expect(min).toBeGreaterThan(20)
        expect(max).toBeLessThan(boundary - 20)
        expect(mob.speed).toBeGreaterThan(0)
        expect(mob.speed).toBeLessThan(40)
      }
    }
  })

  it('keeps mob spawn points away from content markers and solid clusters', () => {
    for (const screen of adventureWorld.screens) {
      const contentPositions = getContentPositions(screen.contentRefs.length)
      for (const mob of SCREEN_MOBS[screen.kind]) {
        for (const [contentX, contentY] of contentPositions) {
          expect(Math.hypot(mob.x - contentX, mob.y - contentY)).toBeGreaterThanOrEqual(40)
        }
        for (const [x, y, width, height] of SCREEN_OBSTACLES[screen.kind]) {
          const insideExpandedObstacle = (
            Math.abs(mob.x - x) <= width / 2 + 10
            && Math.abs(mob.y - y) <= height / 2 + 10
          )
          expect(insideExpandedObstacle).toBe(false)
        }
      }
    }
  })
})
