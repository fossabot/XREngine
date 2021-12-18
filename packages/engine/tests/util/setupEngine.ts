import { EngineSystemPresets, InitializeOptions } from '../../src/initializationOptions'
import { Network } from '../../src/networking/classes/Network'
import '@xrengine/engine/src/patchEngineNode'

class DummyTransport {
  initialize = () => {}
  sendData = () => {}
  sendActions = () => {}
  close = () => {}
}

Network.instance = new Network()
Network.instance.transport = new DummyTransport()
Network.instance.transport.initialize()

export const engineTestSetup: InitializeOptions = {
  type: EngineSystemPresets.SERVER,
  publicPath: '',
  systems: []
}
