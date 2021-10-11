import { createState, useState, none, Downgraded } from '@hookstate/core'
import { InviteTypeActionType } from './InviteTypeActions'
import { Invite } from '@xrengine/common/src/interfaces/Invite'
const state = createState({
  inviteTypeData: {
    invitesType: [] as Array<Invite>,
    skip: 0,
    limit: 5,
    total: 0
  }
})

export const inviteTypeReducer = (_, action: InviteTypeActionType) => {
  Promise.resolve().then(() => inviteTypeReceptor(action))
  return state.attach(Downgraded).value
}

const inviteTypeReceptor = (action: InviteTypeActionType): any => {
  let newValues
  state.batch((s) => {
    switch (action.type) {
      case 'LOAD_INVITE_TYPE':
        newValues = action
        if (newValues.invitesType != null) {
          s.inviteTypeData.invitesType.merge([newValues.invitesType])
        }
        s.inviteTypeData.skip.set(newValues.skip)
        s.inviteTypeData.limit.set(newValues.limit)
        return s.inviteTypeData.total.set(newValues.total)
    }
  }, action.type)
}

export const accessInviteTypeState = () => state
export const useInviteTypeState = () => useState(state) as any as typeof state
