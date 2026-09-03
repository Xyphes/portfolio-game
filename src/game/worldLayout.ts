import type { AdventureScreen } from '../content/adventure.schema'

export type WorldPoint = readonly [x: number, y: number]
export type WorldObstacle = readonly [x: number, y: number, width: number, height: number]

export const ADVENTURE_VIEWPORT = { width: 480, height: 288 } as const

export const EXIT_OPENING = {
  horizontalMin: 208,
  horizontalMax: 272,
  verticalMin: 112,
  verticalMax: 176,
} as const

const BORDER_CENTER = 8
const BORDER_THICKNESS = 16

export const SCREEN_OBSTACLES = {
  training: [[130, 88, 64, 16], [350, 206, 64, 16]],
  experience: [[166, 138, 48, 16], [314, 138, 48, 16]],
  studies: [[120, 190, 48, 16], [360, 190, 48, 16]],
  projects: [[166, 138, 48, 16], [314, 138, 48, 16]],
  personal: [[240, 140, 64, 16]],
} as const satisfies Record<AdventureScreen['kind'], readonly WorldObstacle[]>

export function getBoundaryObstacles(screen: Pick<AdventureScreen, 'exits'>): WorldObstacle[] {
  const horizontalWalls = (y: number, hasExit: boolean): WorldObstacle[] => hasExit
    ? [
        [EXIT_OPENING.horizontalMin / 2, y, EXIT_OPENING.horizontalMin, BORDER_THICKNESS],
        [
          (EXIT_OPENING.horizontalMax + ADVENTURE_VIEWPORT.width) / 2,
          y,
          ADVENTURE_VIEWPORT.width - EXIT_OPENING.horizontalMax,
          BORDER_THICKNESS,
        ],
      ]
    : [[ADVENTURE_VIEWPORT.width / 2, y, ADVENTURE_VIEWPORT.width, BORDER_THICKNESS]]

  const verticalWalls = (x: number, hasExit: boolean): WorldObstacle[] => hasExit
    ? [
        [x, EXIT_OPENING.verticalMin / 2, BORDER_THICKNESS, EXIT_OPENING.verticalMin],
        [
          x,
          (EXIT_OPENING.verticalMax + ADVENTURE_VIEWPORT.height) / 2,
          BORDER_THICKNESS,
          ADVENTURE_VIEWPORT.height - EXIT_OPENING.verticalMax,
        ],
      ]
    : [[x, ADVENTURE_VIEWPORT.height / 2, BORDER_THICKNESS, ADVENTURE_VIEWPORT.height]]

  return [
    ...horizontalWalls(BORDER_CENTER, Boolean(screen.exits.up)),
    ...horizontalWalls(ADVENTURE_VIEWPORT.height - BORDER_CENTER, Boolean(screen.exits.down)),
    ...verticalWalls(BORDER_CENTER, Boolean(screen.exits.left)),
    ...verticalWalls(ADVENTURE_VIEWPORT.width - BORDER_CENTER, Boolean(screen.exits.right)),
  ]
}

export function isInsideExitOpening(point: { x: number; y: number }, direction: keyof AdventureScreen['exits']) {
  if (direction === 'left' || direction === 'right') {
    return point.y >= EXIT_OPENING.verticalMin && point.y <= EXIT_OPENING.verticalMax
  }
  return point.x >= EXIT_OPENING.horizontalMin && point.x <= EXIT_OPENING.horizontalMax
}

export function getContentPositions(count: number): WorldPoint[] {
  const singleRow: WorldPoint[] = [[120, 124], [240, 124], [360, 124]]
  const doubleRow: WorldPoint[] = [[92, 84], [240, 84], [388, 84], [92, 190], [240, 190], [388, 190]]
  if (count <= 3) return singleRow.slice(0, count)
  if (count === 4) return [[130, 88], [350, 88], [130, 194], [350, 194]]
  return doubleRow.slice(0, count)
}
