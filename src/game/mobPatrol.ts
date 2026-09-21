export type PatrolDirection = 1 | -1

export function nextPatrolDirection(
  position: number,
  origin: number,
  range: number,
  direction: PatrolDirection,
  blockedAhead: boolean,
): PatrolDirection {
  if (blockedAhead) return direction === 1 ? -1 : 1
  if (direction === 1 && position >= origin + range) return -1
  if (direction === -1 && position <= origin - range) return 1
  return direction
}
