import { Behavior } from '../../../../common/interfaces/Behavior';
import { Entity } from '../../../../ecs/classes/Entity';
import { Body, BodyType, createShapeFromConfig, Shape, SHAPES, Transform } from 'three-physx';
import { PhysicsSystem } from '../../../../physics/systems/PhysicsSystem';
import { getStorage, setStorage } from '../../../functions/functionsStorage';
import { createNetworkRigidBody } from '../../../../interaction/prefabs/NetworkRigidBody';
import { addComponent } from '../../../../ecs/functions/EntityFunctions';
import { onInteraction, onInteractionHover } from '../../../../scene/behaviors/createCommonInteractive';
import { Interactable } from '../../../../interaction/components/Interactable';
import { TransformComponent } from '../../../../transform/components/TransformComponent';
import { CollisionGroups } from '../../../../physics/enums/CollisionGroups';
import { GameObject } from "../../../components/GameObject";
/**
 * @author HydraFire <github.com/HydraFire>
 */

export const addClub: Behavior = (entity: Entity, args?: any, delta?: number, entityTarget?: Entity, time?: number, checks?: any): void => {
  const uuid = getComponent(entity, GameObject).uuid;
  const storageTransform = getStorage(entity, TransformComponent);
  const pos = storageTransform.position ?? { x:0, y:0, z:0 };
  const rot = storageTransform.rotation ?? { x:0, y:0, z:0, w:1 };
  const scale = storageTransform.scale  ?? { x:1, y:1, z:1 };

  const shapeHandle: Shape = createShapeFromConfig({
    shape: SHAPES.Box,
    options: { boxExtents: { x: 0.05, y: 0.05, z: 0.25 } },
    config: {
      collisionLayer: CollisionGroups.Default,
      collisionMask: CollisionGroups.All
    }
  });
  const shapeHead: Shape = createShapeFromConfig({
    shape: SHAPES.Box,
    options: { boxExtents: { x: 0.05, y: 0.1, z: 0.05 } },
    transform: new Transform({
      translation: { x: pos.x, y: pos.y, z: pos.z },
      rotation: { x: rot.x, y: rot.y, z: rot.z, w: rot.w },
      scale: { x: scale.x, y: scale.y, z: scale.z },
      linearVelocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 }
    }),
    config: {
      collisionLayer: CollisionGroups.Default,
      collisionMask: CollisionGroups.All
    }
  });

  const body = new Body({
    shapes: [shapeHandle, shapeHead],
    type: BodyType.DYNAMIC,
    transform: new Transform(),
  });

  PhysicsSystem.instance.addBody(body);

  createNetworkRigidBody({
    entity,
    parameters: { body, bodytype: BodyType.KINEMATIC },
    uniqueId: uuid
  })
};
