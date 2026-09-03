import {
  createDefaultAudioPreferences,
  parseAudioPreferences,
  type AudioPreferences,
} from '../domain/audioPreferences'

const STORAGE_KEY = 'portfolio-game:audio-preferences'

export function loadAudioPreferences(defaultVolume: number): AudioPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored
      ? parseAudioPreferences(JSON.parse(stored), defaultVolume)
      : createDefaultAudioPreferences(defaultVolume)
  } catch {
    return createDefaultAudioPreferences(defaultVolume)
  }
}

export function saveAudioPreferences(preferences: AudioPreferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // Audio remains usable for the current session when storage is unavailable.
  }
}
