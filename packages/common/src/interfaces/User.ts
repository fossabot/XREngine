import { IdentityProvider } from './IdentityProvider'
import { LocationAdmin } from './LocationAdmin'
import { LocationBan } from './LocationBan'
import { RelationshipType } from './UserRelationship'

export interface User {
  id: string
  name: string
  userRole: string
  avatarId: string
  identityProviders: IdentityProvider[]
  locationAdmins: LocationAdmin[]
  relationType?: RelationshipType
  inverseRelationType?: RelationshipType
  avatarUrl?: string
  instanceId?: string
  channelInstanceId?: string
  partyId?: string
  locationBans?: LocationBan[]
}

export const UserSeed = {
  id: '',
  name: '',
  identityProviders: []
}

export function resolveUser(user: any): User {
  let returned = user
  if (user?.identity_providers) {
    returned = {
      ...returned,
      identityProviders: user.identity_providers
    }
  }
  if (user?.location_admins && user.location_admins.length > 0) {
    returned = {
      ...returned,
      locationAdmins: user.location_admins
    }
  }
  if (user?.location_bans && user.location_bans.length > 0) {
    returned = {
      ...returned,
      locationBans: user.location_bans
    }
  }

  // console.log('Returned user:')
  // console.log(returned)
  return returned
}

export function resolveWalletUser(credentials: any): User {
  let returned = {
    id: '',
    instanceId: credentials.user.id,
    name: credentials.user.displayName,
    userRole: 'guest',
    avatarId: credentials.user.id,
    identityProviders: [],
    locationAdmins: [],
    avatarUrl: credentials.user.icon
  }

  return returned
}
