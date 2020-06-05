import IInstanceType from '../instancet-type.interface'
import { GraphQLObjectType, GraphQLInputObjectType, GraphQLList, GraphQLString, GraphQLInt } from 'graphql'
// @ts-ignore
import { attributeFields } from 'graphql-sequelize'

import { withFilter, PubSub } from 'graphql-subscriptions'
import { Application } from '../../../../declarations'

// @ts-ignore
import AgonesSDK from '@google-cloud/agones-sdk'

const InstanceUserPositionInputType = new GraphQLInputObjectType({
  name: 'InstanceUserPositionInput',
  fields: {
    x: {
      type: GraphQLInt
    },
    y: {
      type: GraphQLInt
    },
    z: {
      type: GraphQLInt
    }
  }
})

const InstanceUserPositionType = new GraphQLObjectType({
  name: 'InstanceUserPosition',
  fields: {
    x: {
      type: GraphQLInt
    },
    y: {
      type: GraphQLInt
    },
    z: {
      type: GraphQLInt
    }
  }
})

const InstanceUserQueryInputType = new GraphQLInputObjectType({
  name: 'InstanceUserQueryType',
  fields: {
    id: {
      type: GraphQLString
    }
  }
})

// const InstanceUserQueryType = new GraphQLObjectType({
//   name: 'InstanceUserQueryType',
//   fields: {
//     id: {
//       type: GraphQLString
//     }
//   }
// })

export default class UserInstance implements IInstanceType {
  model: any
  idField: any
  pubSubInstance: PubSub
  realtimeService: any
  agonesSDK: AgonesSDK
  app: Application
  constructor (model: any, realtimeService: any, pubSubInstance: PubSub, agonesSDK: AgonesSDK, app: Application) {
    this.model = model
    this.idField = { id: attributeFields(model).id }
    this.pubSubInstance = pubSubInstance
    this.realtimeService = realtimeService
    this.agonesSDK = agonesSDK
    this.app = app
  }

  mutations = {
    findUserInstances: {
      type: new GraphQLList(new GraphQLObjectType({
        name: 'findUserInstances',
        description: 'Find user instances on a realtime server',
        fields: () => ({
          ...attributeFields(this.model),
          position: {
            type: InstanceUserPositionType
          }
        })
      })),
      args: {
        query: {
          type: InstanceUserQueryInputType
        }
      },
      resolve: async (source: any, args: any, context: any, info: any) => {
        return this.realtimeService.find({ type: 'user', query: args.query })
      }
    },
    getUserInstance: {
      type: new GraphQLObjectType({
        name: 'getUserInstance',
        description: 'Get a single user instance on a realtime server',
        fields: () => ({
          ...attributeFields(this.model),
          position: {
            type: InstanceUserPositionType
          }
        })
      }),
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: async (source: any, args: any, context: any, info: any) => {
        return this.realtimeService.get(args.id, { type: 'user' })
      }
    },
    addUserInstance: {
      type: new GraphQLObjectType({
        name: 'addUserInstance',
        description: 'Add a user instance to this server',
        fields: () => ({
          ...attributeFields(this.model),
          position: {
            type: InstanceUserPositionType
          }
        })
      }),
      args: {
        position: {
          type: InstanceUserPositionInputType
        }
      },
      resolve: async (source: any, args: any, context: any, info: any) => {
        const userStore = this.realtimeService.store.get('user')
        const userStoreKeys = Array.from(userStore.keys())
        if (userStoreKeys.length === 0 && process.env.SERVER_MODE === 'realtime' && process.env.KUBERNETES === 'true') {
          await this.agonesSDK.allocate()
        }

        if (userStoreKeys.includes(args.id)) {
          throw new Error('User already exists')
        }

        const object = Object.assign({}, context.user, args)
        const newUser = await this.realtimeService.create({
          type: 'user',
          object: object
        })

        await this.pubSubInstance.publish('userInstanceCreated', {
          userInstanceCreated: args
        })

        return newUser
      }
    },
    patchUserInstance: {
      type: new GraphQLObjectType({
        name: 'patchUserInstance',
        description: 'Patch a user instance on this server',
        fields: () => ({
          ...attributeFields(this.model),
          position: {
            type: InstanceUserPositionType
          }
        })
      }),
      args: {
        position: {
          type: InstanceUserPositionInputType
        }
      },
      resolve: async (source: any, args: any, context: any, info: any) => {
        const object = Object.assign({}, context.user, args)
        const patchedUser = await this.realtimeService.patch(context.user.id, {
          type: 'user',
          object: object
        })

        await this.pubSubInstance.publish('userInstancePatched', {
          userInstancePatched: patchedUser
        })

        return patchedUser
      }
    },
    removeUserInstance: {
      type: new GraphQLObjectType({
        name: 'removeUserInstance',
        description: 'Remove a user instance from this server',
        fields: () => (this.idField)
      }),
      args: {
      },
      resolve: async (source: any, args: any, context: any, info: any) => {
        await this.realtimeService.remove(args.id, {
          type: 'user'
        })

        await this.pubSubInstance.publish('userInstanceRemoved', {
          userInstanceRemoved: args
        })

        if (Object.keys(this.realtimeService.store.get('user')).length === 0) {
          this.agonesSDK.shutdown()
        }

        return args
      }
    }
  }

  subscriptions = {
    userInstanceCreated: {
      type: new GraphQLObjectType({
        name: 'userInstanceCreated',
        description: 'Listen for when users are added to this server',
        fields: () => ({
          ...attributeFields(this.model),
          position: {
            type: InstanceUserPositionType
          }
        })
      }),
      subscribe: withFilter(
        () => this.pubSubInstance.asyncIterator('userInstanceCreated'),
        (payload, args) => {
          return true
        }
      )
    },
    userInstancePatched: {
      type: new GraphQLObjectType({
        name: 'userInstancePatched',
        description: 'Listen for when users are patched on this server',
        fields: () => ({
          ...attributeFields(this.model),
          position: {
            type: InstanceUserPositionType
          }
        })
      }),
      subscribe: withFilter(
        () => this.pubSubInstance.asyncIterator('userInstancePatched'),
        (payload, args) => {
          return true
        }
      )
    },
    userInstanceRemoved: {
      type: new GraphQLObjectType({
        name: 'userInstanceRemoved',
        description: 'Listen for when users are added to this server',
        fields: () => (this.idField)
      }),
      subscribe: withFilter(
        () => this.pubSubInstance.asyncIterator('userInstanceRemoved'),
        (payload, args) => {
          return true
        }
      )
    }
  }
}
