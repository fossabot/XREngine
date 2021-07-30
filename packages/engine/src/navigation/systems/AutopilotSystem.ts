import { System } from '../../ecs/classes/System'
import { SystemUpdateType } from '../../ecs/functions/SystemUpdateType'
import { EntityManager, NavMesh, Vector3 as YukaVector3, Path } from 'yuka'
import { AutoPilotRequestComponent } from '../component/AutoPilotRequestComponent'
import { AutoPilotComponent } from '../component/AutoPilotComponent'
import {
  addComponent,
  getComponent,
  getMutableComponent,
  hasComponent,
  removeComponent
} from '../../ecs/functions/EntityFunctions'
import { TransformComponent } from '../../transform/components/TransformComponent'
import { NavMeshComponent } from '../component/NavMeshComponent'
import { Vector3 } from 'three'
import { Object3DComponent } from '../../scene/components/Object3DComponent'
import { Engine } from '../../ecs/classes/Engine'
import { InputType } from '../../input/enums/InputType'
import { LifecycleValue } from '../../common/enums/LifecycleValue'
import { GamepadAxis } from '../../input/enums/InputEnums'
import { NumericalType } from '../../common/types/NumericalTypes'
import { CharacterComponent } from '../../character/components/CharacterComponent'

const findPath = (navMesh: NavMesh, from: Vector3, to: Vector3): Path => {
  const points = navMesh.findPath(new YukaVector3(from.x, from.y, from.z), new YukaVector3(to.x, to.y, to.z))

  const path = new Path()
  for (const point of points) {
    path.add(point)
  }
  return path
}

export class AutopilotSystem extends System {
  updateType = SystemUpdateType.Free
  entityManager: EntityManager
  static instance: AutopilotSystem

  constructor(attributes: SystemAttributes = {}) {
    super(attributes)
    AutopilotSystem.instance = this
    this.entityManager = new EntityManager()
    this.reset()
  }

  reset(): void {}

  dispose(): void {
    super.dispose()
    this.reset()
  }

  execute(delta: number, time: number): void {
    // requests
    // generate path from target.graph and create new AutoPilotComponent (or reuse existing)
    for (const entity of this.queryResults.requests.added) {
      const request = getComponent(entity, AutoPilotRequestComponent)
      const navMeshComponent = getComponent(request.navEntity, NavMeshComponent)
      if (!navMeshComponent) {
        console.error('AutopilotSystem unable to process request - navigation entity does not have NavMeshComponent')
      }

      let autopilotComponent: AutoPilotComponent
      if (hasComponent(entity, AutoPilotComponent)) {
        // reuse component
        autopilotComponent = getMutableComponent(entity, AutoPilotComponent)
      } else {
        autopilotComponent = addComponent(entity, AutoPilotComponent)
      }
      autopilotComponent.navEntity = request.navEntity

      const { position } = getComponent(entity, TransformComponent)
      autopilotComponent.path = findPath(navMeshComponent.yukaNavMesh, position, request.point)

      // TODO: "mount" player? disable movement, etc.

      removeComponent(entity, AutoPilotRequestComponent)
    }

    // ongoing
    if (this.queryResults.ongoing.all.length) {
      // update our entity transform from vehicle
      const stick = GamepadAxis.Left
      this.queryResults.ongoing.all.forEach((entity) => {
        const autopilot = getComponent(entity, AutoPilotComponent)
        const { position: actorPosition } = getComponent(entity, TransformComponent)
        if (autopilot.path.current().distanceTo(actorPosition as any) < 0.2) {
          if (autopilot.path.finished()) {
            // Path is finished!
            Engine.inputState.set(stick, {
              type: InputType.TWODIM,
              value: [0, 0, 0],
              lifecycleState: LifecycleValue.CHANGED
            })

            // Path is finished - remove component
            removeComponent(entity, AutoPilotComponent)
            return
          }
          autopilot.path.advance()
        }

        const actor = getComponent(entity, CharacterComponent)
        const actorViewRotation = Math.atan2(actor.viewVector.x, actor.viewVector.z)

        const targetPosition = new Vector3(autopilot.path.current().x, 0, autopilot.path.current().z)
        const direction = targetPosition
          .sub(actorPosition.clone().setY(0))
          .applyAxisAngle(new Vector3(0, -1, 0), actorViewRotation)
          .normalize()
        // .multiplyScalar(0.6) // speed

        const stickPosition: NumericalType = [direction.z, direction.x, Math.atan2(direction.x, direction.z)]
        // If position not set, set it with lifecycle started
        if (!Engine.inputState.has(stick)) {
          Engine.inputState.set(stick, {
            type: InputType.TWODIM,
            value: stickPosition,
            lifecycleState: LifecycleValue.STARTED
          })
        } else {
          // If position set, check it's value
          const oldStickPosition = Engine.inputState.get(stick)
          // If it's not the same, set it and update the lifecycle value to changed
          if (JSON.stringify(oldStickPosition) !== JSON.stringify(stickPosition)) {
            // console.log('---changed');
            // Set type to TWODIM (two-dimensional axis) and value to a normalized -1, 1 on X and Y
            Engine.inputState.set(stick, {
              type: InputType.TWODIM,
              value: stickPosition,
              lifecycleState: LifecycleValue.CHANGED
            })
          }
        }
      })
    }
  }

  static queries: any = {
    navmeshes: {
      components: [NavMeshComponent, Object3DComponent]
    },
    requests: {
      components: [AutoPilotRequestComponent],
      listen: {
        added: true
      }
    },
    ongoing: {
      components: [AutoPilotComponent],
      listen: {
        added: true,
        removed: true
      }
    }
  }
}
