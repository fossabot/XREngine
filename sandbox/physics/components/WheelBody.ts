import { Component } from "../../../src/ecs/classes/Component"
import { Types } from "../../../src/ecs/types/Types"

export class WheelBody extends Component<any> {}
WheelBody.schema = {
  mass: { type: Types.Number, default: 1 },
  scale: { type: Types.Number, default: { x: 0.2, y: 0.1, z: 0.1 } },
  wheelMesh: { type: Types.Number, default: 1 },
  vehicle: { type: Types.Number, default: 1 }
}
