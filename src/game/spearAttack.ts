import type { AdventureDirection } from '../content/adventure.schema'

export type Rectangle = {
  x: number
  y: number
  width: number
  height: number
}

export type SpearAttackGeometry = {
  hitbox: Rectangle
  start: { x: number; y: number }
  end: { x: number; y: number }
  angle: number
}

const SPEAR_DISTANCE = 18
const SPEAR_START_DISTANCE = 7
const SPEAR_HITBOX_LENGTH = 28
const SPEAR_HITBOX_THICKNESS = 10

const directionVectors: Record<AdventureDirection, { x: number; y: number; angle: number }> = {
  up: { x: 0, y: -1, angle: 0 },
  down: { x: 0, y: 1, angle: 180 },
  left: { x: -1, y: 0, angle: -90 },
  right: { x: 1, y: 0, angle: 90 },
}

export function getSpearAttackGeometry(
  origin: { x: number; y: number },
  direction: AdventureDirection,
): SpearAttackGeometry {
  const vector = directionVectors[direction]
  const horizontal = vector.x !== 0
  const width = horizontal ? SPEAR_HITBOX_LENGTH : SPEAR_HITBOX_THICKNESS
  const height = horizontal ? SPEAR_HITBOX_THICKNESS : SPEAR_HITBOX_LENGTH
  const centerX = origin.x + vector.x * SPEAR_DISTANCE
  const centerY = origin.y + vector.y * SPEAR_DISTANCE

  return {
    hitbox: {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    },
    start: {
      x: origin.x + vector.x * SPEAR_START_DISTANCE,
      y: origin.y + vector.y * SPEAR_START_DISTANCE,
    },
    end: { x: centerX, y: centerY },
    angle: vector.angle,
  }
}

export function rectanglesOverlap(left: Rectangle, right: Rectangle) {
  return left.x < right.x + right.width
    && left.x + left.width > right.x
    && left.y < right.y + right.height
    && left.y + left.height > right.y
}
