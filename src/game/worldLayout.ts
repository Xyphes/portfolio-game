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
  training: [],
  experience: [[166, 138, 48, 16], [314, 138, 48, 16]],
  studies: [[360, 190, 48, 16]],
  projects: [],
  personal: [],
} as const satisfies Record<AdventureScreen['kind'], readonly WorldObstacle[]>

// Additional hedge depth in the first clearing. Every rectangle is rendered as
// 16 px bush tiles and receives the same-size static collision in Phaser.
export const TRAINING_HEDGE_CLUSTERS: readonly WorldObstacle[] = [
  [48, 24, 64, 16], [152, 24, 64, 16], [328, 24, 80, 16], [432, 24, 64, 16],
  [32, 40, 32, 16], [152, 40, 32, 16], [440, 40, 32, 16],
  [32, 72, 32, 48], [456, 72, 16, 48],
  [32, 232, 32, 48], [456, 232, 16, 48],
  [48, 264, 64, 16], [152, 264, 64, 16],
  [328, 264, 80, 16], [432, 264, 64, 16],
]

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
  const sevenItemGrid: WorldPoint[] = [[80, 80], [186, 80], [294, 80], [400, 80], [120, 206], [240, 206], [360, 206]]
  if (count <= 3) return singleRow.slice(0, count)
  if (count === 4) return [[130, 88], [350, 88], [130, 194], [350, 194]]
  if (count === 7) return sevenItemGrid
  return doubleRow.slice(0, count)
}
