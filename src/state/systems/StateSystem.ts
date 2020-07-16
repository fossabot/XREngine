import { System, Entity } from "ecsy"
import State from "../components/State"
import StateValue from "../interfaces/StateValue"
import { Vector2, NumericalType } from "../../common/types/NumericalTypes"
import Behavior from "../../common/interfaces/Behavior"
import StateMap from "../interfaces/StateMap"
import StateGroupAlias from "../types/StateGroupAlias"
import { addState } from "../behaviors/StateBehaviors"

export default class StateSystem extends System {
  private _state: State
  private _args: any
  public execute(delta: number, time: number): void {
    this.queries.state.added?.forEach(entity => {
      // If stategroup has a default, add it to our state map
      this._state = entity.getComponent(State)
      Object.keys((this._state.map as StateMap).groups).forEach((stateGroup: StateGroupAlias) => {
        if (this._state.map.groups[stateGroup] !== undefined && this._state.map.groups[stateGroup].default !== undefined) {
          addState(entity, { state: this._state.map.groups[stateGroup].default })
          console.log("Added default state: " + this._state.map.groups[stateGroup].default)
        }
      })
    })

    this.queries.state.results?.forEach(entity => {
      this.callBehaviors(entity, { phase: "onUpdate" }, delta)
      this.callBehaviors(entity, { phase: "onLateUpdate" }, delta)
    })
  }

  private callBehaviors: Behavior = (entity: Entity, args: { phase: string }, delta: number) => {
    this._state = entity.getComponent(State)
    this._state.data.forEach((stateValue: StateValue<NumericalType>) => {
      if (this._state.map.states[stateValue.state] !== undefined && this._state.map.states[stateValue.state][args.phase] !== undefined) {
        this._state.map.states[stateValue.state][args.phase].behavior(entity, this._state.map.states[stateValue.state][args.phase].args, delta)
      }
    })
  }
}

StateSystem.queries = {
  state: {
    components: [State],
    listen: {
      added: true,
      changed: true,
      removed: true
    }
  }
}
