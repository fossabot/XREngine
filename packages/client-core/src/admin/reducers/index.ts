import adminReducer from './admin/reducers'
import adminUserReducer from './admin/user/reducers'
import contentPackReducer from './contentPack/reducers'
import adminInstanceReducer from './admin/instance/reducers'
import adminLocationReducer from './admin/location/reducers'
import adminPartyReducer from './admin/party/reducers'
import adminSceneReducer from './admin/scene/reducers'
import adminBotsReducer from './admin/bots/reducers'

/**
 * TODO: I am moving admin reducer to different packages
 *
 * @author KIMENYI KEVIN <kimenyikevin@gmail.com>
 */

export default {
  adminUser: adminUserReducer,
  admin: adminReducer,
  contentPack: contentPackReducer,
  adminInstance: adminInstanceReducer,
  adminLocation: adminLocationReducer,
  adminParty: adminPartyReducer,
  adminScene: adminSceneReducer,
  adminBots: adminBotsReducer
}
