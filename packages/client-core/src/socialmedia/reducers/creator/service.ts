/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import { Creator } from '@xrengine/common/src/interfaces/Creator'
import { Dispatch } from 'redux'
import { upload } from '@xrengine/engine/src/scene/functions/upload'
import { dispatchAlertError } from '../../../common/reducers/alert/service'
import { client } from '../../../feathers'
import {
  fetchingCreator,
  creatorRetrieved,
  creatorsRetrieved,
  creatorLoggedRetrieved,
  creatorNotificationList,
  updateCreatorAsFollowed,
  updateCreatorNotFollowed,
  creatorFollowers,
  creatorFollowing,
  fetchingCreators,
  fetchingCurrentCreator
} from './actions'

export function createCreator() {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    try {
      dispatch(fetchingCurrentCreator())
      let userNumber = Math.floor(Math.random() * 1000) + 1
      const creator = await client
        .service('creator')
        .create({ name: 'User' + userNumber, username: 'user_' + userNumber })
      dispatch(creatorLoggedRetrieved(creator))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getLoggedCreator() {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingCurrentCreator())
      const creator = await client.service('creator').find({ query: { action: 'current' } })
      dispatch(creatorLoggedRetrieved(creator))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getCreators(limit?: number) {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    try {
      dispatch(fetchingCreators())
      const results = await client.service('creator').find({ query: {} })
      dispatch(creatorsRetrieved(results))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getCreator(creatorId) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingCreator())
      const creator = await client.service('creator').get(creatorId)
      dispatch(creatorRetrieved(creator))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function updateCreator(creator: Creator) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingCurrentCreator())
      if (creator.newAvatar) {
        const storedAvatar = await upload(creator.newAvatar, null)
        //@ts-ignore error that this vars are void because upload is defines as void funtion
        creator.avatarId = storedAvatar.file_id
        delete creator.newAvatar
      }
      const updatedCreator = await client.service('creator').patch(creator.id, creator)
      dispatch(creatorLoggedRetrieved(updatedCreator))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

//---------------------------NOT used for now
export function getCreatorNotificationList() {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingCreator())
      const notificationList = await client.service('notifications').find({ query: { action: 'byCurrentCreator' } })
      dispatch(creatorNotificationList(notificationList))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function followCreator(creatorId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const follow = await client.service('follow-creator').create({ creatorId })
      follow && dispatch(updateCreatorAsFollowed())
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function unFollowCreator(creatorId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const follow = await client.service('follow-creator').remove(creatorId)
      follow && dispatch(updateCreatorNotFollowed())
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getFollowersList(creatorId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const list = await client.service('follow-creator').find({ query: { action: 'followers', creatorId } })
      dispatch(creatorFollowers(list.data))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getFollowingList(creatorId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const list = await client.service('follow-creator').find({ query: { action: 'following', creatorId } })
      dispatch(creatorFollowing(list.data))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}
