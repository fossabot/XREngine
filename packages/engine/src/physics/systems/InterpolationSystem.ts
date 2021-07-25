import { Not } from '../../ecs/functions/ComponentFunctions'
import { System, SystemAttributes } from '../../ecs/classes/System'
import { getMutableComponent } from '../../ecs/functions/EntityFunctions'
import { SystemUpdateType } from '../../ecs/functions/SystemUpdateType'
import { LocalInputReceiver } from '../../input/components/LocalInputReceiver'
import { Network } from '../../networking/classes/Network'
import { Vault } from '../../networking/classes/Vault'
import { NetworkObject } from '../../networking/components/NetworkObject'
import { calculateInterpolation, createSnapshot } from '../../networking/functions/NetworkInterpolationFunctions'
import { ColliderComponent } from '../components/ColliderComponent'
import { InterpolationComponent } from '../components/InterpolationComponent'
import { BodyType } from 'three-physx'
import { findInterpolationSnapshot } from '../behaviors/findInterpolationSnapshot'
import { Vector3 } from 'three'
import { SnapshotData } from '../../networking/types/SnapshotDataTypes'
import { characterCorrectionBehavior } from '../../character/behaviors/characterCorrectionBehavior'
import { CharacterComponent } from '../../character/components/CharacterComponent'
import { characterInterpolationBehavior } from '../../character/behaviors/characterInterpolationBehavior'
import { rigidbodyInterpolationBehavior } from '../behaviors/rigidbodyInterpolationBehavior'
import { LocalInterpolationComponent } from '../components/LocalInterpolationComponent'
import { ControllerColliderComponent } from '../../character/components/ControllerColliderComponent'
import { rigidbodyCorrectionBehavior } from '../behaviors/rigidbodyCorrectionBehavior'

/**
 * @author HydraFire <github.com/HydraFire>
 * @author Josh Field <github.com/HexaField>
 */

const vec3 = new Vector3()

export class InterpolationSystem extends System {
  static instance: InterpolationSystem
  updateType = SystemUpdateType.Fixed

  constructor(attributes: SystemAttributes = {}) {
    super(attributes)
    InterpolationSystem.instance = this
  }

  dispose(): void {
    super.dispose()
  }

  execute(delta: number): void {
    if (!Network.instance?.snapshot) return

    const snapshots: SnapshotData = {
      interpolation: calculateInterpolation('x y z quat velocity'),
      correction: Vault.instance?.get(Network.instance.snapshot.timeCorrection, true),
      new: []
    }

    // Create new snapshot position for next frame server correction
    Vault.instance.add(createSnapshot(snapshots.new))

    this.queryResults.localCharacterInterpolation.all?.forEach((entity) => {
      characterCorrectionBehavior(entity, snapshots, delta)
    })

    this.queryResults.networkClientInterpolation.all?.forEach((entity) => {
      characterInterpolationBehavior(entity, snapshots, delta)
    })

    this.queryResults.networkObjectInterpolation.all?.forEach((entity) => {
      rigidbodyInterpolationBehavior(entity, snapshots, delta)
    })

    this.queryResults.localObjectInterpolation.all?.forEach((entity) => {
      rigidbodyCorrectionBehavior(entity, snapshots, delta)
      // experementalRigidbodyCorrectionBehavior(entity, snapshots, delta);
    })

    // If a networked entity does not have an interpolation component, just copy the data
    this.queryResults.correctionFromServer.all?.forEach((entity) => {
      const snapshot = findInterpolationSnapshot(entity, Network.instance.snapshot)
      if (snapshot == null) return
      const collider = getMutableComponent(entity, ColliderComponent)
      // dynamic objects should be interpolated, kinematic objects should not
      if (collider && collider.body.type !== BodyType.KINEMATIC) {
        collider.velocity.subVectors(collider.body.transform.translation, vec3.set(snapshot.x, snapshot.y, snapshot.z))
        collider.body.updateTransform({
          translation: {
            x: snapshot.x,
            y: snapshot.y,
            z: snapshot.z
          },
          rotation: {
            x: snapshot.qX,
            y: snapshot.qY,
            z: snapshot.qZ,
            w: snapshot.qW
          }
        })
      }
    })
  }
}

InterpolationSystem.queries = {
  localCharacterInterpolation: {
    components: [LocalInputReceiver, ControllerColliderComponent, InterpolationComponent, NetworkObject]
  },
  networkClientInterpolation: {
    components: [Not(LocalInputReceiver), ControllerColliderComponent, InterpolationComponent, NetworkObject]
  },
  localObjectInterpolation: {
    components: [
      Not(CharacterComponent),
      LocalInterpolationComponent,
      InterpolationComponent,
      ColliderComponent,
      NetworkObject
    ]
  },
  networkObjectInterpolation: {
    components: [
      Not(CharacterComponent),
      Not(LocalInterpolationComponent),
      InterpolationComponent,
      ColliderComponent,
      NetworkObject
    ]
  },
  correctionFromServer: {
    components: [Not(InterpolationComponent), NetworkObject]
  }
}
