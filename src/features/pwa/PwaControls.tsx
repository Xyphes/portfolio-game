import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { getPwaNoticeKind } from '../../domain/pwa'
import { useLanguage } from '../../shared/language'

type InstallChoice = {
  outcome: 'accepted' | 'dismissed'
  platform: string
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<InstallChoice>
}

const INSTALL_DISMISSED_KEY = 'portfolio-game:install-dismissed'

function wasInstallDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(INSTALL_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

const copy = {
  fr: {
    installReady: 'Installer ce portfolio sur cet appareil.',
    install: 'Installer',
    updateReady: 'Une nouvelle version est disponible.',
    update: 'Mettre à jour',
    offlineReady: 'Le mode classique et les documents sont prêts hors ligne. L’aventure est mémorisée après sa première visite.',
    offline: 'Vous êtes hors ligne. La version enregistrée reste disponible.',
    dismiss: 'Masquer',
    dismissInstall: 'Ne pas installer pour le moment',
  },
  en: {
    installReady: 'Install this portfolio on this device.',
    install: 'Install',
    updateReady: 'A new version is available.',
    update: 'Update',
    offlineReady: 'Classic mode and documents are ready offline. The adventure is saved after its first visit.',
    offline: 'You are offline. The saved version remains available.',
    dismiss: 'Dismiss',
    dismissInstall: 'Do not install for now',
  },
} as const

export function PwaControls() {
  const { locale } = useLanguage()
  const text = copy[locale]
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installDismissed, setInstallDismissed] = useState(wasInstallDismissed)
  const [online, setOnline] = useState(() => navigator.onLine)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const clearInstallPrompt = () => setInstallPrompt(null)
    const markOnline = () => setOnline(true)
    const markOffline = () => setOnline(false)

    window.addEventListener('beforeinstallprompt', captureInstallPrompt)
    window.addEventListener('appinstalled', clearInstallPrompt)
    window.addEventListener('online', markOnline)
    window.addEventListener('offline', markOffline)
    return () => {
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt)
      window.removeEventListener('appinstalled', clearInstallPrompt)
      window.removeEventListener('online', markOnline)
      window.removeEventListener('offline', markOffline)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  const dismissInstall = () => {
    setInstallDismissed(true)
    try {
      window.sessionStorage.setItem(INSTALL_DISMISSED_KEY, '1')
    } catch {
      // State still hides the optional prompt when storage is unavailable.
    }
  }

  const noticeKind = getPwaNoticeKind({
    online,
    needRefresh,
    offlineReady,
    installAvailable: Boolean(installPrompt) && !installDismissed,
  })
  const messages = {
    offline: text.offline,
    update: text.updateReady,
    'offline-ready': text.offlineReady,
    install: text.installReady,
  }
  const message = noticeKind ? messages[noticeKind] : null

  if (!message) return null

  return (
    <aside className="pwa-controls" aria-live="polite" aria-atomic="true">
      <span className={online ? 'pwa-indicator' : 'pwa-indicator is-offline'} aria-hidden="true" />
      <p>{message}</p>
      <div className="pwa-actions">
        {online && needRefresh && (
          <button type="button" onClick={() => void updateServiceWorker(true)}>
            {text.update}
          </button>
        )}
        {online && !needRefresh && installPrompt && (
          <button type="button" onClick={() => void install()}>
            {text.install}
          </button>
        )}
        {noticeKind === 'install' && (
          <button
            type="button"
            className="pwa-close"
            aria-label={text.dismissInstall}
            title={text.dismissInstall}
            onClick={dismissInstall}
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
        {online && (needRefresh || offlineReady) && (
          <button
            type="button"
            className="pwa-dismiss"
            onClick={() => {
              setOfflineReady(false)
              setNeedRefresh(false)
            }}
          >
            {text.dismiss}
          </button>
        )}
      </div>
    </aside>
  )
}
