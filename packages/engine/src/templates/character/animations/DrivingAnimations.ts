import { Behavior } from '../../../common/interfaces/Behavior';
import { Vector3 } from "three";
import { Network } from '../../../networking/classes/Network';
import { getComponent, hasComponent, getMutableComponent } from '../../../ecs/functions/EntityFunctions';
import { TransformComponent } from '../../../transform/components/TransformComponent';
import { CharacterAnimations } from "../CharacterAnimations";
import { CharacterComponent } from '../components/CharacterComponent';
import { isMobileOrTablet } from '../../../common/functions/isMobile';
import { NumericalType } from '../../../common/types/NumericalTypes';
import { Input } from '../../../input/components/Input';
import { LifecycleValue } from '../../../common/enums/LifecycleValue';
import { FollowCameraComponent } from '../../../camera/components/FollowCameraComponent';
import { PlayerInCar } from '../../../physics/components/PlayerInCar';
import { BaseInput } from '../../../input/enums/BaseInput';
import { CameraModes } from '../../../camera/types/CameraModes';
import { AnimationComponent } from '../components/AnimationComponent';
import { defaultAvatarAnimations } from '../CharacterAvatars';

/**
 * @author HydraFire <github.com/HydraFire>
 */

let prevState;
const emptyInputValue = [0, 0] as NumericalType;
/**
 * Get Input data from the device.
 *
 * @param inputComponent Input component which is holding input data.
 * @param inputAxes Axes of the input.
 * @param prevValue
 *
 * @returns Input value from input component.
 */
 const getInputData = (inputComponent: Input, inputAxes: number, prevValue: NumericalType ): {
  currentInputValue: NumericalType;
  inputValue: NumericalType
} => {
  const result = {
    currentInputValue: emptyInputValue,
    inputValue: emptyInputValue,
  }
  if (!inputComponent?.data.has(inputAxes)) return result;

  const inputData = inputComponent.data.get(inputAxes);
  result.currentInputValue = inputData.value;
  result.inputValue = inputData.lifecycleState === LifecycleValue.ENDED ||
    JSON.stringify(result.currentInputValue) === JSON.stringify(prevValue)
      ? emptyInputValue : result.currentInputValue;
  return result;
}
/*
const downVector = new Vector3(0, -1, 0)
const leftVector = new Vector3(1, 0, 0);
const upVector = new Vector3(0, 1, 0);
const forwardVector = new Vector3(0, 0, 1);
const emptyVector = new Vector3();

const halfPI = Math.PI / 2;
*/

const { DRIVING, ENTERING_VEHICLE, EXITING_VEHICLE } = CharacterAnimations;

const drivingAnimationSchema = [
  {
    type: [DRIVING], name: defaultAvatarAnimations[DRIVING].name, axis: 'xyz', speed: 1, customProperties: ['weight', 'test'],
    value:      [ -0.5, 0, 0.5 ],
    weight:     [  0 ,  0,   0 ],
    test:       [  0 ,  1,   0 ]
  },{
    type: [ENTERING_VEHICLE], name: defaultAvatarAnimations[ENTERING_VEHICLE].name, axis:'z', speed: 0.5, customProperties: ['weight', 'test'],
    value:      [  0,   1 ],
    weight:     [  1,   0 ],
    test:       [  0,   1 ]
  },
  {
    type: [EXITING_VEHICLE], name: defaultAvatarAnimations[EXITING_VEHICLE].name, axis:'z', speed: 0.5, customProperties: ['weight', 'test'],
    value:      [  -1  ,   0  ],
    weight:     [   1  ,   1  ],
    test:       [   0  ,   0  ]
  }
];


const customVector = new Vector3(0,0,0);
const getDrivingValues: Behavior = (entity, args: {}, deltaTime: number): any => {

/*
  const networkDriverId = getComponent<NetworkObject>(entity, NetworkObject).networkId;
  const vehicle = getMutableComponent<VehicleComponent>(entityCar, VehicleComponent);
  vehicle[vehicle.seatPlane[seat]] = networkDriverId;
  */
  const actor = getMutableComponent<CharacterComponent>(entity, CharacterComponent as any);
	const playerInCar = getComponent<PlayerInCar>(entity, PlayerInCar as any);
  const testDrive = playerInCar.networkCarId != undefined;
  const entityCar = Network.instance.networkObjects[playerInCar.networkCarId].component.entity;
//  const actor = getMutableComponent<CharacterComponent>(entity, CharacterComponent as any);
//  PhysicsSystem.instance.removeBody(actor.actorCapsule.body);

  //const orientation = positionEnter(entity, entityCar, seat);
  //getMutableComponent(entity, PlayerInCar).state = 'onAddInCar';

   // going to animation clip behavior for set values to animations
   // any parameters
   // simulate rayCastHit as vectorY from 1 to 0, for smooth changes
  //  absSpeed = MathUtils.smoothstep(absSpeed, 0, 1);
   actor.moveVectorSmooth.target.copy(actor.animationVelocity);
   actor.moveVectorSmooth.simulate(deltaTime);
   const actorVelocity = actor.moveVectorSmooth.position;

   customVector.setY(testDrive ? 0 : 1);
   actor.animationVectorSimulator.target.copy(customVector);
   actor.animationVectorSimulator.simulate(deltaTime);
   let test = actor.animationVectorSimulator.position.y;

   test < 0.00001 ? test = 0:'';
   test = Math.min(test, 1);

   return { actorVelocity, test };
}

export const initializeDriverState: Behavior = (entity, args: { x?: number, y?: number, z?: number }) => {

  if(hasComponent(entity, AnimationComponent)) {
    const animComponent = getMutableComponent(entity, AnimationComponent);
    animComponent.animationsSchema = drivingAnimationSchema;
    animComponent.updateAnimationsValues = getDrivingValues;
  }

	const actor = getMutableComponent<CharacterComponent>(entity, CharacterComponent as any);
	if (!actor.initialized) return;

	actor.velocityTarget.z = args?.z ?? 0;
	actor.velocityTarget.x = args?.x ?? 0;
	actor.velocityTarget.y = args?.y ?? 0;
  actor.movementEnabled = false;
};
