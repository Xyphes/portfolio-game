import { z } from 'zod'
import { localizedTextSchema } from './portfolio.schema'

export const directionSchema = z.enum(['up', 'down', 'left', 'right'])
export type AdventureDirection = z.infer<typeof directionSchema>

export const contentKindSchema = z.enum(['experience', 'education', 'project', 'interest'])
export const contentReferenceSchema = z.object({
  kind: contentKindSchema,
  id: z.string().trim().min(1),
})
export type ContentReference = z.infer<typeof contentReferenceSchema>

export function getContentReferenceKey(reference: ContentReference): string {
  return `${reference.kind}:${reference.id}`
}

export const adventureScreenSchema = z.object({
  id: z.string().trim().min(1),
  coordinate: z.object({
    x: z.number().int(),
    y: z.number().int(),
  }),
  kind: z.enum(['training', 'experience', 'studies', 'projects', 'personal']),
  name: localizedTextSchema,
  hint: localizedTextSchema,
  exits: z.object({
    up: z.string().optional(),
    down: z.string().optional(),
    left: z.string().optional(),
    right: z.string().optional(),
  }),
  contentRefs: z.array(contentReferenceSchema),
  fragment: z.object({
    id: z.string().trim().min(1),
    label: localizedTextSchema,
  }).optional(),
  contentStatus: z.enum(['ready', 'awaiting-user-content']),
})

export const adventureWorldSchema = z
  .object({
    startScreenId: z.string().trim().min(1),
    screens: z.array(adventureScreenSchema).min(1),
    canvasCopy: z.object({
      action: localizedTextSchema,
      tutorialEnemy: localizedTextSchema,
      tutorialRequired: localizedTextSchema,
      tutorialComplete: localizedTextSchema,
      fragmentReady: localizedTextSchema,
      fragmentCollected: localizedTextSchema,
      nothingNearby: localizedTextSchema,
    }),
  })
  .superRefine((world, context) => {
    const ids = world.screens.map(({ id }) => id)
    const knownIds = new Set(ids)
    const coordinates = new Set<string>()

    if (!knownIds.has(world.startScreenId)) {
      context.addIssue({ code: 'custom', message: `Unknown start screen: ${world.startScreenId}` })
    }

    for (const screen of world.screens) {
      const coordinateKey = `${screen.coordinate.x}:${screen.coordinate.y}`
      if (coordinates.has(coordinateKey)) {
        context.addIssue({ code: 'custom', message: `Duplicate screen coordinate: ${coordinateKey}` })
      }
      coordinates.add(coordinateKey)

      for (const [direction, targetId] of Object.entries(screen.exits)) {
        if (targetId && !knownIds.has(targetId)) {
          context.addIssue({
            code: 'custom',
            message: `Unknown ${direction} exit "${targetId}" in screen "${screen.id}"`,
          })
        }
      }

      if (screen.contentStatus === 'ready' && screen.kind !== 'training' && screen.contentRefs.length === 0) {
        context.addIssue({
          code: 'custom',
          message: `Ready content screen "${screen.id}" requires at least one content reference`,
        })
      }
    }
  })

export type AdventureWorld = z.infer<typeof adventureWorldSchema>
export type AdventureScreen = AdventureWorld['screens'][number]
