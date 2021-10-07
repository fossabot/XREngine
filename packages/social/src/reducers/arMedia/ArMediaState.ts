/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import { createState, useState, none, Downgraded } from '@hookstate/core'

/**
 * Commenting code to compile TSDOC Docusaurus
 * this file contain some issues with
 * FeedFiresAction, FeedFiresRetrieveAction imports are not available in actions.ts file its empty file.
 *
 */

import { ArMediaActionType } from './ArMediaActions'

export const ARMEDIA_PAGE_LIMIT = 100

const state = createState({
  arMedia: {
    arMedia: [],
    skip: 0,
    limit: ARMEDIA_PAGE_LIMIT,
    total: 0,
    retrieving: false,
    fetched: false,
    updateNeeded: true,
    lastFetched: new Date()
  },
  adminList: [],
  list: [],
  fetching: false,
  item: {},
  fetchingItem: false
})

export const arMediaReducer = (_, action: ArMediaActionType) => {
  Promise.resolve().then(() => arMediaReceptor(action))
  return state.attach(Downgraded).value
}

const arMediaReceptor = (action: ArMediaActionType): any => {
  state.batch((s) => {
    let result: any
    switch (action.type) {
      case 'ARMEDIA_FETCHING':
        return s.fetching.set(true)
      case 'ARMEDIA_ADMIN_RETRIEVED':
        result = action.list
        return s.arMedia.merge({
          arMedia: result.data,
          skip: result.skip,
          limit: result.limit,
          retrieving: false,
          fetched: true,
          updateNeeded: false,
          lastFetched: new Date()
        })
      case 'ARMEDIA_RETRIEVED':
        return s.merge({ list: action.list, fetching: false })
      case 'ADD_ARMEDIA':
        return s.arMedia.updateNeeded.set(true)
      case 'REMOVE_ARMEDIA':
        return s.arMedia.updateNeeded.set(true)
      case 'ARMEDIA_FETCHING_ITEM':
        return s.fetchingItem.set(true)
      case 'ARMEDIA_RETRIEVED_ITEM':
        return s.merge({ item: action.item, fetchingItem: false })
      case 'UPDATE_AR_MEDIA':
        return s.arMedia.updateNeeded.set(true)
    }
  }, action.type)
}

export const accessArMediaState = () => state
export const useArMediaState = () => useState(state)
