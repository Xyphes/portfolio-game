import { describe, expect, it, vi } from 'vitest'
import {
  attemptFullscreen,
  attemptLandscapeOrientation,
  attemptPortraitRestore,
} from './orientation'

describe('attemptLandscapeOrientation', () => {
  it('locks directly when the browser permits it', async () => {
    const lock = vi.fn().mockResolvedValue(undefined)

    await expect(attemptLandscapeOrientation(lock)).resolves.toEqual({
      status: 'locked',
      enteredFullscreen: false,
    })
    expect(lock).toHaveBeenCalledOnce()
  })

  it('enters fullscreen and retries when the first lock is rejected', async () => {
    const lock = vi.fn()
      .mockRejectedValueOnce(new DOMException('Fullscreen required', 'SecurityError'))
      .mockResolvedValueOnce(undefined)
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)

    await expect(attemptLandscapeOrientation(lock, requestFullscreen)).resolves.toEqual({
      status: 'locked',
      enteredFullscreen: true,
    })
    expect(requestFullscreen).toHaveBeenCalledOnce()
    expect(lock).toHaveBeenCalledTimes(2)
  })

  it('reports unsupported browsers without throwing', async () => {
    await expect(attemptLandscapeOrientation(undefined)).resolves.toEqual({
      status: 'unsupported',
      enteredFullscreen: false,
    })
  })

  it('handles automatic fullscreen acceptance and rejection without throwing', async () => {
    await expect(attemptFullscreen(vi.fn().mockResolvedValue(undefined))).resolves.toBe(true)
    await expect(attemptFullscreen(
      vi.fn().mockRejectedValue(new DOMException('Activation required', 'NotAllowedError')),
    )).resolves.toBe(false)
    await expect(attemptFullscreen(undefined)).resolves.toBe(false)
  })

  it('restores portrait before leaving fullscreen on adventure exit', async () => {
    const calls: string[] = []
    await attemptPortraitRestore(
      () => calls.push('unlock'),
      async () => { calls.push('portrait') },
      async () => { calls.push('exit-fullscreen') },
    )

    expect(calls).toEqual(['unlock', 'portrait', 'exit-fullscreen'])
  })

  it('still exits fullscreen when portrait locking is rejected', async () => {
    const exitFullscreen = vi.fn().mockResolvedValue(undefined)
    await expect(attemptPortraitRestore(
      vi.fn(),
      vi.fn().mockRejectedValue(new DOMException('Unsupported', 'NotSupportedError')),
      exitFullscreen,
    )).resolves.toBeUndefined()

    expect(exitFullscreen).toHaveBeenCalledOnce()
  })
})
