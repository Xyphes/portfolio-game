import { describe, expect, it } from 'vitest'
import { adventureWorld } from '../content/adventure.data'
import {
  ADVENTURE_VIEWPORT,
  getBoundaryObstacles,
  getContentPositions,
  isInsideExitOpening,
  SCREEN_OBSTACLES,
} from './worldLayout'

function containsPoint(
  [obstacleX, obstacleY, width, height]: readonly [number, number, number, number],
  x: number,
  y: number,
) {
  return Math.abs(x - obstacleX) <= width / 2 && Math.abs(y - obstacleY) <= height / 2
}

describe('adventure world layout', () => {
  it('keeps every content marker inside the readable play area and well separated', () => {
    for (const count of [3, 4, 6]) {
      const positions = getContentPositions(count)
      expect(positions).toHaveLength(count)

      for (const [index, [x, y]] of positions.entries()) {
        expect(x).toBeGreaterThanOrEqual(80)
        expect(x).toBeLessThanOrEqual(ADVENTURE_VIEWPORT.width - 80)
        expect(y).toBeGreaterThanOrEqual(70)
        expect(y).toBeLessThanOrEqual(ADVENTURE_VIEWPORT.height - 70)

        for (const [otherX, otherY] of positions.slice(index + 1)) {
          expect(Math.hypot(otherX - x, otherY - y)).toBeGreaterThanOrEqual(100)
        }
      }
    }
  })

  it('keeps visible collision clusters away from content markers', () => {
    for (const screen of adventureWorld.screens) {
      const positions = getContentPositions(screen.contentRefs.length)
      for (const [obstacleX, obstacleY, width, height] of SCREEN_OBSTACLES[screen.kind]) {
        for (const [contentX, contentY] of positions) {
          const overlapsExpandedObstacle = (
            Math.abs(contentX - obstacleX) <= width / 2 + 24
            && Math.abs(contentY - obstacleY) <= height / 2 + 24
          )
          expect(overlapsExpandedObstacle).toBe(false)
        }
      }
    }
  })

  it('blocks every border bush while leaving only declared exit openings clear', () => {
    const boundaryPoints = {
      up: { center: [240, 8], bush: [120, 8] },
      down: { center: [240, 280], bush: [360, 280] },
      left: { center: [8, 144], bush: [8, 72] },
      right: { center: [472, 144], bush: [472, 216] },
    } as const

    for (const screen of adventureWorld.screens) {
      const obstacles = getBoundaryObstacles(screen)
      for (const [direction, points] of Object.entries(boundaryPoints)) {
        const hasExit = Boolean(screen.exits[direction as keyof typeof screen.exits])
        const centerIsBlocked = obstacles.some((obstacle) =>
          containsPoint(obstacle, points.center[0], points.center[1]),
        )
        const bushIsBlocked = obstacles.some((obstacle) =>
          containsPoint(obstacle, points.bush[0], points.bush[1]),
        )

        expect(centerIsBlocked).toBe(!hasExit)
        expect(bushIsBlocked).toBe(true)
      }
    }
  })

  it('accepts transitions only through the central opening for that border', () => {
    expect(isInsideExitOpening({ x: 240, y: 8 }, 'up')).toBe(true)
    expect(isInsideExitOpening({ x: 120, y: 8 }, 'up')).toBe(false)
    expect(isInsideExitOpening({ x: 8, y: 144 }, 'left')).toBe(true)
    expect(isInsideExitOpening({ x: 8, y: 72 }, 'left')).toBe(false)
  })
})
