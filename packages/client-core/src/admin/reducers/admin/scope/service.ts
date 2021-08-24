import { Dispatch } from 'redux'
import { client } from '../../../../feathers'
import { addAdminScope, fetchingScope, getScopeType, setAdminScope, updateAdminScope, removeScopeItem } from './actions'
import { dispatchAlertError } from '../../../../common/reducers/alert/service'

export function createScope(scopeItem: any) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const newItem = await client.service('scope').create({
        ...scopeItem
      })
      dispatch(addAdminScope(newItem))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getScopeService(type?: string, limit: Number = 12) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingScope())
      const list = await client.service('scope').find({
        query: {
          action: type,
          $limit: limit
        }
      })
      dispatch(setAdminScope(list))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function updateScopeService(scopeId, scopeItem) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const updatedScope = await client.service('scope').patch(scopeId, {
        ...scopeItem
      })
      dispatch(updateAdminScope(updatedScope))
    } catch (err) {
      console.error(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function removeScope(scopeId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      await client.service('scope').remove(scopeId)
      dispatch(removeScopeItem(scopeId))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getScopeTypeService(type?: string, limit: Number = 12) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const result = await client.service('scope-type').find({
        query: {
          action: type,
          $limit: limit
        }
      })
      dispatch(getScopeType(result))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}
