import { BaseInput } from '@xr3ngine/engine/src/input/enums/BaseInput';
import { LifecycleValue } from '../../common/enums/LifecycleValue';
import { Thumbsticks } from '../../common/enums/Thumbsticks';
import { isServer } from '../../common/functions/isServer';
import { isClient } from '../../common/functions/isClient';
import { Behavior } from '../../common/interfaces/Behavior';
import { Entity } from '../../ecs/classes/Entity';
import { getComponent, getMutableComponent } from '../../ecs/functions/EntityFunctions';
import { Input } from "../../input/components/Input";
import { GamepadButtons } from '../../input/enums/GamepadButtons';
import { InputType } from '../../input/enums/InputType';
import { MouseInput } from '../../input/enums/MouseInput';
import { InputRelationship } from '../../input/interfaces/InputRelationship';
import { InputSchema } from '../../input/interfaces/InputSchema';
import { BaseInputSchema } from "../../input/schema/BaseInputSchema";
import { InputAlias } from "../../input/types/InputAlias";
import { Network } from '../../networking/classes/Network';
import { synchronizationComponents } from '../../networking/functions/synchronizationComponents';
import { PlayerInCar } from '../../physics/components/PlayerInCar';
import { VehicleBody } from '../../physics/components/VehicleBody';

const getOutCar: Behavior = (entityCar: Entity): void => {
  let entity = null;
  const vehicle = getComponent(entityCar, VehicleBody);

  let networkPlayerId = null

  if(isServer) {
    networkPlayerId = vehicle.wantsExit.filter(f => f != null)[0]
    console.warn('wantsExit: '+ vehicle.wantsExit);
  } else {
    networkPlayerId = Network.instance.localAvatarNetworkId
  }

  for (let i = 0; i < vehicle.seatPlane.length; i++) {
    if (networkPlayerId == vehicle[vehicle.seatPlane[i]]) {
      entity = Network.instance.networkObjects[networkPlayerId].component.entity;
    }
  }

  getMutableComponent(entity, PlayerInCar).state = 'onStartRemove';
  synchronizationComponents(entity, 'PlayerInCar', { state: 'onStartRemove', whoIsItFor: 'otherPlayers' });

/*
  const event = new CustomEvent('player-in-car', { detail:{inCar:false} });
  document.dispatchEvent(event);
*/
};

const drive: Behavior = (entity: Entity, args: { direction: number }): void => {
  const vehicleComponent = getMutableComponent<VehicleBody>(entity, VehicleBody);
  if(isClient && vehicleComponent.driver != Network.instance.localAvatarNetworkId) return;
  const vehicle = vehicleComponent.vehiclePhysics;

  vehicle.setBrake(0, 0);
  vehicle.setBrake(0, 1);
  vehicle.setBrake(0, 2);
  vehicle.setBrake(0, 3);

  // direction is reversed to match 1 to be forward
  vehicle.applyEngineForce(vehicleComponent.maxForce * args.direction * -1, 2);
  vehicle.applyEngineForce(vehicleComponent.maxForce * args.direction * -1, 3);
  vehicleComponent.isMoved = true;
};

const stop: Behavior = (entity: Entity, args: { direction: number }): void => {
  const vehicleComponent = getMutableComponent<VehicleBody>(entity, VehicleBody);
  vehicleComponent.isMoved = false;
  return;
  if(isClient && vehicleComponent.driver != Network.instance.localAvatarNetworkId) return;
  const vehicle = vehicleComponent.vehiclePhysics;

  vehicle.setBrake(10, 0);
  vehicle.setBrake(10, 1);
  vehicle.setBrake(10, 2);
  vehicle.setBrake(10, 3);

  // direction is reversed to match 1 to be forward
  vehicle.applyEngineForce(0, 2);
  vehicle.applyEngineForce(0, 3);
};

const driveByInputAxis: Behavior = (entity: Entity, args: { input: InputAlias; inputType: InputType }): void => {
  const input =  getComponent<Input>(entity, Input as any);
  const data = input.data.get(args.input);

  const vehicleComponent = getMutableComponent<VehicleBody>(entity, VehicleBody);
  if(isClient && vehicleComponent.driver != Network.instance.localAvatarNetworkId) return;
  const vehicle = vehicleComponent.vehiclePhysics;

  vehicle.setBrake(0, 0);
  vehicle.setBrake(0, 1);
  vehicle.setBrake(0, 2);
  vehicle.setBrake(0, 3);

  if (data.type === InputType.TWODIM) {
    // direction is reversed to match 1 to be forward
    vehicle.applyEngineForce(vehicleComponent.maxForce * data.value[0] * -1, 2);
    vehicle.applyEngineForce(vehicleComponent.maxForce * data.value[0] * -1, 3);

    vehicle.setSteeringValue( vehicleComponent.maxSteerVal * data.value[1], 0);
    vehicle.setSteeringValue( vehicleComponent.maxSteerVal * data.value[1], 1);
  }
  vehicleComponent.isMoved = true;
};

export const driveHandBrake: Behavior = (entity: Entity, args: { on: boolean }): void => {
  const vehicleComponent = getMutableComponent<VehicleBody>(entity, VehicleBody);
  if(isClient && vehicleComponent.driver != Network.instance.localAvatarNetworkId) return;
  const vehicle = vehicleComponent.vehiclePhysics;

  vehicle.setBrake(args.on? 10 : 0, 0);
  vehicle.setBrake(args.on? 10 : 0, 1);
  vehicle.setBrake(args.on? 10 : 0, 2);
  vehicle.setBrake(args.on? 10 : 0, 3);
};

const driveSteering: Behavior = (entity: Entity, args: { direction: number }): void => {

  const vehicleComponent = getMutableComponent<VehicleBody>(entity, VehicleBody);
  if(isClient && vehicleComponent.driver != Network.instance.localAvatarNetworkId) return;
  const vehicle = vehicleComponent.vehiclePhysics;

  vehicle.setSteeringValue( vehicleComponent.maxSteerVal * args.direction, 0);
  vehicle.setSteeringValue( vehicleComponent.maxSteerVal * args.direction, 1);

};


export const VehicleInputSchema: InputSchema = {
  ...BaseInputSchema,
  // Map mouse buttons to abstract input
  mouseInputMap: {
    buttons: {
      [MouseInput.LeftButton]: BaseInput.PRIMARY,
    //  [MouseInput.LeftButton]: BaseInput.INTERACT,
      [MouseInput.RightButton]: BaseInput.SECONDARY,
      [MouseInput.MiddleButton]: BaseInput.INTERACT
    },
    axes: {
      [MouseInput.MouseMovement]: BaseInput.MOUSE_MOVEMENT,
      [MouseInput.MousePosition]: BaseInput.SCREENXY,
      [MouseInput.MouseClickDownPosition]: BaseInput.SCREENXY_START,
      [MouseInput.MouseClickDownTransformRotation]: BaseInput.ROTATION_START,
      [MouseInput.MouseClickDownMovement]: BaseInput.LOOKTURN_PLAYERONE,
      [MouseInput.MouseScroll]: BaseInput.CAMERA_SCROLL
    }
  },
  // Map gamepad buttons to abstract input
  gamepadInputMap: {
    buttons: {
      [GamepadButtons.A]: BaseInput.JUMP,
      [GamepadButtons.B]: BaseInput.CROUCH, // B - back
      [GamepadButtons.X]: BaseInput.WALK, // X - secondary input
      [GamepadButtons.Y]: BaseInput.INTERACT, // Y - tertiary input
      // 4: BaseInput.DEFAULT, // LB
      // 5: BaseInput.DEFAULT, // RB
      // 6: BaseInput.DEFAULT, // LT
      // 7: BaseInput.DEFAULT, // RT
      // 8: BaseInput.DEFAULT, // Back
      // 9: BaseInput.DEFAULT, // Start
      // 10: BaseInput.DEFAULT, // LStick
      // 11: BaseInput.DEFAULT, // RStick
      [GamepadButtons.DPad1]: BaseInput.FORWARD, // DPAD 1
      [GamepadButtons.DPad2]: BaseInput.BACKWARD, // DPAD 2
      [GamepadButtons.DPad3]: BaseInput.LEFT, // DPAD 3
      [GamepadButtons.DPad4]: BaseInput.RIGHT // DPAD 4
    },
    axes: {
      [Thumbsticks.Left]: BaseInput.MOVEMENT_PLAYERONE,
      [Thumbsticks.Right]: BaseInput.LOOKTURN_PLAYERONE
    }
  },
  // Map keyboard buttons to abstract input
  keyboardInputMap: {
    w: BaseInput.FORWARD,
    a: BaseInput.LEFT,
    s: BaseInput.BACKWARD,
    d: BaseInput.RIGHT,
    ' ': BaseInput.JUMP,
    shift: BaseInput.CROUCH,
    p: BaseInput.POINTER_LOCK,
    e: BaseInput.INTERACT,
    c: BaseInput.SECONDARY
  },
  // Map how inputs relate to each other
  inputRelationships: {
    [BaseInput.FORWARD]: {opposes: [BaseInput.BACKWARD]} as InputRelationship,
    [BaseInput.BACKWARD]: {opposes: [BaseInput.FORWARD]} as InputRelationship,
    [BaseInput.LEFT]: {opposes: [BaseInput.RIGHT]} as InputRelationship,
    [BaseInput.RIGHT]: {opposes: [BaseInput.LEFT]} as InputRelationship,
    [BaseInput.CROUCH]: {blockedBy: [BaseInput.JUMP, BaseInput.WALK]} as InputRelationship,
    [BaseInput.JUMP]: {overrides: [BaseInput.CROUCH]} as InputRelationship
  },
  // "Button behaviors" are called when button input is called (i.e. not axis input)
  inputButtonBehaviors: {
    [BaseInput.SECONDARY]: {
      ended: [
      ]
    },
    [BaseInput.INTERACT]:  {
      started: [
        {
          behavior: getOutCar,
          args: {
            phase:LifecycleValue.STARTED
          }
        }
      ]
    },
    [BaseInput.FORWARD]: {
      started: [
        {
          behavior: drive,
          args: {
            direction: 1
          }
        }
      ],
      continued: [
        {
          behavior: drive,
          args: {
            direction: 1
          }
        }
      ],
      ended: [
        {
          behavior: stop,
          args: {
            direction: 0
          }
        }
      ]
    },
    [BaseInput.BACKWARD]: {
      started: [
        {
          behavior: drive,
          args: {
            direction: -1
          }
        }
      ],
      continued: [
        {
          behavior: drive,
          args: {
            direction: -1
          }
        }
      ],
      ended: [
        {
          behavior: stop,
          args: {
            direction: 0
          }
        }
      ]
    },
    [BaseInput.LEFT]: {
      started: [
        {
          behavior: driveSteering,
          args: {
            direction: 1
          }
        }
      ],
      continued: [
        {
          behavior: driveSteering,
          args: {
            direction: 1
          }
        }
      ],
      ended: [
        {
          behavior: driveSteering,
          args: {
            direction: 0
          }
        }
      ]
    },
    [BaseInput.RIGHT]: {
      started: [
        {
          behavior: driveSteering,
          args: {
            direction: -1
          }
        }
      ],
      continued: [
        {
          behavior: driveSteering,
          args: {
            direction: -1
          }
        }
      ],
      ended: [
        {
          behavior: driveSteering,
          args: {
            direction: 0
          }
        }
      ]
    },
    [BaseInput.JUMP]: {
      started: [
        {
          behavior: driveHandBrake,
          args: {
            on: true
          }
        }
      ],
      continued: [
        {
          behavior: driveHandBrake,
          args: {
            on: true
          }
        }
      ],
      ended: [
        {
          behavior: driveHandBrake,
          args: {
            on: false
          }
        }
      ],
    },
  },
  // Axis behaviors are called by continuous input and map to a scalar, vec2 or vec3
  inputAxisBehaviors: {
    [BaseInput.MOVEMENT_PLAYERONE]: {
      started: [
        {
          behavior: driveByInputAxis,
          args: {
            input: BaseInput.MOVEMENT_PLAYERONE,
            inputType: InputType.TWODIM
          }
        }
      ],
      changed: [
        {
          behavior: driveByInputAxis,
          args: {
            input: BaseInput.MOVEMENT_PLAYERONE,
            inputType: InputType.TWODIM
          }
        }
      ]
    }
  }
};
