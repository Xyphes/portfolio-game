import type { Direction } from '../../game/bridge/AdventureBridge'

const DIAGONAL_THRESHOLD = Math.SQRT2 - 1

export function getVirtualJoystickDirections(
  offsetX: number,
  offsetY: number,
  deadZone: number,
): Direction[] {
  if (Math.hypot(offsetX, offsetY) <= deadZone) return []

  const absoluteX = Math.abs(offsetX)
  const absoluteY = Math.abs(offsetY)
  const useHorizontal = absoluteX >= absoluteY * DIAGONAL_THRESHOLD
  const useVertical = absoluteY >= absoluteX * DIAGONAL_THRESHOLD
  const directions: Direction[] = []

  if (useVertical) directions.push(offsetY < 0 ? 'up' : 'down')
  if (useHorizontal) directions.push(offsetX < 0 ? 'left' : 'right')

  return directions
}
