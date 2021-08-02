import { AnimationGraph } from './AnimationGraph'
import { IdleState, LoopableEmoteState, RunState, WalkState, JumpState } from './AnimationState'
import { CharacterStates } from './Util'

/** Class to hold the animation graph for player entity. Every character entity will have their saperate graph. */
export class CharacterAnimationGraph extends AnimationGraph {
  constructor() {
    super()

    // Initialize all the states
    const idleState = new IdleState()
    const walkState = new WalkState()
    const runState = new RunState()
    const loopableEmoteState = new LoopableEmoteState()
    const jumpState = new JumpState()

    // Set the next states
    walkState.nextStates.push(IdleState, RunState, JumpState)
    runState.nextStates.push(IdleState, WalkState, JumpState)
    loopableEmoteState.nextStates.push(WalkState, RunState, JumpState)
    jumpState.nextStates.push(IdleState, WalkState, RunState)

    // Add states to the graph
    this.states[CharacterStates.IDLE] = idleState
    this.states[CharacterStates.WALK] = walkState
    this.states[CharacterStates.RUN] = runState
    this.states[CharacterStates.JUMP] = jumpState
    this.states[CharacterStates.LOOPABLE_EMOTE] = loopableEmoteState
    this.defaultState = this.states[CharacterStates.IDLE]
  }
}
