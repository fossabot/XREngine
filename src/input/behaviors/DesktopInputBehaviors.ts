import { Entity } from "ecsy"
import BinaryValue from "../../common/enums/BinaryValue"
import Input from "../components/Input"
import Behavior from "../../common/interfaces/Behavior"
import { InputType } from "../../input/enums/InputType"

let input: Input
export const handleMouseMovement: Behavior = (entity: Entity, args: { e: MouseEvent }): void => {
  console.log(" mouse movement: " + entity.id)
  input = entity.getComponent(Input)
  if (!input || input.map.mouseInputMap === undefined) return
  entity.getMutableComponent(Input).data.set(input.map.mouseInputMap.input.mousePosition, {
    type: InputType.TWOD,
    value: [(args.e.clientX / window.innerWidth) * 2 - 1, (args.e.clientY / window.innerHeight) * -2 + 1]
  })
}

export const handleMouseButton: Behavior = (entity: Entity, args: { e: MouseEvent; value: BinaryValue }, delta: number): void => {
  input = entity.getComponent(Input)
  if (!input || input.map.mouseInputMap.buttons[args.e.button] === undefined) return
  entity.getMutableComponent(Input).data.set(input.map.mouseInputMap.buttons[args.e.button], {
    type: InputType.BUTTON,
    value: args.value
  })
}

export function handleKey(entity: Entity, key: string, value: BinaryValue): any {
  input = entity.getComponent(Input)
  if (input.map.keyboardInputMap.input[key] === undefined) return
  entity.getMutableComponent(Input).data.set(input.map.keyboardInputMap.input[key], {
    type: InputType.BUTTON,
    value: value
  })
}
