// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { addFragment, createInitialProgress, PROOF_FRAGMENT_ID } from '../domain/progression'
import { createBrowserProgressRepository } from './progressRepository'

describe('browser progress repository', () => {
  beforeEach(() => window.localStorage.clear())

  it('resets only adventure progress and preserves unrelated preferences', () => {
    const repository = createBrowserProgressRepository()
    const progressed = addFragment(createInitialProgress(), PROOF_FRAGMENT_ID)
    window.localStorage.setItem('portfolio-game:audio-preferences', 'keep-audio')
    repository.save(progressed)

    expect(repository.load().fragments).toEqual([PROOF_FRAGMENT_ID])
    expect(repository.reset()).toEqual(createInitialProgress())
    expect(repository.load()).toEqual(createInitialProgress())
    expect(window.localStorage.getItem('portfolio-game:audio-preferences')).toBe('keep-audio')
  })
})
