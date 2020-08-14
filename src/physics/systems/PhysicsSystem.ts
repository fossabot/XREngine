import { Quaternion } from "cannon-es/src/math/Quaternion"
import { RigidBody } from "../components/RigidBody"
import { Collider } from "../components/Collider"
import { VehicleBody } from "../components/VehicleBody"
import { WheelBody } from "../components/WheelBody"

import { ColliderBehavior } from "../behaviors/ColliderBehavior"
import { RigidBodyBehavior } from "../behaviors/RigidBodyBehavior"
import { VehicleBehavior } from "../behaviors/VehicleBehavior"
import { WheelBehavior } from "../behaviors/WheelBehavior"

import { Object3DComponent } from "ecsy-three"
import { TransformComponent } from "../../transform/components/TransformComponent"
import { PhysicsWorld } from "../components/PhysicsWorld"
import { System } from "ecsy"

export const quaternion = new Quaternion()

export class PhysicsSystem extends System {
  init() {
    new PhysicsWorld()
  }
  execute(dt, t) {
    PhysicsWorld.instance.frame++
    PhysicsWorld.instance._physicsWorld.step(PhysicsWorld.instance.timeStep)

    // Collider
    this.queries.сollider.added?.forEach(entity => {
      ColliderBehavior(entity, { phase: "onAdded" })
    })


    this.queries.сollider.removed?.forEach(entity => {
      ColliderBehavior(entity, { phase: "onRemoved" })
    })

    // RigidBody
    this.queries.rigidBody.added?.forEach(entity => {
      RigidBodyBehavior(entity, { phase: "onAdded" })
    })

    this.queries.rigidBody.results?.forEach(entity => {
      RigidBodyBehavior(entity, { phase: "onUpdate" })
    })

    this.queries.rigidBody.removed?.forEach(entity => {
      RigidBodyBehavior(entity, { phase: "onRemoved" })
    })

    // Vehicle

    this.queries.vehicleBody.added?.forEach(entity => {
      VehicleBehavior(entity, { phase: "onAdded" })
    })

    this.queries.vehicleBody.results?.forEach(entity => {
      VehicleBehavior(entity, { phase: "onUpdate" })
    })
    this.queries.vehicleBody.removed?.forEach(entity => {
      VehicleBehavior(entity, { phase: "onRemoved" })
    })

    // Wheel
    this.queries.wheelBody.added?.forEach(entity => {
      WheelBehavior(entity, { phase: "onAdded" })
    })

    this.queries.wheelBody.results?.forEach((entity, i) => {
      WheelBehavior(entity, { phase: "onUpdate", i })
    })

    this.queries.wheelBody.removed?.forEach(entity => {
      WheelBehavior(entity, { phase: "onRemoved" })
    })
  }
}

PhysicsSystem.queries = {
  сollider: {
    components: [Collider],
    listen: {
      added: true,
      removed: true
    }
  },
  rigidBody: {
    components: [RigidBody],
    listen: {
      added: true,
      removed: true
    }
  },
  vehicleBody: {
    components: [VehicleBody],
    listen: {
      added: true,
      removed: true
    }
  },
  wheelBody: {
    components: [WheelBody],
    listen: {
      added: true,
      removed: true
    }
  }
}
