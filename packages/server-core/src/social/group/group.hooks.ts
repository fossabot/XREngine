import collectAnalytics from '@xrengine/server-core/src/hooks/collect-analytics'
import groupPermissionAuthenticate from '@xrengine/server-core/src/hooks/group-permission-authenticate'
import createGroupOwner from '@xrengine/server-core/src/hooks/create-group-owner'
import removeGroupUsers from '@xrengine/server-core/src/hooks/remove-group-users'
import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import logger from '../../logger'

const { authenticate } = authentication.hooks

export default {
  before: {
    all: [authenticate('jwt'), collectAnalytics()],
    find: [],
    get: [],
    create: [],
    update: [groupPermissionAuthenticate()],
    patch: [
      groupPermissionAuthenticate(),
      async (context: HookContext): Promise<HookContext> => {
        const foundItem = await context.app.service('scope').Model.findOne({
          where: {
            groupId: context.arguments[0]
          }
        })
        if (!foundItem) {
          context.arguments[1]?.scopeType.forEach(async (el) => {
            await context.app.service('scope').create({
              type: el.type,
              groupId: context.arguments[0]
            })
          })
        } else {
          context.arguments[1]?.scopeType.forEach(async (el) => {
            await context.app.service('scope').Model.update(
              {
                type: el.type
              },
              {
                where: {
                  groupId: context.arguments[0]
                }
              }
            )
          })
        }
        return context
      }
    ],
    remove: [groupPermissionAuthenticate(), removeGroupUsers()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      createGroupOwner(),
      async (context: HookContext): Promise<HookContext> => {
        try {
          context.arguments[0]?.scopeType.forEach(async (el) => {
            await context.app.service('scope').create({
              type: el.type,
              groupId: context.result.id
            })
          })
          return context
        } catch (error) {
          logger.error('GROUP AFTER CREATE ERROR')
          logger.error(error)
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
