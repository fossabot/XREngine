import { Entity } from "../../ecs/classes/Entity";
import { Network } from "../../networking/classes/Network";
import { NetworkObjectEditInterface } from "../../networking/interfaces/WorldState";
import { EquippedStateUpdateSchema } from "../enums/EquippedEnums";
import { equipEntity, unequipEntity } from "./equippableFunctions";

export const handleObjectEquipped = (editObject: NetworkObjectEditInterface): void => {
  
  const [isEquipped, equippedEntityId] = editObject.values as EquippedStateUpdateSchema;
  if(!Network.instance.networkObjects[editObject.networkId] || !Network.instance.networkObjects[equippedEntityId]) return;
  const entityEquipper: Entity = Network.instance.networkObjects[editObject.networkId].component.entity;
  console.log(editObject)
  if(isEquipped) {
    const entityEquipped = Network.instance.networkObjects[equippedEntityId].component.entity;
    equipEntity(entityEquipper, entityEquipped);
  } else {
    unequipEntity(entityEquipper);
  }
}