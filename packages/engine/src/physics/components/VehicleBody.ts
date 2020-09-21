import { Vector3Type } from '../../common/types/NumericalTypes';
import { RaycastVehicle } from 'cannon-es';
import { Component } from '../../ecs/classes/Component';
import { Types } from '../../ecs/types/Types';

export class VehicleBody extends Component<VehicleBody> {

  currentDriver: any

  vehicleMesh: any
  vehiclePhysics: RaycastVehicle
  vehicleCollider: any
  vehicleSphereColliders: any
  vehicleDoorsArray: any

  arrayWheelsMesh: any
  arrayWheelsPosition: any
  wheelRadius: number

  entrancesArray: any
  seatsArray: any

  maxSteerVal = 0.5
  maxForce = 500
  brakeForce = 1000000
  mass = 300
  vehicle: RaycastVehicle

}




VehicleBody.schema = {
  currentDriver: { type: Types.Ref, default: null },

  vehicleMesh: { type: Types.Ref, default: null },
  vehiclePhysics: { type: Types.Ref, default: null },
  vehicleCollider: { type: Types.Ref, default: null },
  vehicleSphereColliders: { type: Types.Ref, default: [] },
  vehicleDoorsArray: { type: Types.Ref, default: [] },

  arrayWheelsMesh: { type: Types.Ref, default: [] },
  arrayWheelsPosition: { type: Types.Ref, default: [] },
  wheelRadius: { type: Types.Number, default: 0.40 },

  entrancesArray: { type: Types.Ref, default: [] },
  seatsArray: { type: Types.Ref, default: [] },

  mass: { type: Types.Number, default: 150 },
  maxSteerVal: { type: Types.Number, default: 0.5 },
  maxForce: { type: Types.Number, default: 500 },
  brakeForce: { type: Types.Number, default: 1000000 },
  vehicle: { type: Types.Ref, default: null }
};
