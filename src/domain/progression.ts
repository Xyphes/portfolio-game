import { z } from 'zod'

export const PROGRESS_VERSION = 3 as const
export const PROOF_FRAGMENT_ID = 'thales-rigor'
export const PROFESSIONAL_FRAGMENT_IDS = [
  PROOF_FRAGMENT_ID,
  'learning-curiosity',
  'builder-craft',
] as const
export const PERSONAL_FRAGMENT_ID = 'personal-balance'
export const ADVENTURE_FRAGMENT_IDS = [
  ...PROFESSIONAL_FRAGMENT_IDS,
  PERSONAL_FRAGMENT_ID,
] as const
export const TUTORIAL_FLAG_ID = 'tutorial-combat-complete'
export const START_SCREEN_ID = 'training-clearing'

export const progressSchema = z.object({
  version: z.literal(PROGRESS_VERSION),
  fragments: z.array(z.string()).default([]),
  discoveredContentKeys: z.array(z.string()).default([]),
  flags: z.array(z.string()).default([]),
  lastScreenId: z.string().default(START_SCREEN_ID),
  adventureVisits: z.number().int().nonnegative().default(0),
})

const versionTwoProgressSchema = z.object({
  version: z.literal(2),
  fragments: z.array(z.string()).default([]),
  flags: z.array(z.string()).default([]),
  lastScreenId: z.string().default(START_SCREEN_ID),
  adventureVisits: z.number().int().nonnegative().default(0),
})

const versionOneProgressSchema = z.object({
  version: z.literal(1),
  fragments: z.array(z.string()).default([]),
  lastScreenId: z.string().default('prototype-room'),
  adventureVisits: z.number().int().nonnegative().default(0),
})

export type ProgressState = z.infer<typeof progressSchema>

export function createInitialProgress(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    fragments: [],
    discoveredContentKeys: [],
    flags: [],
    lastScreenId: START_SCREEN_ID,
    adventureVisits: 0,
  }
}

export function parseProgress(candidate: unknown): ProgressState {
  const parsed = progressSchema.safeParse(candidate)
  if (parsed.success) return parsed.data

  const versionTwo = versionTwoProgressSchema.safeParse(candidate)
  if (versionTwo.success) {
    return {
      ...versionTwo.data,
      version: PROGRESS_VERSION,
      discoveredContentKeys: [],
    }
  }

  const versionOne = versionOneProgressSchema.safeParse(candidate)
  if (versionOne.success) {
    return {
      version: PROGRESS_VERSION,
      fragments: versionOne.data.fragments,
      discoveredContentKeys: [],
      flags: [],
      lastScreenId: versionOne.data.lastScreenId === 'prototype-room'
        ? START_SCREEN_ID
        : versionOne.data.lastScreenId,
      adventureVisits: versionOne.data.adventureVisits,
    }
  }

  return createInitialProgress()
}

export function addDiscovery(progress: ProgressState, contentKey: string): ProgressState {
  if (progress.discoveredContentKeys.includes(contentKey)) return progress
  return {
    ...progress,
    discoveredContentKeys: [...progress.discoveredContentKeys, contentKey],
  }
}

export function addFragment(
  progress: ProgressState,
  fragmentId: string,
): ProgressState {
  if (progress.fragments.includes(fragmentId)) {
    return progress
  }

  return {
    ...progress,
    fragments: [...progress.fragments, fragmentId],
  }
}

export function isAdventureComplete(progress: ProgressState): boolean {
  return ADVENTURE_FRAGMENT_IDS.every((fragmentId) =>
    progress.fragments.includes(fragmentId))
}

export function isProfessionalJourneyComplete(progress: ProgressState): boolean {
  return PROFESSIONAL_FRAGMENT_IDS.every((fragmentId) =>
    progress.fragments.includes(fragmentId))
}

export function getNextProfessionalFragmentId(progress: ProgressState): string | undefined {
  return PROFESSIONAL_FRAGMENT_IDS.find((fragmentId) =>
    !progress.fragments.includes(fragmentId))
}

export function addFlag(progress: ProgressState, flagId: string): ProgressState {
  if (progress.flags.includes(flagId)) return progress

  return {
    ...progress,
    flags: [...progress.flags, flagId],
  }
}

export function setLastScreen(
  progress: ProgressState,
  screenId: string,
): ProgressState {
  if (progress.lastScreenId === screenId) return progress
  return { ...progress, lastScreenId: screenId }
}

export function recordAdventureVisit(progress: ProgressState): ProgressState {
  return {
    ...progress,
    adventureVisits: progress.adventureVisits + 1,
  }
}
