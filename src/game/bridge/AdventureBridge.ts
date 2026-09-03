import { getContentReferenceKey, type ContentReference } from '../../content/adventure.schema'

export type Direction = 'up' | 'down' | 'left' | 'right'
export type InteractionHandler = (reference: ContentReference) => void
export type PlayerVisual = { x: number; y: number; frame: number; visible: boolean }
export type PlayerVisualHandler = (visual: PlayerVisual) => void
export type AdventureEvent =
  | { type: 'content'; reference: ContentReference }
  | { type: 'screen-changed'; screenId: string }
  | { type: 'tutorial-completed' }
  | { type: 'fragment-collected'; fragmentId: string }
  | { type: 'notice'; message: string }

export type AdventureRuntimeState = {
  collectedFragmentIds: string[]
  discoveredContentKeys: string[]
  tutorialCompleted: boolean
  lastScreenId: string
  inputEnabled: boolean
}

const defaultRuntimeState: AdventureRuntimeState = {
  collectedFragmentIds: [],
  discoveredContentKeys: [],
  tutorialCompleted: false,
  lastScreenId: 'training-clearing',
  inputEnabled: true,
}

export class AdventureBridge {
  private readonly heldDirections = new Set<Direction>()
  private readonly interactionHandlers = new Set<InteractionHandler>()
  private readonly eventHandlers = new Set<(event: AdventureEvent) => void>()
  private readonly playerVisualHandlers = new Set<PlayerVisualHandler>()
  private playerVisual: PlayerVisual = { x: 240, y: 220, frame: 0, visible: true }
  private actionQueued = false
  private runtimeState: AdventureRuntimeState

  constructor(initialState: Partial<AdventureRuntimeState> = {}) {
    this.runtimeState = { ...defaultRuntimeState, ...initialState }
  }

  onInteraction(handler: InteractionHandler): () => void {
    this.interactionHandlers.add(handler)
    return () => this.interactionHandlers.delete(handler)
  }

  emitInteraction(reference: ContentReference): void {
    for (const handler of this.interactionHandlers) handler(reference)
    this.emitEvent({ type: 'content', reference })
  }

  onEvent(handler: (event: AdventureEvent) => void): () => void {
    this.eventHandlers.add(handler)
    return () => this.eventHandlers.delete(handler)
  }

  emitEvent(event: AdventureEvent): void {
    for (const handler of this.eventHandlers) handler(event)
  }

  onPlayerVisual(handler: PlayerVisualHandler): () => void {
    this.playerVisualHandlers.add(handler)
    handler(this.playerVisual)
    return () => this.playerVisualHandlers.delete(handler)
  }

  emitPlayerVisual(visual: PlayerVisual): void {
    if (
      visual.x === this.playerVisual.x
      && visual.y === this.playerVisual.y
      && visual.frame === this.playerVisual.frame
      && visual.visible === this.playerVisual.visible
    ) return
    this.playerVisual = visual
    for (const handler of this.playerVisualHandlers) handler(visual)
  }

  setDirection(direction: Direction, held: boolean): void {
    if (held && !this.runtimeState.inputEnabled) return
    if (held) this.heldDirections.add(direction)
    else this.heldDirections.delete(direction)
  }

  isDirectionHeld(direction: Direction): boolean {
    return this.heldDirections.has(direction)
  }

  queueAction(): void {
    if (!this.runtimeState.inputEnabled) return
    this.actionQueued = true
  }

  consumeAction(): boolean {
    const queued = this.actionQueued
    this.actionQueued = false
    return queued
  }

  isFragmentCollected(fragmentId: string): boolean {
    return this.runtimeState.collectedFragmentIds.includes(fragmentId)
  }

  isContentDiscovered(reference: ContentReference): boolean {
    return this.runtimeState.discoveredContentKeys.includes(getContentReferenceKey(reference))
  }

  setRuntimeState(state: Partial<AdventureRuntimeState>): void {
    this.runtimeState = { ...this.runtimeState, ...state }
    if (state.inputEnabled === false) {
      this.heldDirections.clear()
      this.actionQueued = false
    }
  }

  getRuntimeState(): Readonly<AdventureRuntimeState> {
    return this.runtimeState
  }

  dispose(): void {
    this.heldDirections.clear()
    this.interactionHandlers.clear()
    this.eventHandlers.clear()
    this.playerVisualHandlers.clear()
    this.actionQueued = false
  }
}
