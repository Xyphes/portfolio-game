export type KonamiDirection = 'up' | 'down' | 'left' | 'right'

export const konamiDirectionSequence: readonly KonamiDirection[] = [
  'up',
  'up',
  'down',
  'down',
  'left',
  'right',
  'left',
  'right',
] as const

export const konamiRedirectUrl = 'https://www.youtube.com/watch?v=xvFZjo5PgG0'

const directionByInput: Readonly<Record<string, KonamiDirection>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
}

export function advanceKonamiSequence(progress: number, input: string) {
  const direction = directionByInput[input.length === 1 ? input.toLowerCase() : input]
  if (direction === konamiDirectionSequence[progress]) {
    return progress + 1
  }

  return direction === konamiDirectionSequence[0] ? 1 : 0
}
