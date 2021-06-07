import { Matrix4, Quaternion, Vector3 } from "three";
import { addObject3DComponent } from '../../scene/behaviors/addObject3DComponent';
import { CameraTagComponent } from '../../scene/components/Object3DTagComponents';
import { isMobileOrTablet } from "../../common/functions/isMobile";
import { NumericalType, Vector2Type } from "../../common/types/NumericalTypes";
import { Engine } from '../../ecs/classes/Engine';
import { System, SystemAttributes } from '../../ecs/classes/System';
import { addComponent, createEntity, getComponent, getMutableComponent, hasComponent, removeComponent } from '../../ecs/functions/EntityFunctions';
import { CharacterComponent } from "../../character/components/CharacterComponent";
import { DesiredTransformComponent } from '../../transform/components/DesiredTransformComponent';
import { TransformComponent } from '../../transform/components/TransformComponent';
import { CameraComponent } from '../components/CameraComponent';
import { FollowCameraComponent } from '../components/FollowCameraComponent';
import { CameraModes } from "../types/CameraModes";
import { Entity } from "../../ecs/classes/Entity";
import { PhysicsSystem } from "../../physics/systems/PhysicsSystem";
import { RaycastQuery, SceneQueryType } from "three-physx";
import { Not } from "../../ecs/functions/ComponentFunctions";
import { Input } from "../../input/components/Input";
import { BaseInput } from "../../input/enums/BaseInput";
import { PersistTagComponent } from "../../scene/components/PersistTagComponent";
import { SystemUpdateType } from "../../ecs/functions/SystemUpdateType";
import { EngineEvents } from "../../ecs/classes/EngineEvents";

let direction = new Vector3();
const upVector = new Vector3(0, 1, 0);
const forwardVector = new Vector3(0, 0, 1);
const empty = new Vector3();
const PI_2Deg = Math.PI / 180;
const mx = new Matrix4();
const vec3 = new Vector3();

const followCameraBehavior = (entity: Entity) => {
  const cameraDesiredTransform: DesiredTransformComponent = getMutableComponent(CameraSystem.instance.activeCamera, DesiredTransformComponent) as DesiredTransformComponent; // Camera
  const actor: CharacterComponent = getMutableComponent<CharacterComponent>(entity, CharacterComponent as any);
  const actorTransform = getMutableComponent(entity, TransformComponent);

  const followCamera = getMutableComponent<FollowCameraComponent>(entity, FollowCameraComponent) as FollowCameraComponent;

  cameraDesiredTransform.rotationRate = isMobileOrTablet() || followCamera.mode === CameraModes.FirstPerson ? 5 : 3.5
  cameraDesiredTransform.positionRate = isMobileOrTablet() || followCamera.mode === CameraModes.FirstPerson ? 3.5 : 2

  const inputComponent = getComponent(entity, Input) as Input;

  // this is for future integration of MMO style pointer lock controls
  // let inputAxes;
  // if (cameraFollow.mode === CameraModes.FirstPerson || cameraFollow.mode === CameraModes.ShoulderCam) {
  //   inputAxes = BaseInput.MOUSE_MOVEMENT;
  // } else {
    const inputAxes = BaseInput.LOOKTURN_PLAYERONE;
  // }
  const inputValue = inputComponent.data.get(inputAxes)?.value ?? [0, 0] as Vector2Type;

  if(followCamera.locked && actor) {
    followCamera.theta = Math.atan2(actor.orientation.x, actor.orientation.z) * 180 / Math.PI + 180
  }

  followCamera.theta -= inputValue[0] * (isMobileOrTablet() ? 60 : 100);
  followCamera.theta %= 360;

  followCamera.phi -= inputValue[1] * (isMobileOrTablet() ? 60 : 100);
  followCamera.phi = Math.min(85, Math.max(-70, followCamera.phi));
  actor.viewVector.y = followCamera.phi;

  let camDist = followCamera.distance;
  if (followCamera.mode === CameraModes.FirstPerson) camDist = 0.01;
  else if (followCamera.mode === CameraModes.ShoulderCam) camDist = followCamera.minDistance;
  else if (followCamera.mode === CameraModes.TopDown) camDist = followCamera.maxDistance;

  const phi = followCamera.mode === CameraModes.TopDown ? 85 : followCamera.phi;

  let targetPosition;
  if (actor) { // this is for cars
    const shoulderOffsetWorld = followCamera.offset.clone().applyQuaternion(actor.tiltContainer.quaternion);
    targetPosition = actor.tiltContainer.getWorldPosition(vec3).add(shoulderOffsetWorld);
  } else {
    cameraDesiredTransform.rotationRate = 7;
    cameraDesiredTransform.positionRate = 15;
    targetPosition = actorTransform.position;
  }

  // Raycast for camera
  const cameraTransform: TransformComponent = getMutableComponent(CameraSystem.instance.activeCamera, TransformComponent)
  const raycastDirection = new Vector3().subVectors(cameraTransform.position, targetPosition).normalize();
  followCamera.raycastQuery.origin.copy(targetPosition);
  followCamera.raycastQuery.direction.copy(raycastDirection);
  
  const closestHit = followCamera.raycastQuery.hits[0];
  followCamera.rayHasHit = typeof closestHit !== 'undefined';

  if(followCamera.mode !== CameraModes.FirstPerson && followCamera.rayHasHit && closestHit.distance < camDist) {
    if(closestHit.distance < 0.5) {
      camDist = closestHit.distance;
    } else {
      camDist = closestHit.distance - 0.5;
    }
  }

  cameraDesiredTransform.position.set(
      targetPosition.x + camDist * Math.sin(followCamera.theta * PI_2Deg) * Math.cos(phi * PI_2Deg),
      targetPosition.y + camDist * Math.sin(phi * PI_2Deg),
      targetPosition.z + camDist * Math.cos(followCamera.theta * PI_2Deg) * Math.cos(phi * PI_2Deg)
  );

  direction.copy(cameraDesiredTransform.position);
  direction = direction.sub(targetPosition).normalize();

  mx.lookAt(direction, empty, upVector);
  cameraDesiredTransform.rotation.setFromRotationMatrix(mx);
  if (actor) {
    actor.viewVector = vec3.set(0, 0, -1).applyQuaternion(cameraDesiredTransform.rotation)
  } else {
    cameraTransform.rotation.copy(cameraDesiredTransform.rotation);
  }

  // for pointer lock controls
  // if(cameraFollow.mode === CameraModes.FirstPerson || cameraFollow.mode === CameraModes.ShoulderCam) {
  //     cameraTransform.rotation.copy(cameraDesiredTransform.rotation);
  // }
  // if (followCamera.mode === CameraModes.FirstPerson) {
  //   cameraTransform.rotation.copy(cameraDesiredTransform.rotation);
  //   cameraTransform.position.copy(cameraDesiredTransform.position);
  // }
  // apply user input
  
  // rotate character
  if(followCamera.locked || followCamera.mode === CameraModes.FirstPerson || followCamera.mode === CameraModes.XR) {
    actorTransform.rotation.setFromAxisAngle(upVector, (followCamera.theta - 180) * (Math.PI / 180));
    actor.orientation.copy(forwardVector).applyQuaternion(actorTransform.rotation);
    actorTransform.rotation.setFromUnitVectors(forwardVector, actor.orientation.clone().setY(0));
  }
}

/** System class which provides methods for Camera system. */
export class CameraSystem extends System {
  static instance: CameraSystem;
  
  updateType = SystemUpdateType.Free;

  activeCamera: Entity
  prevState = [0, 0] as NumericalType;

  /** Constructs camera system. */
  constructor(attributes: SystemAttributes = {}) {
    super(attributes);
    CameraSystem.instance = this;

    const cameraEntity = createEntity();
    addComponent(cameraEntity, CameraComponent );
    addComponent(cameraEntity, CameraTagComponent );
    addObject3DComponent(cameraEntity, { obj3d: Engine.camera });
    addComponent(cameraEntity, TransformComponent);
    addComponent(cameraEntity, PersistTagComponent);
    CameraSystem.instance.activeCamera = cameraEntity;

    // If we lose focus on the window, and regain it, copy our desired transform to avoid strange transform behavior and clipping
    EngineEvents.instance.addEventListener(EngineEvents.EVENTS.WINDOW_FOCUS, ({ focused }) => {
      if(focused) {
        const transform = getComponent(cameraEntity, TransformComponent);
        const desiredTransform = getComponent(CameraSystem.instance.activeCamera, DesiredTransformComponent) as DesiredTransformComponent;
        if(transform && desiredTransform) {
          followCameraBehavior(getMutableComponent(CameraSystem.instance.activeCamera, CameraComponent).followTarget)
          transform.position.copy(desiredTransform.position);
          transform.rotation.copy(desiredTransform.rotation);
        }
      }
    })
  }

  /**
   * Execute the camera system for different events of queries.\
   * Called each frame by default.
   *
   * @param delta time since last frame.
   */
  execute(delta: number): void {

    this.queryResults.followCameraComponent.added?.forEach(entity => {
      const cameraFollow = getMutableComponent(entity, FollowCameraComponent);
      cameraFollow.raycastQuery = PhysicsSystem.instance.addRaycastQuery(new RaycastQuery({ 
        type: SceneQueryType.Closest,
        origin: new Vector3(),
        direction: new Vector3(0, -1, 0),
        maxDistance: 10,
        collisionMask: cameraFollow.collisionMask,
      }));
      const activeCameraComponent = getMutableComponent(CameraSystem.instance.activeCamera, CameraComponent);
      activeCameraComponent.followTarget = entity;
      if(hasComponent(CameraSystem.instance.activeCamera, DesiredTransformComponent)) removeComponent(CameraSystem.instance.activeCamera, DesiredTransformComponent)
      const desiredTransform = addComponent(CameraSystem.instance.activeCamera, DesiredTransformComponent) as DesiredTransformComponent;
      desiredTransform.lockRotationAxis = [false, true, false];
    });

    this.queryResults.followCameraComponent.removed?.forEach(entity => {
      const cameraFollow = getComponent(entity, FollowCameraComponent, true);
      if (cameraFollow) PhysicsSystem.instance.removeRaycastQuery(cameraFollow.raycastQuery);
      const activeCameraComponent = getMutableComponent(CameraSystem.instance.activeCamera, CameraComponent);
      if (activeCameraComponent) {
        activeCameraComponent.followTarget = null;
        removeComponent(CameraSystem.instance.activeCamera, DesiredTransformComponent) as DesiredTransformComponent;
      }
    });

    // follow camera component should only ever be on the character
    this.queryResults.followCameraComponent.all?.forEach(entity => {
      followCameraBehavior(entity)
    });
  }
}

/**
 * Queries must have components attribute which defines the list of components
 */
CameraSystem.queries = {
  cameraComponent: {
    components: [Not(FollowCameraComponent), CameraComponent, TransformComponent],
    listen: {
      added: true,
      changed: true
    }
  },
  followCameraComponent: {
    components: [FollowCameraComponent, TransformComponent, CharacterComponent],
    listen: {
      added: true,
      changed: true,
      removed: true,
    }
  },
};
