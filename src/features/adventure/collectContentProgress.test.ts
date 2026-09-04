import { describe, expect, it } from 'vitest'
import { createInitialProgress } from '../../domain/progression'
import { collectContentProgress } from './collectContentProgress'

describe('collectContentProgress', () => {
  it('awards the area fragment with the first content discovery', () => {
    const progress = collectContentProgress(
      createInitialProgress(),
      { kind: 'experience', id: 'thales' },
    )

    expect(progress.discoveredContentKeys).toContain('experience:thales')
    expect(progress.fragments).toContain('thales-rigor')
  })

  it('keeps discovery and fragment collection idempotent', () => {
    const initial = createInitialProgress()
    const first = collectContentProgress(initial, { kind: 'education', id: 'epita' })
    const second = collectContentProgress(first, { kind: 'education', id: 'epita' })

    expect(second).toBe(first)
    expect(second.fragments).toEqual(['learning-curiosity'])
  })
})
