import { Vector3, Quaternion } from 'three';
import { Behavior } from '../../../../common/interfaces/Behavior';
import { Entity } from '../../../../ecs/classes/Entity';
import { addComponent, getComponent, getMutableComponent } from "../../../../ecs/functions/EntityFunctions";
import { GamePlayer } from "../../../components/GamePlayer";
import { Interactable } from "../../../../interaction/components/Interactable";
import { NetworkObject } from '../../../../networking/components/NetworkObject';
import { UserControlledColliderComponent } from '../../../../physics/components/UserControllerObjectComponent';

/**
 * @author Josh Field <github.com/HexaField>
 */

export const setEntityPlayerOwned: Behavior = (entity: Entity, args?: any, delta?: number, entityTarget?: Entity, time?: number, checks?: any): void => {
  const networkObject = getComponent(entity, NetworkObject);
  console.log(networkObject);
};