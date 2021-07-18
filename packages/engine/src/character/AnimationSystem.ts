import { Quaternion, Vector3 } from 'three'
import { EngineEvents } from '../ecs/classes/EngineEvents'
import { System, SystemAttributes } from '../ecs/classes/System'
import { getMutableComponent, getEntityByID } from '../ecs/functions/EntityFunctions'
import { SystemUpdateType } from '../ecs/functions/SystemUpdateType'
import { ControllerColliderComponent } from './components/ControllerColliderComponent'
import { AnimationComponent } from './components/AnimationComponent'
import { CharacterComponent } from './components/CharacterComponent'
import { CharacterAnimationGraph } from './animations/CharacterAnimationGraph'
import { CharacterStates } from './animations/Util'
import AnimationRenderer from './animations/AnimationRenderer'
import { loadActorAvatar } from './functions/avatarFunctions'

export class AnimationSystem extends System {
  // Entity
  static EVENTS = {
    LOAD_AVATAR: 'ANIMATION_SYSTEM_LOAD_AVATAR'
  }

  updateType = SystemUpdateType.Fixed
  constructor(attributes: SystemAttributes = {}) {
    super(attributes)

    EngineEvents.instance.addEventListener(AnimationSystem.EVENTS.LOAD_AVATAR, ({ entityID, avatarId, avatarURL }) => {
      const entity = getEntityByID(entityID)
      const characterAvatar = getMutableComponent(entity, CharacterComponent)
      if (characterAvatar != null) {
        characterAvatar.avatarId = avatarId
        characterAvatar.avatarURL = avatarURL
      }
      loadActorAvatar(entity)
    })
  }

  /** Removes resize listener. */
  dispose(): void {
    super.dispose()
    EngineEvents.instance.removeAllListenersForEvent(AnimationSystem.EVENTS.LOAD_AVATAR)
  }

  /**
   * Executes the system. Called each frame by default from the Engine.
   * @param delta Time since last frame.
   */
  execute(delta: number): void {
    this.queryResults.animationCharacter.added?.forEach((entity) => {
      loadActorAvatar(entity)
      const animationComponent = getMutableComponent(entity, AnimationComponent)
      animationComponent.animationGraph = new CharacterAnimationGraph()
      animationComponent.currentState = animationComponent.animationGraph.states[CharacterStates.IDLE]
      animationComponent.prevVelocity = new Vector3()
      animationComponent.prevDistanceFromGround = 0
      if (animationComponent.currentState) {
        AnimationRenderer.mountCurrentState(animationComponent)
      }
    })

    this.queryResults.animation.all?.forEach((entity) => {
      const animationComponent = getMutableComponent(entity, AnimationComponent)
      const modifiedDelta = delta * animationComponent.animationSpeed
      animationComponent.mixer.update(modifiedDelta)
    })

    this.queryResults.animationCharacter.all?.forEach((entity) => {
      const actor = getMutableComponent(entity, CharacterComponent)
      const animationComponent = getMutableComponent(entity, AnimationComponent)
      animationComponent.animationVelocity.copy(actor.velocity)

      if (!animationComponent.onlyUpdateMixerTime) {
        const deltaTime = delta * animationComponent.animationSpeed
        animationComponent.animationGraph.render(actor, animationComponent, deltaTime)
        AnimationRenderer.render(animationComponent, delta)
      }
    })
  }
}

AnimationSystem.queries = {
  animation: {
    components: [AnimationComponent],
    listen: {
      added: true,
      removed: true
    }
  },
  animationCharacter: {
    components: [AnimationComponent, ControllerColliderComponent],
    listen: {
      added: true,
      removed: true
    }
  }
}
