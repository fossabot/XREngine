import { Behavior } from '../../common/interfaces/Behavior';
import { Entity } from '../../ecs/classes/Entity';
import { addColliderWithoutEntity } from '../../physics/behaviors/addColliderWithoutEntity';
import { createNetworkRigidBody } from '@xr3ngine/engine/src/interaction/prefabs/NetworkRigidBody';
import { addCollidersToNetworkVehicle } from '@xr3ngine/engine/src/templates/vehicle/prefabs/NetworkVehicle';

export const createCollidersFromSceneData: Behavior = ( entity: Entity, args: any ) => { //{ data:string, type: string,}
  console.log('****** Collider from Scene data: ')
  console.log(args);

  switch (args.objArgs.data) {

    case 'physics':
      addColliderWithoutEntity(
        { type: args.objArgs.type },
        args.objArgs.position,
        args.objArgs.quaternion,
        args.objArgs.scale,
        {
          mesh: null,
          vertices: args.objArgs.vertices,
          indices: args.objArgs.indices
        }
      );
      break;

    case 'dynamic':
      createNetworkRigidBody({
        parameters: {
          type: args.objArgs.type,
          scale: args.objArgs.scale,
          position: args.objArgs.position,
          quaternion: args.objArgs.quaternion,
          mesh: null,
          mass: args.objArgs.mass ?? 1,
          vertices: args.objArgs.vertices,
          indices: args.objArgs.indices
        },
        uniqueId: args.objArgs.sceneEntityId,
        entity: entity
      });
      break;

    case 'vehicle':
      addCollidersToNetworkVehicle({
        parameters: {
          type: args.objArgs.type,
          scale: args.objArgs.scale,
          position: args.objArgs.position,
          quaternion: args.objArgs.quaternion,
          mesh: null,
          mass: args.objArgs.mass ?? 1,
          vertices: args.objArgs.vertices,
          indices: args.objArgs.indices
        },
        entity: entity
      });
      break;

    default:
      console.warn('args.objArgs.data: '+args.objArgs.data);
      break;
  }
};
