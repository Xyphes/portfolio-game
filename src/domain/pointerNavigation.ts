export type Point2D = { x: number; y: number }

export type PointerMovement = {
  reached: boolean
  velocityX: number
  velocityY: number
}

export function getPointerMovement(
  origin: Point2D,
  target: Point2D,
  speed: number,
  arrivalDistance = 4,
): PointerMovement {
  const offsetX = target.x - origin.x
  const offsetY = target.y - origin.y
  const distance = Math.hypot(offsetX, offsetY)

  if (distance <= arrivalDistance || distance === 0) {
    return { reached: true, velocityX: 0, velocityY: 0 }
  }

  return {
    reached: false,
    velocityX: offsetX / distance * speed,
    velocityY: offsetY / distance * speed,
  }
}
