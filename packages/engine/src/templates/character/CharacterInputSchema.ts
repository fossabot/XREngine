import { BinaryValue } from '../../common/enums/BinaryValue';
import { Thumbsticks } from '../../common/enums/Thumbsticks';
import { disableScroll, enableScroll } from '../../common/functions/enableDisableScrolling';
import { preventDefault } from '../../common/functions/preventDefault';
import { handleKey, handleMouseButton, handleMouseMovement } from '../../input/behaviors/DesktopInputBehaviors';
import { handleGamepadConnected, handleGamepadDisconnected } from '../../input/behaviors/GamepadInputBehaviors';
import { handleTouch, handleTouchMove } from '../../input/behaviors/TouchBehaviors';
import { GamepadButtons } from '../../input/enums/GamepadButtons';
import { MouseInput } from '../../input/enums/MouseInput';
import { InputRelationship } from '../../input/interfaces/InputRelationship';
import { InputSchema } from '../../input/interfaces/InputSchema';
import { DefaultInput } from '../shared/DefaultInput';
import { jumpStart } from "./behaviors/jumpStart";
import { move } from './behaviors/move';
import { rotateAround } from './behaviors/rotate';
import { cameraPointerLock } from "@xr3ngine/engine/src/camera/behaviors/cameraPointerLock";
import { getInCar } from '@xr3ngine/engine/src/physics/behaviors/getInCarBehavior';
import { setArcadeVelocityTarget } from './behaviors/setArcadeVelocityTarget';

export const CharacterInputSchema: InputSchema = {
  // When an Input component is added, the system will call this array of behaviors
  onAdded: [
    {
      behavior: disableScroll
    }
  ],
  // When an Input component is removed, the system will call this array of behaviors
  onRemoved: [
    {
      behavior: enableScroll
    }
  ],
  // When the input component is added or removed, the system will bind/unbind these events to the DOM
  eventBindings: {
    // Mouse
    contextmenu: [
      {
        behavior: preventDefault
      }
    ],
    mousemove: [
      {
        behavior: handleMouseMovement,
        args: {
          value: DefaultInput.SCREENXY
        }
      }
    ],
    mouseup: [
      {
        behavior: handleMouseButton,
        args: {
          value: BinaryValue.OFF
        }
      }
    ],
    mousedown: [
      {
        behavior: handleMouseButton,
        args: {
          value: BinaryValue.ON
        }
      }
    ],

    // Touch
    touchstart: [
      {
        behavior: handleTouch,
        args: {
          value: BinaryValue.ON
        }
      }
    ],
    touchend: [
      {
        behavior: handleTouch,
        args: {
          value: BinaryValue.OFF
        }
      }
    ],
    touchcancel: [
      {
        behavior: handleTouch,
        args: {
          value: BinaryValue.OFF
        }
      }
    ],
    touchmove: [
      {
        behavior: handleTouchMove
      }
    ],

    // Keys
    keyup: [
      {
        behavior: handleKey,
        args: {
          value: BinaryValue.OFF
        }
      }
    ],
    keydown: [
      {
        behavior: handleKey,
        args: {
          value: BinaryValue.ON
        }
      }
    ],
    // Gamepad
    gamepadconnected: [
      {
        behavior: handleGamepadConnected
      }
    ],
    gamepaddisconnected: [
      {
        behavior: handleGamepadDisconnected
      }
    ]
  },
  // Map mouse buttons to abstract input
  mouseInputMap: {
    buttons: {
      [MouseInput.LeftButton]: DefaultInput.PRIMARY,
      [MouseInput.RightButton]: DefaultInput.SECONDARY,
      [MouseInput.MiddleButton]: DefaultInput.INTERACT
    },
    axes: {
      [MouseInput.MouseMovement]: DefaultInput.MOUSE_MOVEMENT,
      [MouseInput.MousePosition]: DefaultInput.SCREENXY,
      [MouseInput.MouseClickDownPosition]: DefaultInput.SCREENXY_START,
      [MouseInput.MouseClickDownTransformRotation]: DefaultInput.ROTATION_START
    }
  },
  // Map gamepad buttons to abstract input
  gamepadInputMap: {
    buttons: {
      [GamepadButtons.A]: DefaultInput.JUMP,
      [GamepadButtons.B]: DefaultInput.CROUCH, // B - back
      // [GamepadButtons.X]: DefaultInput.SPRINT, // X - secondary input
      // [GamepadButtons.Y]: DefaultInput.INTERACT, // Y - tertiary input
      // 4: DefaultInput.DEFAULT, // LB
      // 5: DefaultInput.DEFAULT, // RB
      // 6: DefaultInput.DEFAULT, // LT
      // 7: DefaultInput.DEFAULT, // RT
      // 8: DefaultInput.DEFAULT, // Back
      // 9: DefaultInput.DEFAULT, // Start
      // 10: DefaultInput.DEFAULT, // LStick
      // 11: DefaultInput.DEFAULT, // RStick
      [GamepadButtons.DPad1]: DefaultInput.FORWARD, // DPAD 1
      [GamepadButtons.DPad2]: DefaultInput.BACKWARD, // DPAD 2
      [GamepadButtons.DPad3]: DefaultInput.LEFT, // DPAD 3
      [GamepadButtons.DPad4]: DefaultInput.RIGHT // DPAD 4
    },
    axes: {
      [Thumbsticks.Left]: DefaultInput.MOVEMENT_PLAYERONE,
      [Thumbsticks.Right]: DefaultInput.LOOKTURN_PLAYERONE
    }
  },
  // Map keyboard buttons to abstract input
  keyboardInputMap: {
    w: DefaultInput.FORWARD,
    a: DefaultInput.LEFT,
    s: DefaultInput.BACKWARD,
    d: DefaultInput.RIGHT,
    ' ': DefaultInput.JUMP,
    p: DefaultInput.POINTER_LOCK,
    c: DefaultInput.SWITCH_CAR
    },
  // Map how inputs relate to each other
  inputRelationships: {
    [DefaultInput.FORWARD]: { opposes: [DefaultInput.BACKWARD] } as InputRelationship,
    [DefaultInput.BACKWARD]: { opposes: [DefaultInput.FORWARD] } as InputRelationship,
    [DefaultInput.LEFT]: { opposes: [DefaultInput.RIGHT] } as InputRelationship,
    [DefaultInput.RIGHT]: { opposes: [DefaultInput.LEFT] } as InputRelationship,
    [DefaultInput.JUMP]: { } as InputRelationship
  },
  // "Button behaviors" are called when button input is called (i.e. not axis input)
  inputButtonBehaviors: {
    [DefaultInput.SWITCH_CAR]: {
      [BinaryValue.ON]: {
        started: [
           {
             behavior: getInCar,
             args: {}
           }
        ]
      }
    },
    [DefaultInput.POINTER_LOCK]: {
      [BinaryValue.ON]: {
        started: [
           {
             behavior: cameraPointerLock,
             args: {}
           }
        ]
      }
    },
    [DefaultInput.JUMP]: {
      [BinaryValue.ON]: {
        started: [
        ]
      }
    },
    [DefaultInput.FORWARD]: {
      [BinaryValue.ON]: {
        started: [
          {
            behavior: setArcadeVelocityTarget,
            args: {
              z: 1
            }
          }
          // {
          //   behavior: updateMovementState
          // }
        ],
        continued: [
          {
            behavior: setArcadeVelocityTarget,
            args: {
              z: 1
            }
          }
        ]
      },
      [BinaryValue.OFF]: {
        started: [
        ],
        continued: [
        ]
      }
    },
    [DefaultInput.BACKWARD]: {
      [BinaryValue.ON]: {
        started: [
          // {
          //   behavior: updateMovementState
          // },
          {
            behavior: setArcadeVelocityTarget,
            args: {
              z: -1
            }
          }
        ],
        continued: [
          {
            behavior: setArcadeVelocityTarget,
            args: {
              z: -1
            }
          }
        ]
      },
      [BinaryValue.OFF]: {
        started: [
        ],
        continued: [
        ]
      }
    },
    [DefaultInput.LEFT]: {
      [BinaryValue.ON]: {
        started: [
          // {
          //   behavior: updateMovementState
          // },
          {
            behavior: setArcadeVelocityTarget,
            args: {
              x: 1
            }
          }
        ],
        continued: [
          {
            behavior: setArcadeVelocityTarget,
            args: {
              x: 1
            }
          }
        ]
      },
      [BinaryValue.OFF]: {
        started: [
        ],
        continued: [
        ]
      }
    },
    [DefaultInput.RIGHT]: {
      [BinaryValue.ON]: {
        started: [
          // {
          //   behavior: updateMovementState
          // },
          {
            behavior: setArcadeVelocityTarget,
            args: {
              x: -1
            }
          }
        ],
        continued: [
          {
            behavior: setArcadeVelocityTarget,
            args: {
              x: -1
            }
          }
        ]
      },
      [BinaryValue.OFF]: {
        started: [
        ],
        continued: [
        ]
      }
    }
  },
  // Axis behaviors are called by continuous input and map to a scalar, vec2 or vec3
  inputAxisBehaviors: {
    [DefaultInput.MOVEMENT_PLAYERONE]: {
      started: [
      ],
      continued: [
      ]
    },
    [DefaultInput.SCREENXY]: {
      started: [
      ]
    }
  }
};
