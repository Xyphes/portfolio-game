import {
  createInitialProgress,
  parseProgress,
  type ProgressState,
} from '../domain/progression'

const STORAGE_KEY = 'portfolio-game:progress'

export interface ProgressRepository {
  load(): ProgressState
  save(progress: ProgressState): void
  reset(): ProgressState
}

export function createBrowserProgressRepository(): ProgressRepository {
  return {
    load() {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        return stored ? parseProgress(JSON.parse(stored)) : createInitialProgress()
      } catch {
        return createInitialProgress()
      }
    },
    save(progress) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      } catch {
        // Storage can be unavailable in private or restricted contexts.
      }
    },
    reset() {
      const initial = createInitialProgress()
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        // A reset still succeeds in memory when storage is unavailable.
      }
      return initial
    },
  }
}

