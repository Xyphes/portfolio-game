import { useEffect, useRef } from 'react'
import { adventureWorld, getAdventureScreen } from '../../content/adventure.data'
import type { Locale } from '../../content/portfolio.schema'
import { getContentDetail, localize } from '../../content/selectors'
import { ADVENTURE_VIEWPORT, getContentPositions } from '../../game/worldLayout'
import type { AdventureBridge } from '../../game/bridge/AdventureBridge'

type AdventureCanvasOverlayProps = {
  bridge: AdventureBridge
  locale: Locale
  screenId: string
  tutorialCompleted: boolean
}

export function AdventureCanvasOverlay({
  bridge,
  locale,
  screenId,
  tutorialCompleted,
}: AdventureCanvasOverlayProps) {
  const playerVisualRef = useRef<HTMLDivElement>(null)
  const screen = getAdventureScreen(screenId)
  const positions = getContentPositions(screen.contentRefs.length)

  useEffect(() => bridge.onPlayerVisual(({ x, y, frame, visible }) => {
    const playerVisual = playerVisualRef.current
    if (!playerVisual) return
    const column = frame % 4
    const row = Math.floor(frame / 4)
    playerVisual.style.left = `${x / ADVENTURE_VIEWPORT.width * 100}%`
    playerVisual.style.top = `${y / ADVENTURE_VIEWPORT.height * 100}%`
    playerVisual.style.backgroundPosition = `${column / 3 * 100}% ${row / 6 * 100}%`
    playerVisual.hidden = !visible
  }), [bridge])

  return (
    <>
      <div className="canvas-copy-layer" aria-hidden="true">
        <div className="canvas-zone-title">{localize(screen.name, locale)}</div>
        <div className="canvas-action-hint">{localize(adventureWorld.canvasCopy.action, locale)}</div>

        {screen.contentStatus === 'ready' && screen.contentRefs.map((reference, index) => {
          const [x, y] = positions[index]!
          return (
            <div
              key={`${reference.kind}:${reference.id}`}
              className="canvas-object-label"
              style={{
                left: `${x / ADVENTURE_VIEWPORT.width * 100}%`,
                top: `${(y + 16) / ADVENTURE_VIEWPORT.height * 100}%`,
              }}
            >
              {getContentDetail(reference, locale).title}
            </div>
          )
        })}

        {screen.kind === 'training' && (
          <div className={tutorialCompleted ? 'canvas-training-copy is-complete' : 'canvas-training-copy'}>
            {localize(
              tutorialCompleted
                ? adventureWorld.canvasCopy.tutorialComplete
                : adventureWorld.canvasCopy.tutorialEnemy,
              locale,
            )}
          </div>
        )}

        {screen.contentStatus === 'awaiting-user-content' && (
          <div className="canvas-awaiting-copy">{localize(screen.hint, locale)}</div>
        )}
      </div>
      <div ref={playerVisualRef} className="canvas-player-visual" aria-hidden="true" />
    </>
  )
}
