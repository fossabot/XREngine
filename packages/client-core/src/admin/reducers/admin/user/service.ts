import { Dispatch } from 'redux'
import {
  userRoleRetrieved,
  userRoleCreated,
  userAdminRemoved,
  userCreated,
  userPatched,
  userRoleUpdated,
  searchedUser,
  fetchedSingleUser,
  fetchedStaticResource,
  refetchSingleUser
} from './actions'
import { client } from '../../../../feathers'
import { loadedUsers } from './actions'
import { dispatchAlertError } from '../../../../common/reducers/alert/service'
import { useAuthState } from '../../../../user/reducers/auth/AuthState'

export function fetchUsersAsAdmin(incDec?: 'increment' | 'decrement') {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    const user = useAuthState().user
    const skip = getState().get('adminUser').get('users').get('skip')
    const limit = getState().get('adminUser').get('users').get('limit')
    try {
      if (user.userRole.value === 'admin') {
        const users = await client.service('user').find({
          query: {
            $sort: {
              name: 1
            },
            $skip: incDec === 'increment' ? skip + limit : incDec === 'decrement' ? skip - limit : skip,
            $limit: limit,
            action: 'admin'
          }
        })
        dispatch(loadedUsers(users))
      }
    } catch (err) {
      console.error(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function createUser(user: any) {
  console.log('user:', user)
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const result = await client.service('user').create(user)
      dispatch(userCreated(result))
    } catch (error) {
      console.error(error)
      dispatchAlertError(dispatch, error.message)
    }
  }
}

export function patchUser(id: string, user: any) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const result = await client.service('user').patch(id, user)
      dispatch(userPatched(result))
    } catch (error) {
      dispatchAlertError(dispatch, error.message)
    }
  }
}

export function removeUserAdmin(id: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    const result = await client.service('user').remove(id)
    dispatch(userAdminRemoved(result))
  }
}
export const fetchUserRole = () => {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const userRole = await client.service('user-role').find()
      dispatch(userRoleRetrieved(userRole))
    } catch (err) {
      console.error(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export const createUserRoleAction = (data) => {
  return async (dispatch: Dispatch): Promise<any> => {
    const result = await client.service('user-role').create(data)
    dispatch(userRoleCreated(result))
  }
}
export const updateUserRole = (id: string, role: string) => {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const userRole = await client.service('user').patch(id, { userRole: role })
      dispatch(userRoleUpdated(userRole))
    } catch (err) {
      console.error(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}
export const searchUserAction = (data: any, offset: string) => {
  return async (dispatch: Dispatch, getState: any): Promise<any> => {
    try {
      const skip = getState().get('adminUser').get('users').get('skip')
      const limit = getState().get('adminUser').get('users').get('limit')
      const result = await client.service('user').find({
        query: {
          $sort: {
            name: 1
          },
          $skip: skip || 0,
          $limit: limit,
          action: 'search',
          data
        }
      })
      dispatch(searchedUser(result))
    } catch (err) {
      console.error(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export const fetchSingleUserAdmin = (id: string) => {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const result = await client.service('user').get(id)
      dispatch(fetchedSingleUser(result))
    } catch (error) {
      console.error(error)
      dispatchAlertError(dispatch, error.message)
    }
  }
}

export const fetchStaticResource = () => {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const result = await client.service('static-resource').find({
        query: {
          staticResourceType: 'avatar'
        }
      })
      dispatch(fetchedStaticResource(result))
    } catch (error) {
      console.error(error)
    }
  }
}

export const refetchSingleUserAdmin = () => {
  console.log('refetchSingleUserAdmin')
  return async (dispatch: Dispatch): Promise<any> => dispatch(refetchSingleUser())
}
