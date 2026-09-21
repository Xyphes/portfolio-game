import type { AdventureScreen } from '../content/adventure.schema'

export type DecorationTexture = 'grass' | 'crate' | 'pot' | 'memory-book'

export type ScreenDecoration = {
  x: number
  y: number
  texture: DecorationTexture
  alpha?: number
  flipX?: boolean
}

export type MobSpawn = {
  x: number
  y: number
  axis: 'horizontal' | 'vertical'
  range: number
  speed: number
}

export const SCREEN_DECORATIONS = {
  training: [
    { x: 74, y: 62, texture: 'grass', alpha: 0.72 },
    { x: 406, y: 226, texture: 'grass', alpha: 0.72, flipX: true },
    { x: 92, y: 224, texture: 'pot', alpha: 0.78 },
  ],
  experience: [
    { x: 52, y: 60, texture: 'grass', alpha: 0.66 },
    { x: 430, y: 224, texture: 'grass', alpha: 0.66, flipX: true },
    { x: 240, y: 56, texture: 'pot', alpha: 0.72 },
  ],
  studies: [
    { x: 70, y: 226, texture: 'memory-book', alpha: 0.68 },
    { x: 410, y: 64, texture: 'memory-book', alpha: 0.68 },
    { x: 240, y: 224, texture: 'grass', alpha: 0.64 },
  ],
  projects: [
    { x: 56, y: 224, texture: 'crate', alpha: 0.72 },
    { x: 424, y: 60, texture: 'pot', alpha: 0.72 },
    { x: 240, y: 54, texture: 'grass', alpha: 0.64 },
  ],
  personal: [
    { x: 58, y: 142, texture: 'grass', alpha: 0.7 },
    { x: 422, y: 142, texture: 'grass', alpha: 0.7, flipX: true },
    { x: 240, y: 246, texture: 'pot', alpha: 0.7 },
  ],
} as const satisfies Record<AdventureScreen['kind'], readonly ScreenDecoration[]>

export const SCREEN_MOBS = {
  training: [],
  experience: [{ x: 240, y: 148, axis: 'horizontal', range: 50, speed: 22 }],
  studies: [{ x: 240, y: 218, axis: 'horizontal', range: 54, speed: 20 }],
  projects: [
    { x: 240, y: 142, axis: 'vertical', range: 34, speed: 24 },
    { x: 420, y: 236, axis: 'horizontal', range: 34, speed: 18 },
  ],
  personal: [{ x: 410, y: 144, axis: 'vertical', range: 30, speed: 20 }],
} as const satisfies Record<AdventureScreen['kind'], readonly MobSpawn[]>
