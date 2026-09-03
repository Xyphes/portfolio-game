import type { KeyboardEvent, PointerEvent } from 'react'
import type { AdventureBridge, Direction } from '../../game/bridge/AdventureBridge'

type TouchControlsProps = {
  bridge: AdventureBridge
  locale: 'fr' | 'en'
}

const directions: Array<{ direction: Direction; glyph: string; className: string }> = [
  { direction: 'up', glyph: '▲', className: 'up' },
  { direction: 'left', glyph: '◀', className: 'left' },
  { direction: 'right', glyph: '▶', className: 'right' },
  { direction: 'down', glyph: '▼', className: 'down' },
]

export function TouchControls({ bridge, locale }: TouchControlsProps) {
  const hold = (direction: Direction, held: boolean) => (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    bridge.setDirection(direction, held)
    if (held) event.currentTarget.setPointerCapture(event.pointerId)
  }

  const holdWithKeyboard = (direction: Direction, held: boolean) => (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    event.stopPropagation()
    if (held && event.repeat) return
    bridge.setDirection(direction, held)
  }

  return (
    <div
      className="touch-controls"
      role="group"
      aria-label={locale === 'fr' ? 'Commandes de jeu' : 'Game controls'}
    >
      <div className="dpad">
        {directions.map(({ direction, glyph, className }) => (
          <button
            type="button"
            key={direction}
            className={className}
            aria-label={directionLabel(direction, locale)}
            aria-keyshortcuts={directionShortcut(direction, locale)}
            onPointerDown={hold(direction, true)}
            onPointerUp={hold(direction, false)}
            onPointerCancel={hold(direction, false)}
            onLostPointerCapture={hold(direction, false)}
            onKeyDown={holdWithKeyboard(direction, true)}
            onKeyUp={holdWithKeyboard(direction, false)}
            onBlur={() => bridge.setDirection(direction, false)}
          >
            {glyph}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="action-button"
        aria-label={locale === 'fr' ? 'Interagir' : 'Interact'}
        aria-keyshortcuts="E Space"
        onPointerDown={(event) => {
          event.preventDefault()
          bridge.queueAction()
        }}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
            event.preventDefault()
            event.stopPropagation()
            bridge.queueAction()
          }
        }}
      >
        <span>A</span>
        <small>{locale === 'fr' ? 'Action' : 'Action'}</small>
      </button>
    </div>
  )
}

function directionShortcut(direction: Direction, locale: 'fr' | 'en'): string {
  const shortcuts = {
    fr: { up: 'ArrowUp Z', down: 'ArrowDown S', left: 'ArrowLeft Q', right: 'ArrowRight D' },
    en: { up: 'ArrowUp W', down: 'ArrowDown S', left: 'ArrowLeft A', right: 'ArrowRight D' },
  }
  return shortcuts[locale][direction]
}

function directionLabel(direction: Direction, locale: 'fr' | 'en'): string {
  const labels = {
    fr: { up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite' },
    en: { up: 'Up', down: 'Down', left: 'Left', right: 'Right' },
  }
  return labels[locale][direction]
}
