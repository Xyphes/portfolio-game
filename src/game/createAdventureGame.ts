import { adventureWorld, getAdventureScreen } from '../content/adventure.data'
import type { AdventureDirection, AdventureScreen, ContentReference } from '../content/adventure.schema'
import type { Locale } from '../content/portfolio.schema'
import { localize } from '../content/selectors'
import { getPointerMovement } from '../domain/pointerNavigation'
import type { AdventureBridge } from './bridge/AdventureBridge'
import { SCREEN_DECORATIONS, SCREEN_MOBS, type MobSpawn } from './adventureEncounters'
import {
  ADVENTURE_VIEWPORT,
  getBoundaryObstacles,
  getContentPositions,
  isInsideExitOpening,
  SCREEN_OBSTACLES,
} from './worldLayout'

type CreateAdventureGameOptions = {
  parent: HTMLElement
  bridge: AdventureBridge
  locale: Locale
  reducedMotion: boolean
}

const SCREEN_WIDTH = ADVENTURE_VIEWPORT.width
const SCREEN_HEIGHT = ADVENTURE_VIEWPORT.height
const ASSET_ROOT = '/assets/adventure/ninja-adventure'
const HERO_KEY = 'hero'
const GUIDE_KEY = 'guide'
const GUARDIAN_KEY = 'practice-guardian'
const FLOOR_KEY = 'forest-floor-tileset'
const PLAYER_SPEED = 96

type PointerTarget = {
  x: number
  y: number
  arrivalDistance: number
  interactOnArrival: boolean
}

export async function createAdventureGame({
  parent,
  bridge,
  locale,
  reducedMotion,
}: CreateAdventureGameOptions) {
  const { default: Phaser } = await import('phaser')

  type RoamingMob = {
    sprite: Phaser.GameObjects.Sprite
    spawn: MobSpawn
    direction: 1 | -1
  }

  class AdventureWorldScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Sprite
    private pointerMarker?: Phaser.GameObjects.Arc
    private pointerTarget?: PointerTarget
    private tutorialEnemy?: Phaser.GameObjects.Sprite
    private readonly mobs: RoamingMob[] = []
    private readonly colliders: Phaser.Physics.Arcade.Collider[] = []
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private movementKeys!: Record<'w' | 'a' | 's' | 'd' | 'z' | 'q', Phaser.Input.Keyboard.Key>
    private actionKeys!: Phaser.Input.Keyboard.Key[]
    private readonly screenObjects: Phaser.GameObjects.GameObject[] = []
    private readonly interactables: Array<{
      object: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite
      reference: ContentReference
    }> = []
    private currentScreenId = bridge.getRuntimeState().lastScreenId
    private lastFacing: AdventureDirection = 'down'
    private transitioning = false
    private noticeAvailableAt = 0

    constructor() {
      super('adventure-world')
    }

    preload() {
      const characterSheet = { frameWidth: 16, frameHeight: 16 }
      this.load.spritesheet(HERO_KEY, `${ASSET_ROOT}/hero.png`, characterSheet)
      this.load.spritesheet(GUIDE_KEY, `${ASSET_ROOT}/guide.png`, characterSheet)
      this.load.spritesheet(GUARDIAN_KEY, `${ASSET_ROOT}/practice-guardian.png`, characterSheet)
      this.load.image(FLOOR_KEY, `${ASSET_ROOT}/tileset-floor.png`)
      this.load.image('grass', `${ASSET_ROOT}/grass.png`)
      this.load.image('crate', `${ASSET_ROOT}/crate.png`)
      this.load.image('pot', `${ASSET_ROOT}/pot.png`)
      this.load.image('memory-book', `${ASSET_ROOT}/book.png`)
    }

    create() {
      this.cameras.main.setBackgroundColor('#07180f')
      this.physics.world.setBounds(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
      this.registerPackFrames()
      this.registerHeroAnimations()

      this.player = this.add.sprite(240, 220, HERO_KEY, 0).setDepth(5)
      this.physics.add.existing(this.player)
      this.publishPlayerVisual()

      const body = this.player.body as Phaser.Physics.Arcade.Body
      body.setCollideWorldBounds(false)
      body.setSize(9, 7, true)

      this.cursors = this.input.keyboard!.createCursorKeys()
      const keys = this.input.keyboard!.addKeys('W,A,S,D,Z,Q,E,SPACE') as Record<
        string,
        Phaser.Input.Keyboard.Key | undefined
      >
      this.movementKeys = {
        w: keys.W!,
        a: keys.A!,
        s: keys.S!,
        d: keys.D!,
        z: keys.Z!,
        q: keys.Q!,
      }
      this.actionKeys = [keys.E, keys.SPACE].filter(
        (key): key is Phaser.Input.Keyboard.Key => Boolean(key),
      )
      this.input.on('pointerdown', this.handlePointerInput, this)

      this.drawCurrentScreen()
      bridge.emitEvent({ type: 'screen-changed', screenId: this.currentScreenId })
    }

    update() {
      const body = this.player.body as Phaser.Physics.Arcade.Body
      if (this.transitioning || !bridge.getRuntimeState().inputEnabled) {
        body.setVelocity(0)
        if (!bridge.getRuntimeState().inputEnabled) this.clearPointerTarget()
        return
      }

      const left = this.cursors.left.isDown
        || this.movementKeys.a.isDown
        || this.movementKeys.q.isDown
        || bridge.isDirectionHeld('left')
      const right = this.cursors.right.isDown
        || this.movementKeys.d.isDown
        || bridge.isDirectionHeld('right')
      const up = this.cursors.up.isDown
        || this.movementKeys.w.isDown
        || this.movementKeys.z.isDown
        || bridge.isDirectionHeld('up')
      const down = this.cursors.down.isDown
        || this.movementKeys.s.isDown
        || bridge.isDirectionHeld('down')

      const horizontal = Number(right) - Number(left)
      const vertical = Number(down) - Number(up)
      let velocityX = horizontal * PLAYER_SPEED
      let velocityY = vertical * PLAYER_SPEED

      if (horizontal || vertical) {
        this.clearPointerTarget()
        const magnitude = Math.hypot(velocityX, velocityY)
        velocityX = velocityX / magnitude * PLAYER_SPEED
        velocityY = velocityY / magnitude * PLAYER_SPEED
      } else if (this.pointerTarget) {
        const movement = getPointerMovement(
          { x: this.player.x, y: this.player.y },
          this.pointerTarget,
          PLAYER_SPEED,
          this.pointerTarget.arrivalDistance,
        )
        velocityX = movement.velocityX
        velocityY = movement.velocityY
        if (movement.reached) {
          const shouldInteract = this.pointerTarget.interactOnArrival
          this.clearPointerTarget()
          if (shouldInteract) this.performAction()
        }
      }

      body.setVelocity(velocityX, velocityY)
      if (velocityX || velocityY) {
        this.lastFacing = Math.abs(velocityX) > Math.abs(velocityY)
          ? velocityX > 0 ? 'right' : 'left'
          : velocityY > 0 ? 'down' : 'up'
        if (reducedMotion) {
          this.player.stop()
          this.player.setFrame(this.getIdleFrame())
        } else {
          this.player.play(`hero-${this.lastFacing}`, true)
        }
      } else {
        this.player.stop()
        this.player.setFrame(this.getIdleFrame())
      }
      this.publishPlayerVisual()
      this.updateMobs()

      const keyboardAction = this.actionKeys.some((key) =>
        Phaser.Input.Keyboard.JustDown(key),
      )
      if (keyboardAction || bridge.consumeAction()) {
        this.clearPointerTarget()
        this.performAction()
      }

      for (const interactable of this.interactables) {
        interactable.object.setAlpha(bridge.isContentDiscovered(interactable.reference) ? 0.58 : 1)
      }
      this.checkScreenExit()
    }

    private drawCurrentScreen() {
      this.clearScreenObjects()
      const screen = getAdventureScreen(this.currentScreenId)
      this.currentScreenId = screen.id

      const floor = this.track(
        this.add.tileSprite(240, 144, SCREEN_WIDTH, SCREEN_HEIGHT, FLOOR_KEY, 'green-ground').setDepth(0),
      )
      floor.setTileScale(1)
      this.drawDecorations(screen)

      const walls = [
        ...this.drawForestBorder(screen),
        ...SCREEN_OBSTACLES[screen.kind].map(([x, y, width, height]) =>
        this.addWall(x, y, width, height),
        ),
      ]
      this.colliders.push(this.physics.add.collider(this.player, walls))

      if (screen.kind === 'training') this.drawTrainingScreen()
      else if (screen.contentStatus === 'ready') this.drawContentScreen(screen)
      else this.drawAwaitingContentScreen()
      this.drawRoamingMobs(screen, walls)
    }

    private handlePointerInput(pointer: Phaser.Input.Pointer) {
      if (!bridge.getRuntimeState().inputEnabled || this.transitioning) return

      const candidates: Array<{
        object: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite
        arrivalDistance: number
      }> = this.interactables.map(({ object }) => ({ object, arrivalDistance: 26 }))
      if (this.tutorialEnemy) candidates.push({ object: this.tutorialEnemy, arrivalDistance: 30 })
      for (const { sprite } of this.mobs) candidates.push({ object: sprite, arrivalDistance: 30 })

      const nearest = candidates
        .map((candidate) => ({
          ...candidate,
          distance: Phaser.Math.Distance.Between(
            pointer.worldX,
            pointer.worldY,
            candidate.object.x,
            candidate.object.y,
          ),
        }))
        .sort((left, right) => left.distance - right.distance)[0]

      const selected = nearest && nearest.distance <= 18 ? nearest : undefined
      this.setPointerTarget({
        x: selected?.object.x ?? Phaser.Math.Clamp(pointer.worldX, 1, SCREEN_WIDTH - 1),
        y: selected?.object.y ?? Phaser.Math.Clamp(pointer.worldY, 1, SCREEN_HEIGHT - 1),
        arrivalDistance: selected?.arrivalDistance ?? 4,
        interactOnArrival: Boolean(selected),
      })
    }

    private setPointerTarget(target: PointerTarget) {
      this.clearPointerTarget()
      this.pointerTarget = target
      this.pointerMarker = this.add
        .circle(target.x, target.y, 4, 0xf0cb5a, 0.16)
        .setStrokeStyle(1, 0xf0cb5a, 0.86)
        .setDepth(6)
    }

    private clearPointerTarget() {
      this.pointerTarget = undefined
      this.pointerMarker?.destroy()
      this.pointerMarker = undefined
    }

    private drawForestBorder(screen: AdventureScreen) {
      this.track(this.add.rectangle(240, 8, SCREEN_WIDTH, 16, 0x173d23).setDepth(1))
      this.track(this.add.rectangle(240, 280, SCREEN_WIDTH, 16, 0x173d23).setDepth(1))
      this.track(this.add.rectangle(8, 144, 16, SCREEN_HEIGHT, 0x173d23).setDepth(1))
      this.track(this.add.rectangle(472, 144, 16, SCREEN_HEIGHT, 0x173d23).setDepth(1))

      for (let x = 8; x < SCREEN_WIDTH; x += 16) {
        if (!screen.exits.up || x < 208 || x > 272) this.track(this.add.image(x, 8, 'grass').setDepth(2))
        if (!screen.exits.down || x < 208 || x > 272) this.track(this.add.image(x, 280, 'grass').setDepth(2))
      }
      for (let y = 24; y < SCREEN_HEIGHT - 16; y += 16) {
        if (!screen.exits.left || y < 112 || y > 176) this.track(this.add.image(8, y, 'grass').setDepth(2))
        if (!screen.exits.right || y < 112 || y > 176) this.track(this.add.image(472, y, 'grass').setDepth(2))
      }

      return getBoundaryObstacles(screen).map(([x, y, width, height]) =>
        this.addStaticWall(x, y, width, height),
      )
    }

    private drawTrainingScreen() {
      if (bridge.getRuntimeState().tutorialCompleted) {
        return
      }

      this.tutorialEnemy = this.track(this.add.sprite(240, 138, GUARDIAN_KEY, 0).setDepth(3))
      this.makeSolid(this.tutorialEnemy)
    }

    private drawContentScreen(screen: AdventureScreen) {
      const positions = getContentPositions(screen.contentRefs.length)
      screen.contentRefs.forEach((reference, index) => {
        const [x, y] = positions[index]!
        const object = this.createContentObject(reference, index, x, y)
        this.makeSolid(object)
        object.setAlpha(bridge.isContentDiscovered(reference) ? 0.58 : 1)
        this.interactables.push({ object, reference })

      })
    }

    private createContentObject(reference: ContentReference, index: number, x: number, y: number) {
      if (reference.kind === 'experience') {
        const texture = index % 2 === 0 ? GUIDE_KEY : GUARDIAN_KEY
        return this.track(this.add.sprite(x, y, texture, index % 4).setDepth(3))
      }
      if (reference.kind === 'education') {
        return this.track(this.add.image(x, y, 'memory-book').setDepth(3))
      }
      if (reference.kind === 'project') {
        return this.track(this.add.image(x, y, index % 2 === 0 ? 'crate' : 'pot').setDepth(3))
      }
      const texture = index % 2 === 0 ? GUIDE_KEY : GUARDIAN_KEY
      return this.track(this.add.sprite(x, y, texture, (index + 2) % 4).setDepth(3))
    }

    private drawAwaitingContentScreen() {
      this.track(this.add.image(240, 138, 'crate').setDepth(2))
    }

    private drawDecorations(screen: AdventureScreen) {
      for (const decoration of SCREEN_DECORATIONS[screen.kind]) {
        this.track(
          this.add.image(decoration.x, decoration.y, decoration.texture)
            .setAlpha(decoration.alpha ?? 1)
            .setFlipX('flipX' in decoration && decoration.flipX)
            .setDepth(1),
        )
      }
    }

    private drawRoamingMobs(
      screen: AdventureScreen,
      walls: Phaser.GameObjects.Rectangle[],
    ) {
      for (const spawn of SCREEN_MOBS[screen.kind]) {
        const sprite = this.track(
          this.add.sprite(spawn.x, spawn.y, GUARDIAN_KEY, 0)
            .setTint(0xd39b4a)
            .setDepth(4),
        )
        this.physics.add.existing(sprite)
        const body = sprite.body as Phaser.Physics.Arcade.Body
        body.setAllowGravity(false)
        body.setImmovable(true)
        body.setSize(10, 8, true)
        this.colliders.push(this.physics.add.collider(sprite, walls))
        this.colliders.push(this.physics.add.collider(this.player, sprite))
        this.mobs.push({ sprite, spawn, direction: 1 })
      }
    }

    private updateMobs() {
      for (const mob of this.mobs) {
        if (!mob.sprite.active) continue
        const current = mob.spawn.axis === 'horizontal' ? mob.sprite.x : mob.sprite.y
        const origin = mob.spawn.axis === 'horizontal' ? mob.spawn.x : mob.spawn.y
        const body = mob.sprite.body as Phaser.Physics.Arcade.Body
        const reachedPatrolEnd = Math.abs(current - origin) >= mob.spawn.range
        const hitObstacle = mob.spawn.axis === 'horizontal'
          ? body.blocked.left || body.blocked.right
          : body.blocked.up || body.blocked.down
        if (reachedPatrolEnd || hitObstacle) mob.direction *= -1

        if (mob.spawn.axis === 'horizontal') {
          body.setVelocity(mob.spawn.speed * mob.direction, 0)
          mob.sprite.setFrame(mob.direction > 0 ? 3 : 2)
        } else {
          body.setVelocity(0, mob.spawn.speed * mob.direction)
          mob.sprite.setFrame(mob.direction > 0 ? 0 : 1)
        }
      }
    }

    private addWall(x: number, y: number, width: number, height: number) {
      const wall = this.addStaticWall(x, y, width, height)
      const count = Math.max(2, Math.floor(width / 16))
      for (let index = 0; index < count; index += 1) {
        const offset = count === 1 ? 0 : (index / (count - 1) - 0.5) * width
        this.track(this.add.image(x + offset, y, 'grass').setDepth(2))
      }
      return wall
    }

    private addStaticWall(x: number, y: number, width: number, height: number) {
      const wall = this.track(this.add.rectangle(x, y, width, height, 0x3c7046).setAlpha(0))
      this.physics.add.existing(wall, true)
      return wall
    }

    private makeSolid(object: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite) {
      this.physics.add.existing(object, true)
      const body = object.body as Phaser.Physics.Arcade.StaticBody
      body.setSize(12, 8).setOffset(2, 7)
      body.updateFromGameObject()
      this.colliders.push(this.physics.add.collider(this.player, object))
    }

    private performAction() {
      const screen = getAdventureScreen(this.currentScreenId)
      if (this.tutorialEnemy && this.distanceTo(this.tutorialEnemy) < 36) {
        this.drawAttackEffect()
        this.completeTutorial()
        return
      }

      const nearestMob = this.mobs
        .map((mob) => ({ mob, distance: this.distanceTo(mob.sprite) }))
        .sort((left, right) => left.distance - right.distance)[0]
      if (nearestMob && nearestMob.distance < 40) {
        this.drawAttackEffect()
        this.defeatMob(nearestMob.mob)
        return
      }

      const nearest = this.interactables
        .map((interactable) => ({ ...interactable, distance: this.distanceTo(interactable.object) }))
        .sort((left, right) => left.distance - right.distance)[0]
      if (nearest && nearest.distance < 32) {
        bridge.emitInteraction(nearest.reference)
        return
      }

      if (screen.contentStatus === 'awaiting-user-content') {
        bridge.emitEvent({ type: 'notice', message: localize(screen.hint, locale) })
        return
      }

      if (this.time.now >= this.noticeAvailableAt) {
        this.drawAttackEffect()
        bridge.emitEvent({
          type: 'notice',
          message: localize(adventureWorld.canvasCopy.nothingNearby, locale),
        })
        this.noticeAvailableAt = this.time.now + 1400
      }
    }

    private completeTutorial() {
      const enemy = this.tutorialEnemy
      if (!enemy) return
      this.tutorialEnemy = undefined
      enemy.setTint(0xf0cb5a)
      bridge.setRuntimeState({ tutorialCompleted: true })
      bridge.emitEvent({ type: 'tutorial-completed' })
      if (reducedMotion) {
        this.drawCurrentScreen()
        return
      }
      this.tweens.add({
        targets: enemy,
        alpha: 0,
        scale: 1,
        duration: 180,
        onComplete: () => this.drawCurrentScreen(),
      })
    }

    private defeatMob(mob: RoamingMob) {
      const index = this.mobs.indexOf(mob)
      if (index >= 0) this.mobs.splice(index, 1)
      const body = mob.sprite.body as Phaser.Physics.Arcade.Body
      body.setVelocity(0)
      body.enable = false
      mob.sprite.setTint(0xf0cb5a)
      if (reducedMotion) {
        mob.sprite.destroy()
        return
      }
      this.tweens.add({
        targets: mob.sprite,
        alpha: 0,
        scale: 0.55,
        duration: 160,
        onComplete: () => mob.sprite.destroy(),
      })
    }

    private drawAttackEffect() {
      const offsets: Record<AdventureDirection, readonly [number, number, number]> = {
        up: [0, -14, 0],
        down: [0, 14, 0],
        left: [-14, 0, 90],
        right: [14, 0, 90],
      }
      const [offsetX, offsetY, angle] = offsets[this.lastFacing]
      const effect = this.add
        .rectangle(this.player.x + offsetX, this.player.y + offsetY, 16, 5, 0xf0cb5a, 0.78)
        .setAngle(angle)
        .setDepth(7)
      if (reducedMotion) {
        this.time.delayedCall(70, () => effect.destroy())
        return
      }
      this.tweens.add({
        targets: effect,
        alpha: 0,
        scaleX: 1.45,
        duration: 110,
        onComplete: () => effect.destroy(),
      })
    }

    private checkScreenExit() {
      if (this.player.x < 12) this.tryTransition('left')
      else if (this.player.x > SCREEN_WIDTH - 12) this.tryTransition('right')
      else if (this.player.y < 12) this.tryTransition('up')
      else if (this.player.y > SCREEN_HEIGHT - 12) this.tryTransition('down')
    }

    private tryTransition(direction: AdventureDirection) {
      const screen = getAdventureScreen(this.currentScreenId)
      const targetId = screen.exits[direction]
      if (!targetId || !isInsideExitOpening(this.player, direction)) {
        this.keepPlayerInside(direction)
        return
      }

      if (!bridge.getRuntimeState().tutorialCompleted) {
        this.keepPlayerInside(direction)
        if (this.time.now >= this.noticeAvailableAt) {
          bridge.emitEvent({
            type: 'notice',
            message: localize(adventureWorld.canvasCopy.tutorialRequired, locale),
          })
          this.noticeAvailableAt = this.time.now + 1200
        }
        return
      }

      this.transitioning = true
      this.clearPointerTarget()
      const body = this.player.body as Phaser.Physics.Arcade.Body
      body.setVelocity(0)
      this.publishPlayerVisual(false)
      if (reducedMotion) {
        this.completeTransition(targetId, direction)
        return
      }
      this.cameras.main.fadeOut(110, 4, 16, 9)
      this.time.delayedCall(115, () => {
        this.completeTransition(targetId, direction)
        this.cameras.main.fadeIn(130, 4, 16, 9)
      })
    }

    private completeTransition(targetId: string, direction: AdventureDirection) {
      this.currentScreenId = targetId
      this.drawCurrentScreen()
      this.placePlayerAfterTransition(direction)
      bridge.setRuntimeState({ lastScreenId: targetId })
      bridge.emitEvent({ type: 'screen-changed', screenId: targetId })
      this.transitioning = false
      this.publishPlayerVisual()
    }

    private keepPlayerInside(direction: AdventureDirection) {
      this.clearPointerTarget()
      if (direction === 'left') this.player.x = 20
      else if (direction === 'right') this.player.x = SCREEN_WIDTH - 20
      else if (direction === 'up') this.player.y = 20
      else this.player.y = SCREEN_HEIGHT - 20
      ;(this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0)
    }

    private placePlayerAfterTransition(direction: AdventureDirection) {
      if (direction === 'left') this.player.setPosition(SCREEN_WIDTH - 24, 144)
      else if (direction === 'right') this.player.setPosition(24, 144)
      else if (direction === 'up') this.player.setPosition(240, SCREEN_HEIGHT - 26)
      else this.player.setPosition(240, 26)
      ;(this.player.body as Phaser.Physics.Arcade.Body).reset(this.player.x, this.player.y)
    }

    private distanceTo(object: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite) {
      return Phaser.Math.Distance.Between(this.player.x, this.player.y, object.x, object.y)
    }

    private getIdleFrame() {
      const idleFrames: Record<AdventureDirection, number> = {
        down: 0,
        up: 1,
        left: 2,
        right: 3,
      }
      return idleFrames[this.lastFacing]
    }

    private publishPlayerVisual(visible = true) {
      const frameName = this.player.frame.name
      const parsedFrame = typeof frameName === 'number' ? frameName : Number(frameName)
      bridge.emitPlayerVisual({
        x: this.player.x,
        y: this.player.y,
        frame: Number.isFinite(parsedFrame) ? parsedFrame : 0,
        visible,
      })
    }

    private registerPackFrames() {
      this.textures.get(FLOOR_KEY).add('green-ground', 0, 176, 192, 16, 16)
    }

    private registerHeroAnimations() {
      const directionColumns: Record<AdventureDirection, number> = {
        down: 0,
        up: 1,
        left: 2,
        right: 3,
      }
      for (const [direction, column] of Object.entries(directionColumns)) {
        this.anims.create({
          key: `hero-${direction}`,
          frames: [0, 1, 2, 3].map((row) => ({ key: HERO_KEY, frame: row * 4 + column })),
          frameRate: 8,
          repeat: -1,
        })
      }
    }

    private clearScreenObjects() {
      this.clearPointerTarget()
      for (const collider of this.colliders.splice(0)) collider.destroy()
      this.tutorialEnemy = undefined
      this.mobs.splice(0)
      this.interactables.splice(0)
      for (const object of this.screenObjects.splice(0)) object.destroy()
    }

    private track<T extends Phaser.GameObjects.GameObject>(object: T): T {
      this.screenObjects.push(object)
      return object
    }
  }

  return new Phaser.Game({
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    parent,
    backgroundColor: '#07180f',
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoRound: true,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [AdventureWorldScene],
  })
}
