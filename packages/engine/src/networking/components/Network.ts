import { NetworkSchema } from '../interfaces/NetworkSchema';
import { NetworkTransport } from '../interfaces/NetworkTransport';
import { Component } from '../../ecs/classes/Component';
import { Types } from '../../ecs/types/Types';

export class Network extends Component<any> {
  static instance: Network = null
  isInitialized: boolean
  transport: NetworkTransport
  schema: NetworkSchema
  // Add more data channels if needed, probably use sort of an enums just like MessageTypes for them
  dataChannels: string[] = [
    // examples
    // 'physics',
    // 'location' 
  ]
  clients: string[] = [] // TODO: Replace with ringbuffer
  mySocketID
  static Network: any
  constructor () {
    super();
    Network.instance = this;
  }
}

Network.schema = {
  isInitialized: { type: Types.Boolean },
  transport: { type: Types.Ref },
  schema: { type: Types.Ref },
  clients: { type: Types.Array },
  mySocketID: { type: Types.String }
};
