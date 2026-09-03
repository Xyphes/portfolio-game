import { describe, expect, it } from 'vitest'
import { createDefaultAudioPreferences, parseAudioPreferences } from './audioPreferences'

describe('audio preferences', () => {
  it('accepts valid persisted preferences', () => {
    expect(parseAudioPreferences({ version: 1, volume: 0.6, muted: true })).toEqual({
      version: 1,
      volume: 0.6,
      muted: true,
    })
  })

  it('falls back safely for corrupt or out-of-range values', () => {
    expect(parseAudioPreferences({ version: 1, volume: 2, muted: false })).toEqual(
      createDefaultAudioPreferences(),
    )
    expect(parseAudioPreferences('corrupt', 0.2).volume).toBe(0.2)
  })
})
