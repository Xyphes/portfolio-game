import { describe, expect, it } from 'vitest'
import { adventureWorld } from '../content/adventure.data'
import { ADVENTURE_VIEWPORT, getContentPositions, SCREEN_OBSTACLES } from './worldLayout'
import { DECORATION_DEFINITIONS, SCREEN_DECORATIONS, SCREEN_MOBS } from './adventureEncounters'

const monsterTextures = new Set(['monster-slime', 'monster-bat', 'monster-mushroom'])

describe('adventure encounters', () => {
  it('keeps decorations and mob patrols inside the playable area', () => {
    for (const screen of adventureWorld.screens) {
      for (const decoration of SCREEN_DECORATIONS[screen.kind]) {
        const [, , width, height] = DECORATION_DEFINITIONS[decoration.texture].frame
        expect(decoration.x - width / 2).toBeGreaterThanOrEqual(16)
        expect(decoration.x + width / 2).toBeLessThanOrEqual(ADVENTURE_VIEWPORT.width - 16)
        expect(decoration.y - height / 2).toBeGreaterThanOrEqual(16)
        expect(decoration.y + height / 2).toBeLessThanOrEqual(ADVENTURE_VIEWPORT.height - 16)
        expect(['solid', 'layout', 'none']).toContain(decoration.collision)
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
        expect(monsterTextures.has(mob.texture)).toBe(true)
      }
    }
  })

  it('gives each room a distinct decoration signature made of complete frames', () => {
    const signatures = Object.values(SCREEN_DECORATIONS).map((decorations) =>
      decorations.map(({ texture }) => texture).sort().join('|'),
    )

    expect(new Set(signatures).size).toBe(signatures.length)
    expect(signatures.join('|')).not.toContain('nature-flowers')
    expect(signatures.join('|')).not.toContain('ruin-rubble')
    for (const decorations of Object.values(SCREEN_DECORATIONS)) {
      expect(decorations.some(({ collision }) => collision !== 'none')).toBe(true)
    }
    expect(SCREEN_DECORATIONS.training).toHaveLength(2)
    expect(SCREEN_DECORATIONS.training.every(({ texture, collision }) =>
      texture === 'nature-small-bush' && collision === 'solid',
    )).toBe(true)
    expect(SCREEN_DECORATIONS.studies[0]).toMatchObject({
      texture: 'nature-rocks',
      collision: 'solid',
    })
    expect(DECORATION_DEFINITIONS['camp-tent'].frame).toEqual([64, 0, 48, 48])
    expect(SCREEN_DECORATIONS.personal[0]).toMatchObject({
      texture: 'camp-tent',
      collision: 'solid',
    })
    expect(SCREEN_OBSTACLES.personal).toHaveLength(0)
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
        for (const decoration of SCREEN_DECORATIONS[screen.kind]) {
          if (decoration.collision !== 'solid') continue
          expect(Math.hypot(mob.x - decoration.x, mob.y - decoration.y)).toBeGreaterThanOrEqual(32)
        }
      }
    }
  })

  it('keeps the project workstations and eastern entrance accessible', () => {
    const projects = adventureWorld.screens.find((screen) => screen.kind === 'projects')!
    const markers = getContentPositions(projects.contentRefs.length)

    expect(SCREEN_OBSTACLES.projects).toHaveLength(0)
    for (const decoration of SCREEN_DECORATIONS.projects) {
      if (decoration.collision !== 'solid') continue
      for (const [x, y] of markers) {
        expect(Math.hypot(decoration.x - x, decoration.y - y)).toBeGreaterThanOrEqual(40)
      }
      expect(decoration.x > 400 && decoration.y >= 112 && decoration.y <= 176).toBe(false)
    }
  })
})
