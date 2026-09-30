export type Point = { x: number; y: number }

export function getKnockbackVelocity(
  player: Point,
  enemy: Point,
  speed: number,
  fallbackDirection: Point,
): Point {
  let x = player.x - enemy.x
  let y = player.y - enemy.y
  let magnitude = Math.hypot(x, y)

  if (magnitude < 0.001) {
    x = fallbackDirection.x
    y = fallbackDirection.y
    magnitude = Math.hypot(x, y) || 1
  }

  return {
    x: x / magnitude * speed,
    y: y / magnitude * speed,
  }
}
