import { z } from 'zod'

export const AUDIO_PREFERENCES_VERSION = 1 as const

const audioPreferencesSchema = z.object({
  version: z.literal(AUDIO_PREFERENCES_VERSION),
  volume: z.number().min(0).max(1),
  muted: z.boolean(),
})

export type AudioPreferences = z.infer<typeof audioPreferencesSchema>

export function createDefaultAudioPreferences(volume = 0.35): AudioPreferences {
  return { version: AUDIO_PREFERENCES_VERSION, volume, muted: false }
}

export function parseAudioPreferences(candidate: unknown, defaultVolume = 0.35): AudioPreferences {
  const parsed = audioPreferencesSchema.safeParse(candidate)
  return parsed.success ? parsed.data : createDefaultAudioPreferences(defaultVolume)
}
