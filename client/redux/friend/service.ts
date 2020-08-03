import { Dispatch } from 'redux'
import { client } from '../feathers'
import { loadedFriends, unfriended } from './actions'
import { User } from '../../../shared/interfaces/User'

// export function getUserRelationship(userId: string) {
//   return (dispatch: Dispatch): any => {
//     // dispatch(actionProcessing(true))
//
//     console.log('------get relations-------', userId)
//     client.service('user-relationship').find({
//       query: {
//         userId
//       }
//     }).then((res: any) => {
//       console.log('relations------', res)
//       dispatch(loadedUserRelationship(res as Relationship))
//     })
//       .catch((err: any) => {
//         console.log(err)
//       })
//       // .finally(() => dispatch(actionProcessing(false)))
//   }
// }

export function getFriends(search: string) {
  return (dispatch: Dispatch): any => {
    // dispatch(actionProcessing(true))

    console.log('GETFRIENDS')
    client.service('user').find({
      query: {
        action: 'friends',
        search
      }
    }).then((res: any) => {
      console.log('relations------', res)
      dispatch(loadedFriends(res.data as User[]))
    })
      .catch((err: any) => {
        console.log(err)
      })
      // .finally(() => dispatch(actionProcessing(false)))
  }
}

// function createRelation(userId: string, relatedUserId: string, type: 'friend' | 'blocking') {
//   return (dispatch: Dispatch): any => {
//     client.service('user-relationship').create({
//       relatedUserId,
//       userRelationshipType: type
//     }).then((res: any) => {
//       console.log('add relations------', res)
//       dispatch(changedRelation())
//     })
//       .catch((err: any) => {
//         console.log(err)
//       })
//       // .finally(() => dispatch(actionProcessing(false)))
//   }
// }
//
function removeFriend(relatedUserId: string) {
  return (dispatch: Dispatch): any => {
    client.service('user-relationship').remove(relatedUserId)
      .then((res: any) => {
        console.log('add relations------', res)
        dispatch(unfriended())
      })
      .catch((err: any) => {
        console.log(err)
      })
      // .finally(() => dispatch(actionProcessing(false)))
  }
}
//
// function patchRelation(userId: string, relatedUserId: string, type: 'friend') {
//   return (dispatch: Dispatch): any => {
//     client.service('user-relationship').patch(relatedUserId, {
//       userRelationshipType: type
//     }).then((res: any) => {
//       console.log('Patching relationship to friend', res)
//       dispatch(changedRelation())
//     })
//       .catch((err: any) => {
//         console.log(err)
//       })
//       // .finally(() => dispatch(actionProcessing(false)))
//   }
// }

// export function requestFriend(userId: string, relatedUserId: string) {
//   return createRelation(userId, relatedUserId, 'friend')
// }
//
// export function blockUser(userId: string, relatedUserId: string) {
//   return createRelation(userId, relatedUserId, 'blocking')
// }
//
// export function acceptFriend(userId: string, relatedUserId: string) {
//   return patchRelation(userId, relatedUserId, 'friend')
// }
//
// export function declineFriend(userId: string, relatedUserId: string) {
//   return removeRelation(userId, relatedUserId)
// }
//
// export function cancelBlock(userId: string, relatedUserId: string) {
//   return removeRelation(userId, relatedUserId)
// }

export function unfriend(relatedUserId: string) {
  return removeFriend(relatedUserId)
}
