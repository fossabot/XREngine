import { Entity } from '../../../../ecs/classes/Entity';
import { getComponent, hasComponent } from '../../../../ecs/functions/EntityFunctions';
import { Checker } from '../../../../game/types/Checker';
import { GamePlayer } from "../../../../game/components/GamePlayer";
import { NetworkObject } from '../../../../networking/components/NetworkObject';

/**
 * @author HydraFire <github.com/HydraFire>
 */

export const ifOwned: Checker = (entity: Entity, args?: any, entityTarget?: Entity ): any | undefined => {
   if (hasComponent(entity, GamePlayer)) {
      return getComponent(entity, GamePlayer).uuid == getComponent(entityTarget, NetworkObject).ownerId
   } else {
      return getComponent(entity, NetworkObject).ownerId == getComponent(entityTarget, NetworkObject).ownerId
   }
};
   
