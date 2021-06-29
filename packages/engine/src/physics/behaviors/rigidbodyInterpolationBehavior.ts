import { Behavior } from "../../common/interfaces/Behavior";
import { Entity } from "../../ecs/classes/Entity";
import { getMutableComponent } from "../../ecs/functions/EntityFunctions";
import { Network } from "../../networking/classes/Network";
import { SnapshotData } from "../../networking/types/SnapshotDataTypes";
import { ColliderComponent } from "../components/ColliderComponent";
import { findInterpolationSnapshot } from "./findInterpolationSnapshot";

/**
 * @author HydraFire <github.com/HydraFire>
 * Interpolates the rigidbody's transform with the interpolated snapshots
 * @param {Entity} entity the entity belonging to the rigidbody
 * @param {SnapshotData} snapshots the snapshot data to use
 * @param {number} delta the delta of this frame
 */

export const rigidbodyInterpolationBehavior: Behavior = (entity: Entity, snapshots: SnapshotData, delta): void => {

  const collider = getMutableComponent(entity, ColliderComponent);
  const interpolationSnapshot = findInterpolationSnapshot(entity, snapshots.interpolation) ?? findInterpolationSnapshot(entity, Network.instance.snapshot);

  if (interpolationSnapshot == null) return;

  collider.body.updateTransform({
    translation: {
      x: interpolationSnapshot.x,
      y: interpolationSnapshot.y,
      z: interpolationSnapshot.z,
    },
    rotation: {
      x: interpolationSnapshot.qX,
      y: interpolationSnapshot.qY,
      z: interpolationSnapshot.qZ,
      w: interpolationSnapshot.qW
    },
    linearVelocity: {
      x: interpolationSnapshot.vX,
      y: interpolationSnapshot.vY,
      z: interpolationSnapshot.vZ,
    }
  })

  collider.velocity.set(
    interpolationSnapshot.vX,
    interpolationSnapshot.vY,
    interpolationSnapshot.vZ
  );

};
