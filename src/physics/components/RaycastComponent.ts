import { Vector3 } from "three"
import { Types } from "../../ecs/Types"
import { Component } from "../../ecs/Component"

export default class RaycastComponent extends Component<RaycastComponent> {
  position!: Vector3
  direction!: Vector3
  near!: number
  far!: number

  static schema = {
    position: { type: Types.Vector3Type },
    direction: { type: Types.Vector3Type },
    near: { type: Types.Number, default: 0 },
    far: { type: Types.Number, default: 100 }
  }
}
