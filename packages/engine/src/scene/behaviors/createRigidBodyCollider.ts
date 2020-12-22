import { Behavior } from '../../common/interfaces/Behavior';
import { Entity } from '../../ecs/classes/Entity';
import { getComponent, createEntity, addComponent, removeComponent } from '../../ecs/functions/EntityFunctions';
import { TransformComponent } from "@xr3ngine/engine/src/transform/components/TransformComponent";
import { ColliderComponent } from '../../physics/components/ColliderComponent';
import { RigidBody } from '../../physics/components/RigidBody';
import { Vector3 } from 'three';
import { PrefabType } from "@xr3ngine/engine/src/templates/networking/DefaultNetworkSchema";
import { Network } from "@xr3ngine/engine/src/networking/components/Network";
import { initializeNetworkObject } from '@xr3ngine/engine/src/networking/functions/initializeNetworkObject';
import { isServer } from '../../common/functions/isServer';


export const createRigidBodyCollider ( type, position, rotation, scale, mesh ) => {

    const userId = 'server';
    const networkObject = initializeNetworkObject(userId, Network.getNetworkId(), PrefabType.worldObject);
    const transform = getComponent(networkObject2.entity, TransformComponent);

    // Add the network object to our list of network objects
    Network.instance.networkObjects[networkObject.networkId] = {
        ownerId: userId, // Owner's socket ID
        prefabType: PrefabType.worldObject, // All network objects need to be a registered prefab
        component: networkObject
    };

    // Added new object to the worldState with networkId and ownerId
    Network.instance.createObjects.push({
        networkId: networkObject.networkId,
        ownerId: userId,
        prefabType: PrefabType.worldObject,
        x: position.x,
        y: position.y,
        z: position.z,
        qX: rotation.x,
        qY: rotation.y,
        qZ: rotation.z,
        qW: rotation.w
    });
};
