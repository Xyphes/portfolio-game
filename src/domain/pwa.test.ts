import { describe, expect, it } from 'vitest'
import { getPwaNoticeKind } from './pwa'

describe('PWA notice priority', () => {
  it('prioritizes connectivity and updates over readiness and installation', () => {
    expect(getPwaNoticeKind({
      online: false,
      needRefresh: true,
      offlineReady: true,
      installAvailable: true,
    })).toBe('offline')
    expect(getPwaNoticeKind({
      online: true,
      needRefresh: true,
      offlineReady: true,
      installAvailable: true,
    })).toBe('update')
    expect(getPwaNoticeKind({
      online: true,
      needRefresh: false,
      offlineReady: false,
      installAvailable: false,
    })).toBeNull()
  })
})
