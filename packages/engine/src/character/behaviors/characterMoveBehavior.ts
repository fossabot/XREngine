import { Vector3, Matrix4, Quaternion } from 'three';

import { applyVectorMatrixXZ } from '../../common/functions/applyVectorMatrixXZ';
import { Entity } from '../../ecs/classes/Entity';
import { getComponent, getMutableComponent } from '../../ecs/functions/EntityFunctions';

import { Input } from '../../input/components/Input';
import { BinaryValue } from "../../common/enums/BinaryValue";
import { BaseInput } from '../../input/enums/BaseInput';

import { ControllerColliderComponent } from '../components/ControllerColliderComponent';
import { CharacterComponent } from '../components/CharacterComponent';
import { TransformComponent } from '../../transform/components/TransformComponent';
import { XRUserSettings, XR_FOLLOW_MODE } from '../../xr/types/XRUserSettings';
import { isInXR } from '../../xr/functions/WebXRFunctions';
import { SIXDOFType } from '../../common/types/NumericalTypes';

/**
 * @author HydraFire <github.com/HydraFire>
 */

const forwardVector = new Vector3(0, 0, 1);
const upVector = new Vector3(0, 1, 0);
const camVector = new Vector3(0, 0, -1);
const quat = new Quaternion();
const quat2 = new Quaternion();

export const characterMoveBehavior = (entity: Entity, deltaTime): void => {
  const actor: CharacterComponent = getMutableComponent<CharacterComponent>(entity, CharacterComponent as any);
  const transform: TransformComponent = getMutableComponent<TransformComponent>(entity, TransformComponent as any);
  const collider = getMutableComponent<ControllerColliderComponent>(entity, ControllerColliderComponent);
  if (!actor.initialized || !collider.controller || !actor.movementEnabled) return;

  const newVelocity = new Vector3();
  const onGroundVelocity = new Vector3();
  if (actor.isGrounded) {
    collider.controller.velocity.y = 0;

    actor.velocityTarget.copy(actor.localMovementDirection).multiplyScalar(deltaTime);
    actor.velocitySimulator.target.copy(actor.velocityTarget);
    actor.velocitySimulator.simulate(deltaTime);

    actor.velocity.copy(actor.velocitySimulator.position);
    newVelocity.copy(actor.velocity).multiplyScalar(actor.moveSpeed * actor.speedMultiplier);
    newVelocity.applyQuaternion(transform.rotation)

    if(isInXR(entity)) {
      // Apply head direction
      const input = getComponent<Input>(entity, Input as any);
      const headTransform = input.data.get(BaseInput.XR_HEAD);
      if(!headTransform?.value) return
      const sixdof = headTransform.value as SIXDOFType;
      quat.set(sixdof.qX, sixdof.qY, sixdof.qZ, sixdof.qW);
      // actor.localMovementDirection.applyQuaternion(quat);
      newVelocity.applyQuaternion(quat);
    }

    if (actor.closestHit) {
      onGroundVelocity.copy(newVelocity).setY(0);
      const normal = new Vector3(actor.closestHit.normal.x, actor.closestHit.normal.y, actor.closestHit.normal.z);
      const q = new Quaternion().setFromUnitVectors(upVector, normal);
      const m = new Matrix4().makeRotationFromQuaternion(q);
      onGroundVelocity.applyMatrix4(m);
    }
    collider.controller.velocity.x = newVelocity.x;
    collider.controller.velocity.y = onGroundVelocity.y;
    collider.controller.velocity.z = newVelocity.z;


    if (actor.isJumping) {
      collider.controller.velocity.y -= 0.2;
    //  collider.controller.resize(actor.BODY_SIZE);
      actor.isJumping = false;
    }

    if (actor.localMovementDirection.y > 0 && !actor.isJumping) {
      collider.controller.velocity.y = actor.jumpHeight * deltaTime;
    //  collider.controller.resize(actor.BODY_SIZE);
      actor.isJumping = true;
      actor.isGrounded = false;
    }
    // TODO - Move on top of moving objects
    // physx has a feature for this, we should integrate both
    // if (actor.rayResult.body.mass > 0) {
    // 	const pointVelocity = new Vec3();
    // 	actor.rayResult.body.getVelocityAtWorldPoint(actor.rayResult.hitPointWorld, pointVelocity);
    // 	newVelocity.add(threeFromCannonVector(pointVelocity));
    // }
  }

  // apply gravity - TODO: improve this
  collider.controller.velocity.y -= 0.2 * deltaTime;

  // move according to controller's velocity
  collider.controller.delta.x += collider.controller.velocity.x;
  collider.controller.delta.y += collider.controller.velocity.y;
  collider.controller.delta.z += collider.controller.velocity.z;
};
