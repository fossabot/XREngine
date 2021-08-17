import adminReducer from './admin/reducers'
import adminUserReducer from './admin/user/reducers'
import contentPackReducer from './contentPack/reducers'
import adminAvatarReducer from './admin/avatar/reducers'
import adminInstanceReducer from './admin/instance/reducers'
import adminLocationReducer from './admin/location/reducers'
import adminPartyReducer from './admin/party/reducers'
// import adminSceneReducer from './admin/scene/reducers'
import { AdminSceneReducer } from './admin/scene/store/AdminSceneState'
import adminBotsReducer from './admin/bots/reducers'
import arMediaReducer from './admin/Social/arMedia/reducers'
import feedsReducer from './admin/Social/feeds/reducers'
import creatorReducer from './admin/Social/creator/reducers'

/**
 * TODO: I am moving admin reducer to different packages
 *
 * @author KIMENYI KEVIN <kimenyikevin@gmail.com>
 */

export default {
  adminUser: adminUserReducer,
  admin: adminReducer,
  contentPack: contentPackReducer,
  adminAvatar: adminAvatarReducer,
  adminInstance: adminInstanceReducer,
  adminLocation: adminLocationReducer,
  adminParty: adminPartyReducer,
  adminScene: AdminSceneReducer,
  adminBots: adminBotsReducer,
  arMedia: arMediaReducer,
  feedsAdmin: feedsReducer,
  adminCreator: creatorReducer
}
