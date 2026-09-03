import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Locale } from '../../content/portfolio.schema'
import { createAdventureGame } from '../../game/createAdventureGame'
import type { AdventureBridge } from '../../game/bridge/AdventureBridge'
import { useReducedMotion } from '../../shared/useReducedMotion'
import { AdventureCanvasOverlay, type FragmentVisualState } from './AdventureCanvasOverlay'

type PhaserHostProps = {
  bridge: AdventureBridge
  locale: Locale
  screenId: string
  tutorialCompleted: boolean
  fragmentState?: FragmentVisualState
}

export function PhaserHost({
  bridge,
  locale,
  screenId,
  tutorialCompleted,
  fragmentState,
}: PhaserHostProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const retryButtonRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const copy = locale === 'fr'
    ? {
        loading: 'Chargement du monde…',
        title: 'Le monde ne peut pas être chargé',
        body: 'Vérifiez votre connexion, puis réessayez. Le portfolio classique reste disponible immédiatement.',
        retry: 'Réessayer',
        classic: 'Ouvrir le mode classique',
        world: 'Monde aventure en écrans fixes. Déplacez le héros, approchez les personnages et utilisez le bouton action.',
      }
    : {
        loading: 'Loading the world…',
        title: 'The world could not be loaded',
        body: 'Check your connection, then try again. The classic portfolio remains immediately available.',
        retry: 'Try again',
        classic: 'Open classic mode',
        world: 'Fixed-screen adventure world. Move the hero, approach characters, and use the action button.',
      }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let cancelled = false
    let game: Awaited<ReturnType<typeof createAdventureGame>> | undefined

    void createAdventureGame({ parent: host, bridge, locale, reducedMotion })
      .then((createdGame) => {
        if (cancelled) createdGame.destroy(true)
        else {
          game = createdGame
          setStatus('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      game?.destroy(true)
      host.replaceChildren()
    }
  }, [attempt, bridge, locale, reducedMotion])

  useEffect(() => {
    if (status === 'error') retryButtonRef.current?.focus()
  }, [status])

  const retry = () => {
    setStatus('loading')
    setAttempt((current) => current + 1)
  }

  return (
    <div className={`game-runtime is-${status}`}>
      <div ref={hostRef} className="phaser-host" role="img" aria-label={copy.world} />
      <AdventureCanvasOverlay
        locale={locale}
        screenId={screenId}
        tutorialCompleted={tutorialCompleted}
        fragmentState={fragmentState}
      />
      {status === 'loading' && (
        <div className="game-runtime-status" role="status">
          <span className="loading-rune" aria-hidden="true">◆</span>
          <span>{copy.loading}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="game-runtime-error" role="alert">
          <p className="mode-kicker">Offline / Phaser</p>
          <h2>{copy.title}</h2>
          <p>{copy.body}</p>
          <div className="game-runtime-actions">
            <button ref={retryButtonRef} type="button" className="primary-link" onClick={retry}>
              {copy.retry}
            </button>
            <Link className="ghost-button" to={`/${locale}/classic`}>{copy.classic}</Link>
          </div>
        </div>
      )}
    </div>
  )
}
