import io from 'socket.io-client'
import feathers from '@feathersjs/client'
import { Config } from '@xrengine/common/src/config'

const feathersStoreKey: string = Config.publicRuntimeConfig.feathersStoreKey
const feathersClient: any = !Config.publicRuntimeConfig.offlineMode ? feathers() : undefined

if (!Config.publicRuntimeConfig.offlineMode) {
  const socket = io(Config.publicRuntimeConfig.apiServer, {
    withCredentials: true
  })
  feathersClient.configure(feathers.socketio(socket, { timeout: 10000 }))
  feathersClient.configure(
    feathers.authentication({
      storageKey: feathersStoreKey
    })
  )
}

export const client = feathersClient
