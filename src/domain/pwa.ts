export type PwaNoticeKind = 'offline' | 'update' | 'offline-ready' | 'install'

type PwaNoticeState = {
  online: boolean
  needRefresh: boolean
  offlineReady: boolean
  installAvailable: boolean
}

export function getPwaNoticeKind(state: PwaNoticeState): PwaNoticeKind | null {
  if (!state.online) return 'offline'
  if (state.needRefresh) return 'update'
  if (state.offlineReady) return 'offline-ready'
  if (state.installAvailable) return 'install'
  return null
}
