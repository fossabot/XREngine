import { createState, useState, none, Downgraded } from '@hookstate/core'
import { ScopeActionType } from './ScopeActions'

export const SCOPE_PAGE_LIMIT = 100

const state = createState({
  scope: {
    scope: [],
    skip: 0,
    limit: SCOPE_PAGE_LIMIT,
    total: 0,
    retrieving: false,
    fetched: false,
    updateNeeded: true,
    lastFetched: new Date()
  },
  scopeType: {
    scopeType: [],
    skip: 0,
    limit: SCOPE_PAGE_LIMIT,
    total: 0,
    retrieving: false,
    fetched: false,
    updateNeeded: true,
    lastFetched: new Date()
  },
  fetching: false
})

export const adminScopeReducer = (_, action: ScopeActionType) => {
  Promise.resolve().then(() => scopeReceptor(action))
  return state.attach(Downgraded).value
}

const scopeReceptor = (action: ScopeActionType): any => {
  let result: any
  state.batch((s) => {
    switch (action.type) {
      case 'SCOPE_FETCHING':
        return s.merge({ fetching: true })
      case 'SCOPE_ADMIN_RETRIEVED':
        result = action.list

        return s.scope.merge({
          scope: result.data,
          skip: result.skip,
          limit: result.limit,
          retrieving: false,
          fetched: true,
          updateNeeded: false,
          lastFetched: new Date()
        })
      case 'ADD_SCOPE':
        return s.scope.merge({ updateNeeded: true })
      case 'UPDATE_SCOPE':
        return s.scope.merge({ updateNeeded: true })

      case 'REMOVE_SCOPE':
        return s.scope.merge({ updateNeeded: true })
      case 'SCOPE_TYPE_RETRIEVED':
        result = action.list
        return s.scopeType.merge({
          scopeType: result.data,
          skip: result.skip,
          limit: result.limit,
          retrieving: false,
          fetched: true,
          updateNeeded: false,
          lastFetched: new Date()
        })
    }
  }, action.type)
}

export const accessScopeState = () => state
export const useScopeState = () => useState(state)
