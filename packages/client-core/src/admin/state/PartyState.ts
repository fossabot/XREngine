import { createState, DevTools, useState, Downgraded } from '@hookstate/core'
import { PartyActionType } from './PartActions'
import { UserSeed } from '@xrengine/common/src/interfaces/User'
import { IdentityProviderSeed } from '@xrengine/common/src/interfaces/IdentityProvider'
import { AuthUserSeed } from '@xrengine/common/src/interfaces/AuthUser'
import { AdminParty } from '@xrengine/common/src/interfaces/AdminParty'
import { store } from '../../store'

export const PARTY_PAGE_LIMIT = 100

const state = createState({
  isLoggedIn: false,
  isProcessing: false,
  error: '',
  authUser: AuthUserSeed,
  user: UserSeed,
  identityProvider: IdentityProviderSeed,
  parties: {
    parties: [] as Array<AdminParty>,
    skip: 0,
    limit: PARTY_PAGE_LIMIT,
    total: 0,
    retrieving: false,
    fetched: false,
    updateNeeded: true,
    lastFetched: Date.now()
  }
})

store.receptors.push((action: PartyActionType): any => {
  let result
  state.batch((s) => {
    switch (action.type) {
      case 'PARTY_ADMIN_DISPLAYED':
        result = action.data
        return s.parties.merge({ parties: result.data, updateNeeded: false })
      case 'PARTY_ADMIN_CREATED':
        return s.parties.merge({ updateNeeded: true })
    }
  }, action.type)
})

export const accessPartyState = () => state

export const usePartyState = () => useState(state) as any as typeof state
