import type { AdventureScreen } from '../content/adventure.schema'

export type DecorationAtlas = 'nature' | 'village' | 'elements' | 'camp'

export type DecorationDefinition = {
  atlas: DecorationAtlas
  frame: readonly [x: number, y: number, width: number, height: number]
  body?: readonly [width: number, height: number, offsetX: number, offsetY: number]
}

export const DECORATION_DEFINITIONS = {
  'nature-tree': { atlas: 'nature', frame: [0, 0, 32, 32], body: [20, 11, 6, 19] },
  'nature-pine': { atlas: 'nature', frame: [32, 0, 32, 32], body: [20, 11, 6, 19] },
  'nature-dead-tree': { atlas: 'nature', frame: [64, 0, 32, 32], body: [20, 12, 6, 18] },
  'nature-round-tree': { atlas: 'nature', frame: [96, 0, 32, 32], body: [20, 11, 6, 19] },
  'nature-autumn-tree': { atlas: 'nature', frame: [224, 0, 32, 32], body: [20, 11, 6, 19] },
  'nature-tree-pair': { atlas: 'nature', frame: [64, 32, 64, 32], body: [50, 11, 7, 19] },
  'nature-canopy': { atlas: 'nature', frame: [256, 32, 96, 32], body: [78, 11, 9, 19] },
  'nature-stump': { atlas: 'nature', frame: [0, 128, 32, 32], body: [24, 12, 4, 18] },
  'nature-rocks': { atlas: 'nature', frame: [240, 160, 32, 32], body: [24, 16, 4, 14] },
  'nature-boulder': { atlas: 'nature', frame: [272, 160, 64, 32], body: [52, 18, 6, 12] },
  'nature-gray-rock': { atlas: 'nature', frame: [240, 224, 32, 32], body: [24, 16, 4, 14] },
  'nature-flower-yellow': { atlas: 'nature', frame: [0, 176, 16, 16] },
  'nature-flower-red': { atlas: 'nature', frame: [48, 176, 16, 16] },
  'nature-flower-white': { atlas: 'nature', frame: [96, 176, 16, 16] },
  'nature-grass-tuft': { atlas: 'nature', frame: [0, 160, 16, 16] },
  'nature-small-bush': { atlas: 'nature', frame: [96, 160, 16, 16], body: [12, 7, 2, 8] },
  'ruin-entrance': { atlas: 'village', frame: [0, 0, 64, 48], body: [52, 24, 6, 24] },
  'ruin-workshop': { atlas: 'village', frame: [64, 0, 64, 48], body: [52, 24, 6, 24] },
  'ruin-archive': { atlas: 'village', frame: [128, 0, 64, 48], body: [52, 24, 6, 24] },
  'workshop-library': { atlas: 'elements', frame: [128, 128, 32, 16], body: [28, 8, 2, 8] },
  'workshop-empty-shelf': { atlas: 'elements', frame: [160, 128, 32, 16], body: [28, 8, 2, 8] },
  'workshop-drawers': { atlas: 'elements', frame: [96, 128, 32, 16], body: [28, 8, 2, 8] },
  'workshop-bench': { atlas: 'elements', frame: [32, 160, 40, 16], body: [36, 8, 2, 8] },
  'camp-tent': { atlas: 'camp', frame: [64, 0, 48, 48], body: [40, 16, 4, 30] },
  'campfire': { atlas: 'camp', frame: [160, 48, 32, 32], body: [20, 16, 6, 14] },
  'camp-log': { atlas: 'camp', frame: [0, 128, 48, 16], body: [42, 10, 3, 6] },
  'camp-barrel': { atlas: 'camp', frame: [64, 96, 32, 32], body: [24, 14, 4, 18] },
  'camp-pack': { atlas: 'camp', frame: [96, 128, 32, 16] },
} as const satisfies Record<string, DecorationDefinition>

export type DecorationTexture = keyof typeof DECORATION_DEFINITIONS
export type MonsterTexture = 'monster-slime' | 'monster-bat' | 'monster-mushroom'

export type ScreenDecoration = {
  x: number
  y: number
  texture: DecorationTexture
  collision: 'solid' | 'layout' | 'none'
  alpha?: number
  flipX?: boolean
}

export type MobSpawn = {
  x: number
  y: number
  axis: 'horizontal' | 'vertical'
  range: number
  speed: number
  texture: MonsterTexture
}

// Each room has its own visual language. `layout` props sit on the authored
// world obstacles, so their visible silhouette and collision always agree.
export const SCREEN_DECORATIONS = {
  training: [
    { x: 176, y: 96, texture: 'nature-small-bush', collision: 'solid' },
    { x: 176, y: 144, texture: 'nature-small-bush', collision: 'solid' },
  ],
  experience: [
    { x: 166, y: 138, texture: 'nature-tree-pair', collision: 'layout' },
    { x: 314, y: 138, texture: 'nature-boulder', collision: 'layout' },
    { x: 70, y: 216, texture: 'nature-canopy', collision: 'solid' },
    { x: 432, y: 228, texture: 'nature-autumn-tree', collision: 'solid' },
    { x: 44, y: 68, texture: 'nature-round-tree', collision: 'solid' },
    { x: 228, y: 234, texture: 'nature-flower-white', collision: 'none' },
    { x: 276, y: 58, texture: 'nature-grass-tuft', collision: 'none' },
  ],
  studies: [
    { x: 120, y: 190, texture: 'nature-rocks', collision: 'solid' },
    { x: 360, y: 190, texture: 'ruin-entrance', collision: 'layout' },
    { x: 424, y: 226, texture: 'ruin-archive', collision: 'solid' },
    { x: 48, y: 226, texture: 'nature-dead-tree', collision: 'solid' },
    { x: 240, y: 232, texture: 'workshop-library', collision: 'solid' },
    { x: 86, y: 68, texture: 'nature-flower-white', collision: 'none' },
    { x: 300, y: 66, texture: 'nature-gray-rock', collision: 'solid' },
  ],
  projects: [
    { x: 42, y: 80, texture: 'workshop-drawers', collision: 'solid' },
    { x: 148, y: 64, texture: 'workshop-library', collision: 'solid' },
    { x: 334, y: 60, texture: 'workshop-empty-shelf', collision: 'solid' },
    { x: 54, y: 228, texture: 'workshop-bench', collision: 'solid' },
    { x: 430, y: 228, texture: 'workshop-drawers', collision: 'solid' },
    { x: 182, y: 232, texture: 'nature-flower-yellow', collision: 'none' },
    { x: 308, y: 236, texture: 'nature-flower-white', collision: 'none' },
  ],
  personal: [
    { x: 240, y: 140, texture: 'camp-tent', collision: 'solid' },
    { x: 438, y: 142, texture: 'campfire', collision: 'solid' },
    { x: 42, y: 142, texture: 'camp-log', collision: 'solid' },
    { x: 438, y: 234, texture: 'camp-barrel', collision: 'solid' },
    { x: 42, y: 234, texture: 'camp-pack', collision: 'none' },
    { x: 48, y: 50, texture: 'nature-autumn-tree', collision: 'solid' },
    { x: 214, y: 238, texture: 'nature-flower-yellow', collision: 'none' },
  ],
} as const satisfies Record<AdventureScreen['kind'], readonly ScreenDecoration[]>

export const SCREEN_MOBS = {
  training: [{ x: 398, y: 198, axis: 'vertical', range: 24, speed: 18, texture: 'monster-slime' }],
  experience: [{ x: 240, y: 148, axis: 'horizontal', range: 50, speed: 22, texture: 'monster-slime' }],
  studies: [{ x: 240, y: 70, axis: 'horizontal', range: 40, speed: 20, texture: 'monster-bat' }],
  projects: [
    { x: 240, y: 142, axis: 'vertical', range: 34, speed: 24, texture: 'monster-mushroom' },
    { x: 390, y: 238, axis: 'horizontal', range: 32, speed: 18, texture: 'monster-slime' },
  ],
  personal: [{ x: 360, y: 144, axis: 'vertical', range: 30, speed: 20, texture: 'monster-bat' }],
} as const satisfies Record<AdventureScreen['kind'], readonly MobSpawn[]>
