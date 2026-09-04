type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape' | 'portrait') => Promise<void>
  unlock?: () => void
}

export type LandscapeOrientationResult = {
  status: 'locked' | 'unsupported'
  enteredFullscreen: boolean
}

export async function attemptLandscapeOrientation(
  lock: (() => Promise<void>) | undefined,
  requestFullscreen?: () => Promise<void>,
): Promise<LandscapeOrientationResult> {
  if (!lock) return { status: 'unsupported', enteredFullscreen: false }

  try {
    await lock()
    return { status: 'locked', enteredFullscreen: false }
  } catch {
    if (!requestFullscreen) return { status: 'unsupported', enteredFullscreen: false }
  }

  try {
    await requestFullscreen()
    await lock()
    return { status: 'locked', enteredFullscreen: true }
  } catch {
    return { status: 'unsupported', enteredFullscreen: false }
  }
}

export function requestLandscapeOrientation(): Promise<LandscapeOrientationResult> {
  const orientation = window.screen.orientation as LockableScreenOrientation | undefined
  const lock = orientation?.lock?.bind(orientation, 'landscape')
  const requestFullscreen = !document.fullscreenElement && document.documentElement.requestFullscreen
    ? document.documentElement.requestFullscreen.bind(document.documentElement)
    : undefined

  return attemptLandscapeOrientation(lock, requestFullscreen)
}

export async function attemptFullscreen(
  requestFullscreen: (() => Promise<void>) | undefined,
): Promise<boolean> {
  if (!requestFullscreen) return false
  try {
    await requestFullscreen()
    return true
  } catch {
    return false
  }
}

export function requestAdventureFullscreen(): Promise<boolean> {
  if (document.fullscreenElement) return Promise.resolve(false)
  const requestFullscreen = document.documentElement.requestFullscreen
    ? document.documentElement.requestFullscreen.bind(document.documentElement)
    : undefined
  return attemptFullscreen(requestFullscreen)
}

export async function attemptPortraitRestore(
  unlock: (() => void) | undefined,
  lockPortrait: (() => Promise<void>) | undefined,
  exitFullscreen: (() => Promise<void>) | undefined,
): Promise<void> {
  unlock?.()
  try {
    await lockPortrait?.()
  } catch {
    // Orientation restoration is best-effort across browsers.
  }
  try {
    await exitFullscreen?.()
  } catch {
    // A browser can already have left fullscreen during navigation.
  }
}

export function restorePortraitOrientation(exitFullscreen: boolean): Promise<void> {
  const orientation = window.screen.orientation as LockableScreenOrientation | undefined
  const unlock = orientation?.unlock?.bind(orientation)
  const lockPortrait = orientation?.lock?.bind(orientation, 'portrait')
  const exit = exitFullscreen && document.fullscreenElement && document.exitFullscreen
    ? document.exitFullscreen.bind(document)
    : undefined
  return attemptPortraitRestore(unlock, lockPortrait, exit)
}
