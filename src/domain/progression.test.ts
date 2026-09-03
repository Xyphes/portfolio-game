import { describe, expect, it } from 'vitest'
import {
  addDiscovery,
  addFragment,
  addFlag,
  createInitialProgress,
  getNextProfessionalFragmentId,
  isAdventureComplete,
  isProfessionalJourneyComplete,
  parseProgress,
  PERSONAL_FRAGMENT_ID,
  PROFESSIONAL_FRAGMENT_IDS,
  PROOF_FRAGMENT_ID,
  recordAdventureVisit,
  setLastScreen,
  START_SCREEN_ID,
  TUTORIAL_FLAG_ID,
} from './progression'

describe('progression', () => {
  it('falls back safely when a future or corrupt save is loaded', () => {
    expect(parseProgress({ version: 999, fragments: ['legacy'] })).toEqual(createInitialProgress())
    expect(parseProgress('corrupt')).toEqual(createInitialProgress())
  })

  it('migrates the prototype save without losing its fragment', () => {
    expect(parseProgress({
      version: 1,
      fragments: [PROOF_FRAGMENT_ID],
      lastScreenId: 'prototype-room',
      adventureVisits: 2,
    })).toEqual({
      version: 3,
      fragments: [PROOF_FRAGMENT_ID],
      discoveredContentKeys: [],
      flags: [],
      lastScreenId: START_SCREEN_ID,
      adventureVisits: 2,
    })
  })

  it('migrates version 2 saves and initializes discoveries', () => {
    expect(parseProgress({
      version: 2,
      fragments: [PROOF_FRAGMENT_ID],
      flags: [TUTORIAL_FLAG_ID],
      lastScreenId: 'thales-grove',
      adventureVisits: 1,
    }).discoveredContentKeys).toEqual([])
  })

  it('collects a fragment once and records visits immutably', () => {
    const initial = createInitialProgress()
    const collected = addFragment(initial, PROOF_FRAGMENT_ID)

    expect(collected.fragments).toEqual([PROOF_FRAGMENT_ID])
    expect(addFragment(collected, PROOF_FRAGMENT_ID)).toBe(collected)
    expect(recordAdventureVisit(collected)).toEqual({ ...collected, adventureVisits: 1 })
    expect(initial.fragments).toEqual([])
  })

  it('completes the adventure only after all four journey fragments', () => {
    const initial = createInitialProgress()
    const professional = PROFESSIONAL_FRAGMENT_IDS.reduce(addFragment, initial)
    const completed = addFragment(professional, PERSONAL_FRAGMENT_ID)

    expect(isAdventureComplete(initial)).toBe(false)
    expect(isProfessionalJourneyComplete(initial)).toBe(false)
    expect(isProfessionalJourneyComplete(professional)).toBe(true)
    expect(isAdventureComplete(professional)).toBe(false)
    expect(isAdventureComplete(completed)).toBe(true)
  })

  it('recommends the next missing professional fragment in route order', () => {
    const initial = createInitialProgress()
    const firstCollected = addFragment(initial, PROFESSIONAL_FRAGMENT_IDS[0])
    const professional = PROFESSIONAL_FRAGMENT_IDS.reduce(addFragment, initial)

    expect(getNextProfessionalFragmentId(initial)).toBe(PROFESSIONAL_FRAGMENT_IDS[0])
    expect(getNextProfessionalFragmentId(firstCollected)).toBe(PROFESSIONAL_FRAGMENT_IDS[1])
    expect(getNextProfessionalFragmentId(professional)).toBeUndefined()
  })

  it('stores tutorial completion and the last visited screen idempotently', () => {
    const initial = createInitialProgress()
    const trained = addFlag(initial, TUTORIAL_FLAG_ID)
    const moved = setLastScreen(trained, 'thales-grove')

    expect(trained.flags).toEqual([TUTORIAL_FLAG_ID])
    expect(addFlag(trained, TUTORIAL_FLAG_ID)).toBe(trained)
    expect(moved.lastScreenId).toBe('thales-grove')
    expect(setLastScreen(moved, 'thales-grove')).toBe(moved)
  })

  it('records each discovered content reference once', () => {
    const initial = createInitialProgress()
    const discovered = addDiscovery(initial, 'experience:thales')

    expect(discovered.discoveredContentKeys).toEqual(['experience:thales'])
    expect(addDiscovery(discovered, 'experience:thales')).toBe(discovered)
  })
})
