import { Entity } from "ecsy"
import Input from "../../input/components/Input"
import BinaryValue from "../../common/enums/BinaryValue"
import InputAlias from "../../input/types/InputAlias"
import { applyThreshold } from "../../common/utils/applyThreshold"
import Behavior from "../../common/interfaces/Behavior"
import { InputType } from "../../input/enums/InputType"

const inputPerGamepad = 2
let input: Input
let gamepads: Gamepad[]
let input0: number
let input1: number
let gamepad: Gamepad
let inputBase: number
let x: number
let y: number
let prevLeftX: number
let prevLeftY: number

let _index: number // temp var for iterator loops

// System behavior to handle gamepad input
export const handleGamepads: Behavior = (entity: Entity) => {
  if (!input.gamepadConnected) return
  // Get an immutable reference to input
  input = entity.getComponent(Input)
  // Get gamepads from the DOM
  gamepads = navigator.getGamepads()

  // Loop over connected gamepads
  for (_index = 0; _index < gamepads.length; _index++) {
    // If there's no gamepad at this index, skip
    if (!gamepads[_index]) return
    // Hold reference to this gamepad
    gamepad = gamepads[_index]

    // If the gamepad has analog inputs (dpads that aren't up UP/DOWN/L/R but have -1 to 1 values for X and Y)
    if (gamepad.axes) {
      input0 = inputPerGamepad * _index
      input1 = inputPerGamepad * _index + 1

      // GamePad 0 LStick XY
      if (input.map.eventBindings.input[input0] && gamepad.axes.length >= inputPerGamepad)
        handleGamepadAxis(entity, { gamepad: gamepad, inputIndex: 0, mappedInputValue: input.map.gamepadInputMap.axes[input0] })

      // GamePad 1 LStick XY
      if (input.map.gamepadInputMap.axes[input1] && gamepad.axes.length >= inputPerGamepad * 2)
        handleGamepadAxis(entity, { gamepad, inputIndex: 1, mappedInputValue: input.map.gamepadInputMap.axes[input1] })
    }

    // If the gamepad doesn't have buttons, or the input isn't mapped, return
    if (!gamepad.buttons || !input.map.gamepadInputMap.axes) return

    // Otherwise, loop through gamepad buttons
    for (_index = 0; _index < gamepad.buttons.length; _index++) {
      handleGamepadButton(entity, { gamepad, index: _index, mappedInputValue: input.map.gamepadInputMap.axes[input1] })
    }
  }
}

const handleGamepadButton: Behavior = (entity: Entity, args: { gamepad: Gamepad; index: number; mappedInputValue: InputAlias }) => {
  // Get mutable component reference
  input = entity.getMutableComponent(Input)
  // Make sure button is in the map
  if (
    typeof input.map.gamepadInputMap.axes[args.index] === "undefined" ||
    gamepad.buttons[args.index].touched === (input.gamepadButtons[args.index] === BinaryValue.ON)
  )
    return
  // Set input data
  input.data.set(input.map.gamepadInputMap.axes[args.index], {
    type: InputType.BUTTON,
    value: gamepad.buttons[args.index].touched ? BinaryValue.ON : BinaryValue.OFF
  })
  input.gamepadButtons[args.index] = gamepad.buttons[args.index].touched ? BinaryValue.ON : BinaryValue.OFF
}

export const handleGamepadAxis: Behavior = (entity: Entity, args: { gamepad: Gamepad; inputIndex: number; mappedInputValue: InputAlias }) => {
  // get immutable component reference
  input = entity.getComponent(Input)

  inputBase = args.inputIndex * 2

  x = applyThreshold(gamepad.axes[inputBase], input.gamepadThreshold)
  y = applyThreshold(gamepad.axes[inputBase + 1], input.gamepadThreshold)
  prevLeftX = input.gamepadInput[inputBase]
  prevLeftY = input.gamepadInput[inputBase + 1]

  // Axis has changed, so get mutable reference to Input and set data
  if (x !== prevLeftX || y !== prevLeftY) {
    entity.getMutableComponent(Input).data.set(args.mappedInputValue, {
      type: InputType.TWOD,
      value: [x, y]
    })

    input.gamepadInput[inputBase] = x
    input.gamepadInput[inputBase + 1] = y
  }
}

// When a gamepad connects
export const handleGamepadConnected: Behavior = (entity: Entity, args: { event: any }): void => {
  input = entity.getMutableComponent(Input)

  console.log("A gamepad connected:", args.event.gamepad, args.event.gamepad.mapping)

  if (args.event.gamepad.mapping !== "standard") return console.error("Non-standard gamepad mapping detected, not properly handled")

  input.gamepadConnected = true
  gamepad = args.event.gamepad

  for (let index = 0; index < gamepad.buttons.length; index++) {
    if (typeof input.gamepadButtons[index] === "undefined") input.gamepadButtons[index] = BinaryValue.OFF
  }
}

// When a gamepad disconnects
export const handleGamepadDisconnected: Behavior = (entity: Entity, args: { event: any }): void => {
  input = entity.getMutableComponent(Input)
  console.log("A gamepad disconnected:", args.event.gamepad)

  input.gamepadConnected = false

  if (!input.map) return // Already disconnected?

  for (let index = 0; index < input.gamepadButtons.length; index++) {
    if (input.gamepadButtons[index] === BinaryValue.ON && typeof input.map.gamepadInputMap.axes[index] !== "undefined") {
      input.data.set(input.map.gamepadInputMap.axes[index], {
        type: InputType.BUTTON,
        value: BinaryValue.OFF
      })
    }
    input.gamepadButtons[index] = BinaryValue.OFF
  }
}
