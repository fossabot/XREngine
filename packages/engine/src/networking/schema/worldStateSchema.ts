import { float32, int32, Model, Schema, string, uint32, uint8 } from "../../assets/superbuffer";
import { Network } from '../classes/Network';
import { WorldStateInterface } from "../interfaces/WorldState";

const userObjectSchema = new Schema ({
  id: string,
  data: string
})

const storageSchema = new Schema({
  component: string,
  variables: string
});

const stateSchema = new Schema({
  uuid: string,
  role: string,
  components: [string],
  storage: [storageSchema]
});

const gameStateUpdateSchema = new Schema({
  game: string,
  ownerId: string,
  state: [stateSchema]
});

const gameStateActionSchema = new Schema({
  game: string,
  role: string,
  component: string,
  uuid: string,
  componentArgs: string
})

/** Schema for input. */
const clientConnectedSchema = new Schema({
  userId: string,
  name: string,
  avatarDetail: {
    avatarId: string,
    avatarURL: string,
    thumbnailURL: string,
  },
});

const clientDisconnectedSchema = new Schema({
    userId: string
});

const transformSchema = new Schema({
    networkId: uint32,
    snapShotTime: uint32,
    x: float32,
    y: float32,
    z: float32,
    qX: float32,
    qY: float32,
    qZ: float32,
    qW: float32
});

const ikTransformOrientationSchema = new Schema({
    x: float32,
    y: float32,
    z: float32,
    qX: float32,
    qY: float32,
    qZ: float32,
    qW: float32
});

const ikTransformSchema = new Schema({
  networkId: uint32,
  snapShotTime: uint32,
  hmd: ikTransformOrientationSchema,
  left: ikTransformOrientationSchema,
  right: ikTransformOrientationSchema,
});

const createNetworkObjectSchema = new Schema({
    networkId: uint32,
    ownerId: string,
    prefabType: uint8,
    uniqueId: string,
    parameters: string,
});

const editNetworkObjectSchema = new Schema({
    networkId: uint32,
    ownerId: string,
    type: uint8,
    values: [uint32]
    // state: uint8,
    // currentId: uint32,
    // value: uint32,
});

const destroyNetworkObjectSchema = new Schema({
    networkId: uint32
});

const worldStateSchema = new Schema({
    clientsConnected: [clientConnectedSchema],
    clientsDisconnected: [clientDisconnectedSchema],
    createObjects: [createNetworkObjectSchema],
    editObjects: [editNetworkObjectSchema],
    destroyObjects: [destroyNetworkObjectSchema],
    tick: uint32,
    timeFP: uint32,
    timeSP: uint32,
    transforms: [transformSchema],
    ikTransforms: [ikTransformSchema],
    gameState: [gameStateUpdateSchema],
    gameStateActions: [gameStateActionSchema]
});

// TODO: convert WorldStateInterface to PacketReadyWorldState in toBuffer and back in fromBuffer
/** Class for holding world state. */
export class WorldStateModel {
    /** Model holding client input. */
    static model: Model = new Model(worldStateSchema)

    /** Convert to buffer. */
    static toBuffer(worldState: WorldStateInterface, type: String): ArrayBuffer {
      //  'Reliable'
      if ( type === 'Reliable') {
        const state:any = {
          clientsConnected: worldState.clientsConnected,
          clientsDisconnected: worldState.clientsDisconnected,
          createObjects: worldState.createObjects,
          editObjects: worldState.editObjects,
          destroyObjects: worldState.destroyObjects,
          tick: 0,
          timeFP: 0,
          timeSP: 0,
          transforms: [],
          ikTransforms: [],
          states: [],
          gameState: worldState.gameState,
          gameStateActions: worldState.gameStateActions
        };
        return Network.instance.packetCompression ? WorldStateModel.model.toBuffer(state) : state;
      } else
      if (type === 'Unreliable') {
        const timeToTwoUinit32 = Date.now().toString();
        const state:any = {
          clientsConnected: [],
          clientsDisconnected: [],
          createObjects: [],
          editObjects: [],
          destroyObjects: [],
          tick: worldState.tick,
          timeFP: Number(timeToTwoUinit32.slice(0,6)), // first part
          timeSP: Number(timeToTwoUinit32.slice(6)), // second part
          transforms: worldState.transforms.map(v=> {
            return {
              ...v,
              snapShotTime: v.snapShotTime,
            }
          }),
          ikTransforms: worldState.ikTransforms.map(v=> {
            return {
              ...v,
              snapShotTime: v.snapShotTime,
            }
          }),
          states: [],
          gameState: [],
          gameStateActions: []
        };
        return Network.instance.packetCompression ? WorldStateModel.model.toBuffer(state) : state;
      }
    }

    /** Read from buffer. */
    static fromBuffer(buffer:any): WorldStateInterface {
      try{
        const state = Network.instance.packetCompression ?
        WorldStateModel.model.fromBuffer(buffer) as any : buffer as any;

        if (!state.transforms) {
          console.warn('Packet not from this, will ignored', state);
          return;
        }

        return {
          ...state,
          tick: Number(state.tick),
          time: state.timeFP*10000000+state.timeSP, // get uint64 from two uint32
          transforms: state.transforms.map(v=> {
            const { snapShotTime, ...otherValues } = v;
            return {
              ...otherValues,
              snapShotTime: Number(snapShotTime)
            }
          }),
        };
      } catch(error){
        console.warn("Couldn't deserialize buffer", buffer, error)
      }

    }

}
