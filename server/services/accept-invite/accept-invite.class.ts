import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { BadRequest } from '@feathersjs/errors'

interface Data {}

interface ServiceOptions {}

export class AcceptInvite implements ServiceMethods<Data> {
  app: Application
  options: ServiceOptions

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return []
  }

  async get (id: Id, params?: Params): Promise<Data> {
    try {
      params.provider = null
      const invite = await this.app.service('invite').get(id)

      if (invite == null) {
        return new BadRequest('Invalid invite ID')
      }

      if (params.query.passcode !== invite.passcode) {
        return new BadRequest('Invalid passcode')
      }

      if (invite.identityProviderType != null) {
        let inviteeIdentityProvider
        const inviteeIdentityProviderResult = await this.app.service('identity-provider').find({
          query: {
            type: invite.identityProviderType,
            token: invite.token
          }
        })

        if ((inviteeIdentityProviderResult as any).total === 0) {
          inviteeIdentityProvider = await this.app.service('identity-provider').create({
            type: invite.identityProviderType,
            token: invite.token
          }, params)
        } else {
          inviteeIdentityProvider = (inviteeIdentityProviderResult as any).data[0]
        }

        console.log(inviteeIdentityProvider)
        if (invite.inviteType === 'friend') {
          const existingRelationshipResult = await this.app.service('user-relationship').find({
            query: {
              userRelationshipType: invite.inviteType,
              userId: invite.userId,
              relatedUserId: (inviteeIdentityProvider).userId
            }
          })

          console.log(existingRelationshipResult)

          if ((existingRelationshipResult as any).total === 0) {
            await this.app.service('user-relationship').create({
              userRelationshipType: invite.inviteType,
              userId: invite.userId,
              relatedUserId: (inviteeIdentityProvider).userId
            }, params)

            await this.app.service('user-relationship').patch(invite.userId, {
              userRelationshipType: invite.inviteType,
              userId: (inviteeIdentityProvider).userId
            }, params)
          }
        } else if (invite.inviteType === 'group') {

        } else if (invite.inviteType === 'party') {

        }
      } else if (invite.inviteeId != null) {
        const invitee = await this.app.service('user').get(invite.inviteeId)

        if (invitee == null) {
          return new BadRequest('Invalid invitee ID')
        }

        await this.app.service('user-relationship').patch(invite.userId, {
          userRelationshipType: invite.inviteType,
          userId: invite.inviteeId
        }, params)
      }

      // await this.app.service('invite').remove(invite.id)
    } catch (err) {
      console.log(err)
    }
  }

  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current, params)))
    }

    return data
  }

  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  async remove (id: NullableId, params?: Params): Promise<Data> {
    return { id }
  }
}
