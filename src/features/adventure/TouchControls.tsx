import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { AdventureBridge, Direction } from '../../game/bridge/AdventureBridge'
import { getVirtualJoystickDirections } from './virtualJoystick'

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
  const dpadRef = useRef<HTMLDivElement>(null)
  const activePointerIdRef = useRef<number | null>(null)
  const heldTouchDirectionsRef = useRef(new Set<Direction>())
  const [activeTouchDirections, setActiveTouchDirections] = useState<Direction[]>([])

  const applyTouchDirections = (nextDirections: Direction[]) => {
    const previousDirections = heldTouchDirectionsRef.current
    const nextDirectionSet = new Set(nextDirections)
    const changed = directions.some(({ direction }) =>
      previousDirections.has(direction) !== nextDirectionSet.has(direction))

    if (!changed) return

    for (const { direction } of directions) {
      bridge.setDirection(direction, nextDirectionSet.has(direction))
    }
    heldTouchDirectionsRef.current = nextDirectionSet
    setActiveTouchDirections(nextDirections)
  }

  const updateJoystick = (clientX: number, clientY: number) => {
    const bounds = dpadRef.current?.getBoundingClientRect()
    if (!bounds) return

    const directionsFromPointer = getVirtualJoystickDirections(
      clientX - (bounds.left + bounds.width / 2),
      clientY - (bounds.top + bounds.height / 2),
      Math.min(bounds.width, bounds.height) * 0.12,
    )
    applyTouchDirections(directionsFromPointer)
  }

  const startJoystick = (event: PointerEvent<HTMLButtonElement>) => {
    if (activePointerIdRef.current !== null || !bridge.getRuntimeState().inputEnabled) return
    event.preventDefault()
    activePointerIdRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    updateJoystick(event.clientX, event.clientY)
  }

  const moveJoystick = (event: PointerEvent<HTMLButtonElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return
    event.preventDefault()
    updateJoystick(event.clientX, event.clientY)
  }

  const releaseJoystick = (event: PointerEvent<HTMLButtonElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return
    event.preventDefault()
    activePointerIdRef.current = null
    applyTouchDirections([])
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

  useEffect(() => () => {
    for (const direction of heldTouchDirectionsRef.current) {
      bridge.setDirection(direction, false)
    }
  }, [bridge])

  return (
    <div
      className="touch-controls"
      role="group"
      aria-label={locale === 'fr' ? 'Commandes de jeu' : 'Game controls'}
    >
      <div
        ref={dpadRef}
        className={activeTouchDirections.length > 0 ? 'dpad is-engaged' : 'dpad'}
      >
        {directions.map(({ direction, glyph, className }) => (
          <button
            type="button"
            key={direction}
            className={`${className}${activeTouchDirections.includes(direction) ? ' is-active' : ''}`}
            aria-label={directionLabel(direction, locale)}
            aria-keyshortcuts={directionShortcut(direction, locale)}
            onPointerDown={startJoystick}
            onPointerMove={moveJoystick}
            onPointerUp={releaseJoystick}
            onPointerCancel={releaseJoystick}
            onLostPointerCapture={releaseJoystick}
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
