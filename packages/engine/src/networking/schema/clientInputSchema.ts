import { float32, Model, Schema, uint32, uint64, uint8 } from "superbuffer"
import { NetworkClientInputInterface, PacketNetworkClientInputInterface } from "../interfaces/WorldState";
//import { uint8, float32, uint16, uint32 } from "../../common/types/DataTypes";
//import { createSchema } from "../functions/createSchema";
//import { Model } from "../classes/Model";

const inputKeySchema = new Schema({
  input: uint8,
  value: uint8, // float32
  lifecycleState: uint8
});

const inputAxis1DSchema = new Schema({
  input: uint8,
  value: float32,
  lifecycleState: uint8
});

const inputAxis2DSchema = new Schema({
  input: uint8,
  value: [float32],
  lifecycleState: uint8
});

const viewVectorSchema = new Schema({
  x: float32,
  y: float32,
  z: float32
});


export const inputKeyArraySchema = new Schema({
  networkId: uint32,
  axes1d: [inputAxis1DSchema],
  axes2d: [inputAxis2DSchema],
  buttons: [inputKeySchema],
  viewVector: viewVectorSchema,
  snapShotTime: uint64
});

export class ClientInputModel {
  static model: Model = new Model(inputKeyArraySchema)
  static toBuffer(inputs: NetworkClientInputInterface): ArrayBuffer {
    const packetInputs: PacketNetworkClientInputInterface = {
      ...inputs,
      snapShotTime: inputs.snapShotTime
    }
    // @ts-ignore
    return this.model.toBuffer(packetInputs);
  }
  static fromBuffer(buffer:unknown): NetworkClientInputInterface {
    // @ts-ignore
    const packetInputs = this.model.fromBuffer(buffer) as PacketNetworkClientInputInterface;

    return {
      ...packetInputs,
      snapShotTime: Number(packetInputs.snapShotTime)
    };
  }
}
