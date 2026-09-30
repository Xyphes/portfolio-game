export const arrowKonamiSequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
] as const

export const konamiRedirectUrl = 'https://www.youtube.com/watch?v=xvFZjo5PgG0'

export function advanceArrowKonamiSequence(progress: number, key: string) {
  if (key === arrowKonamiSequence[progress]) {
    return progress + 1
  }

  return key === arrowKonamiSequence[0] ? 1 : 0
}
