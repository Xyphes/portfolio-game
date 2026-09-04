type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: 'landscape') => Promise<void>
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

export function releaseLandscapeOrientation(exitFullscreen: boolean): void {
  const orientation = window.screen.orientation as LockableScreenOrientation | undefined
  orientation?.unlock?.()
  if (exitFullscreen && document.fullscreenElement) void document.exitFullscreen?.()
}
