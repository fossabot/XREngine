/**
 * @author HydraFire <github.com/HydraFire>
 */

import { Behavior } from '../../common/interfaces/Behavior'
import { Entity } from '../../ecs/classes/Entity'
import { getComponent } from '../../ecs/functions/EntityFunctions'
import { Network } from '../../networking/classes/Network'
import { NetworkObject } from '../../networking/components/NetworkObject'
import { findInterpolationSnapshot } from '../../physics/behaviors/findInterpolationSnapshot'
import { ControllerColliderComponent } from '../components/ControllerColliderComponent'
import { SnapshotData } from '../../networking/types/SnapshotDataTypes'
import { Vector3 } from 'three'
import { CharacterComponent } from '../components/CharacterComponent'

/**
 * @author HydraFire <github.com/HydraFire>
 * Interpolates the local client's character transform with the interpolated snapshots
 * @param {Entity} entity the entity belonging to the character
 * @param {SnapshotData} snapshots the snapshot data to use
 * @param {number} delta the delta of this frame
 */

const vec3 = new Vector3()

export const characterCorrectionBehavior: Behavior = (entity: Entity, snapshots: SnapshotData, delta: number): void => {
  const collider = getComponent(entity, ControllerColliderComponent)
  const actor = getComponent(entity, CharacterComponent)
  const networkId = getComponent(entity, NetworkObject).networkId

  snapshots.new.push({
    networkId,
    x: collider.controller.transform.translation.x,
    y: collider.controller.transform.translation.y - actor.actorHalfHeight,
    z: collider.controller.transform.translation.z,
    qX: 0, // physx controllers dont have rotation
    qY: 0,
    qZ: 0,
    qW: 1
  })

  const correction = findInterpolationSnapshot(entity, snapshots.correction)
  const currentSnapshot = findInterpolationSnapshot(entity, Network.instance.snapshot)

  if (correction == null || currentSnapshot == null || Network.instance.snapshot.timeCorrection === 0) return

  const offsetX = correction.x - currentSnapshot.x
  const offsetY = correction.y - currentSnapshot.y
  const offsetZ = correction.z - currentSnapshot.z

  // user is too far away, such as falling through the world, reset them to where the server says they are
  if (vec3.set(offsetX, offsetY, offsetZ).lengthSq() > 5) {
    collider.controller.updateTransform({
      translation: {
        x: currentSnapshot.x,
        y: currentSnapshot.y + actor.actorHalfHeight,
        z: currentSnapshot.z
      }
    })
  } else {
    // otherwise move them slowly towards their true position
    collider.controller.delta.x -= offsetX * delta
    collider.controller.delta.y -= offsetY * delta
    collider.controller.delta.z -= offsetZ * delta
  }
}
