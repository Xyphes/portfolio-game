// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'matchMedia')
  })

  it('tracks system preference changes and releases its listener', () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined
    const mediaQuery = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((_type: string, handler: (event: MediaQueryListEvent) => void) => {
        listener = handler
      }),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => mediaQuery),
    })

    const { result, unmount } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    act(() => listener?.({ matches: true } as MediaQueryListEvent))
    expect(result.current).toBe(true)

    unmount()
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', listener)
  })
})
