import { AnimationClip, MathUtils } from 'three'
import { Entity } from '../../ecs/classes/Entity'
import { getComponent } from '../../ecs/functions/EntityFunctions'
import { AnimationManager } from '../AnimationManager'
import { AnimationComponent } from '../components/AnimationComponent'
import { CharacterAnimationStateComponent } from '../components/CharacterAnimationStateComponent'
import { Animation } from './Util'

/** Class to handle rendering of an animation and smoothout the transition of the animation from one state to another */
export class AnimationRenderer {
  /** Renders current state animations, unmounts previous state animations and also renders idle weight with default animation
   * @param {Entity} entity
   * @param {number} delta Time since last frame
   */
  static render = (entity: Entity, delta: number) => {
    const currentStateWeights = this.updateCurrentState(entity, delta)
    const prevStateWeights = this.unmountPreviousState(entity, delta)
    this.renderIdleWeight(entity, currentStateWeights, prevStateWeights)
  }

  /**
   * Mounts current state by setting and configuring action for animation
   * @param {Entity} entity
   */
  static mountCurrentState = (entity: Entity) => {
    const characterAnimationStateComponent = getComponent(entity, CharacterAnimationStateComponent)
    const animationComponent = getComponent(entity, AnimationComponent)
    // Reset update time
    characterAnimationStateComponent.currentState.timeElapsedSinceUpdate = 0

    characterAnimationStateComponent.currentState.animations.forEach((animation) => {
      // Take the clip from the loaded animations
      if (!animation.clip) {
        animation.clip = AnimationClip.findByName(AnimationManager.instance._animations, animation.name)

        if (!animation.clip) return
      }

      // get action from the animation mixer
      animation.action = animationComponent.mixer.clipAction(animation.clip)

      // Apply state specific decorations to the action
      if (animation.decorateAction) animation.decorateAction(animation.action)
    })
  }

  /**
   * Updates animation of current state and apply interpolation if required to make smooth transition for animations
   * @param characterAnimationStateComponent Animation component which holds animation details
   * @param delta Time since last frame
   * @returns Total weights of currently mounted state's animations
   */
  static updateCurrentState = (entity: Entity, delta: number): number => {
    const characterAnimationStateComponent = getComponent(entity, CharacterAnimationStateComponent)
    let currentStateWeight = 0
    const currState = characterAnimationStateComponent.currentState

    // Advances the elapsed time
    currState.timeElapsedSinceUpdate += delta

    currState.animations.forEach((animation: Animation): void => {
      if (!animation.clip) return

      // IF interpolation is reuqired and animation weight is not final weight then interpolate
      if (currState.weightParams?.interpolate && animation.weight !== animation.transitionEndWeight) {
        animation.weight = this.interpolateWeight(
          currState.timeElapsedSinceUpdate,
          currState.transitionDuration,
          animation.transitionStartWeight,
          animation.transitionEndWeight
        )
      }

      currentStateWeight += animation.weight
      animation.action.setEffectiveWeight(animation.weight)
      animation.action.setEffectiveTimeScale(animation.timeScale || 1)

      if (!animation.action.isRunning() && animation.weight > 0) {
        animation.action.play()
      }

      // Reset animation in intra state transition
      if (currState.weightParams?.resetAnimation && animation.weight <= 0) {
        animation.action.reset()
      }
    })

    return currentStateWeight
  }

  /**
   * Unmounts previoust state if any
   * @param characterAnimationStateComponent Animation component which holds animation details
   * @param delta Time since last frame
   * @param stopImmediately Whether to stop immediately without smooth transition
   * @returns Total weight of previous state's animations
   */
  static unmountPreviousState = (entity: Entity, delta: number, stopImmediately?: boolean): number => {
    const characterAnimationStateComponent = getComponent(entity, CharacterAnimationStateComponent)
    let prevStateWeight = 0

    if (!characterAnimationStateComponent.prevState) {
      return prevStateWeight
    }

    // Advances the elapsed time
    characterAnimationStateComponent.prevState.timeElapsedSinceUpdate += delta

    characterAnimationStateComponent.prevState.animations.forEach((animation) => {
      // Get the interpolated weight and apply to the action
      animation.weight = stopImmediately
        ? 0
        : this.interpolateWeight(
            characterAnimationStateComponent.prevState.timeElapsedSinceUpdate,
            characterAnimationStateComponent.prevState.transitionDuration,
            animation.transitionStartWeight,
            animation.transitionEndWeight
          )

      animation.action.setEffectiveWeight(animation.weight)
      prevStateWeight += animation.weight

      if (animation.weight <= 0) {
        // Reset the animation of the action
        animation.action.reset()

        // Stop the action
        if (animation.action.isRunning()) {
          animation.action.stop()
        }
      }
    })

    if (
      characterAnimationStateComponent.prevState.name !==
      characterAnimationStateComponent.animationGraph.defaultState.name
    ) {
      // If there is no weight in the prevState animations then remove it.
      if (prevStateWeight <= 0) {
        this.resetPreviousState(entity, true)
      }
    }

    return prevStateWeight
  }

  /**
   * Renders idle weight with default animation to prevent T pose being rendered
   * @param characterAnimationStateComponent Animation component which holds animation details
   * @param currentStateWeight Weight of the current state
   * @param prevStateWeight Weight of the previous state
   */
  static renderIdleWeight = (entity: Entity, currentStateWeight: number, prevStateWeight: number) => {
    const characterAnimationStateComponent = getComponent(entity, CharacterAnimationStateComponent)
    const defaultState = characterAnimationStateComponent.animationGraph.defaultState
    defaultState.animations[0].weight = Math.max(1 - (prevStateWeight + currentStateWeight), 0)

    // If curren state is default state then assign all the weight to it to prevent partial T pose
    if (
      characterAnimationStateComponent.currentState.name === defaultState.name &&
      defaultState.animations[0].weight < 1
    ) {
      defaultState.animations[0].weight = 1
    }

    if (defaultState.animations[0].action) {
      defaultState.animations[0].action.setEffectiveWeight(defaultState.animations[0].weight)
    }
  }

  /**
   * Interpolates weight between start and end weight for elapsed time
   * @param elapsedTime Time elapsed since transition started
   * @param duration Animaiton transition duration
   * @param startWeight Start weight from which interpolated weigh will be calculated
   * @param endweight end weight towards which interpolated weigh will be calculated
   * @returns Interpolated weight
   */
  static interpolateWeight = (
    elapsedTime: number,
    duration: number,
    startWeight: number,
    endweight: number
  ): number => {
    return MathUtils.clamp(MathUtils.mapLinear(elapsedTime, 0, duration, startWeight, endweight), 0, 1)
  }

  /**
   * Resets the previouse state
   * @param {Entity} entity
   * @param {boolean} emptyPrevState Wheterh to make previous state null after reset
   */
  static resetPreviousState = (entity: Entity, emptyPrevState?: boolean): void => {
    const characterAnimationStateComponent = getComponent(entity, CharacterAnimationStateComponent)
    characterAnimationStateComponent.prevState.timeElapsedSinceUpdate = 0
    characterAnimationStateComponent.prevState.animations.forEach((a) => {
      a.transitionStartWeight = a.weight
      a.transitionEndWeight = 0
    })

    if (emptyPrevState) {
      characterAnimationStateComponent.prevState = null
    }
  }
}
