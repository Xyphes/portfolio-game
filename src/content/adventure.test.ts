import { describe, expect, it } from 'vitest'
import { adventureWorld, getAdventureScreen } from './adventure.data'
import { adventureWorldSchema } from './adventure.schema'

describe('adventure world content', () => {
  it('defines a valid open screen graph around the training clearing', () => {
    expect(adventureWorldSchema.parse(adventureWorld)).toBeDefined()
    expect(getAdventureScreen('training-clearing').exits).toEqual({
      up: 'study-ruins',
      down: 'personal-trail',
      left: 'project-workshop',
      right: 'thales-grove',
    })
  })

  it('falls back to the start screen for an obsolete saved screen', () => {
    expect(getAdventureScreen('missing').id).toBe(adventureWorld.startScreenId)
  })

  it('exposes every approved content category through ready screens', () => {
    const references = adventureWorld.screens.flatMap((screen) => screen.contentRefs)

    expect(new Set(references.map(({ kind }) => kind))).toEqual(
      new Set(['experience', 'education', 'project', 'interest']),
    )
    expect(adventureWorld.screens.filter(({ fragment }) => fragment)).toHaveLength(4)
    expect(adventureWorld.screens.every(({ contentStatus }) => contentStatus === 'ready')).toBe(true)
  })

  it('keeps every branch one transition away from the central hub', () => {
    const hub = getAdventureScreen(adventureWorld.startScreenId)
    const branchIds = Object.values(hub.exits)
    const branches = adventureWorld.screens.filter(({ id }) => id !== hub.id)

    expect(branchIds).toHaveLength(4)
    expect(new Set(branchIds)).toEqual(new Set(branches.map(({ id }) => id)))
    for (const branch of branches) {
      expect(Object.values(branch.exits)).toContain(hub.id)
      expect(branch.contentRefs.length).toBeGreaterThan(0)
    }
  })
})
