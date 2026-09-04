import { describe, expect, it, vi } from 'vitest'
import { attemptLandscapeOrientation } from './orientation'

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
})
