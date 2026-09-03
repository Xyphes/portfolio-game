import { adventureWorld, getAdventureScreen } from '../../content/adventure.data'
import type { Locale } from '../../content/portfolio.schema'
import { getContentDetail, localize } from '../../content/selectors'
import { ADVENTURE_VIEWPORT, getContentPositions } from '../../game/worldLayout'

export type FragmentVisualState = 'locked' | 'ready' | 'collected'

type AdventureCanvasOverlayProps = {
  locale: Locale
  screenId: string
  tutorialCompleted: boolean
  fragmentState?: FragmentVisualState
}

export function AdventureCanvasOverlay({
  locale,
  screenId,
  tutorialCompleted,
  fragmentState,
}: AdventureCanvasOverlayProps) {
  const screen = getAdventureScreen(screenId)
  const positions = getContentPositions(screen.contentRefs.length)
  const fragmentCopy = fragmentState
    ? localize(adventureWorld.canvasCopy[
        fragmentState === 'collected'
          ? 'fragmentCollected'
          : fragmentState === 'ready'
            ? 'fragmentReady'
            : 'fragmentLocked'
      ], locale)
    : undefined

  return (
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

      {fragmentCopy && (
        <div className={`canvas-fragment-copy is-${fragmentState}`}>{fragmentCopy}</div>
      )}

      {screen.contentStatus === 'awaiting-user-content' && (
        <div className="canvas-awaiting-copy">{localize(screen.hint, locale)}</div>
      )}
    </div>
  )
}
