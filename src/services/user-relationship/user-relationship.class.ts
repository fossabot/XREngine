import { Service, SequelizeServiceOptions } from 'feathers-sequelize'
import { Application } from '../../declarations'
import {
  NullableId,
  Params
} from '@feathersjs/feathers'
import { resolveModelData } from '../../util/model-resolver'
import { Transaction, Sequelize } from 'sequelize'
import config from 'config'

const loggedInUserEntity: string = config.get('authentication.entity') || 'user'

export class RelationRelation extends Service {
  app: Application

  constructor (options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }

  async find (params: Params): Promise<any> {
    const UserRelationshipModel = this.getModel(params)
    const UserRelationshipTypeService = this.app.service('user-relationship-type')
    const userRelationshipTypes = ((await UserRelationshipTypeService.find()) as any).data

    const userId = params.query?.userId
    const result = {}

    for (const userRelationType of userRelationshipTypes) {
      const userRelations = await UserRelationshipModel.findAll({
        where: {
          userId,
          type: userRelationType.type
        },
        attributes: ['relatedUserId'],
        raw: false
      })

      const resolvedData = []
      for (const userRelation of userRelations) {
        const userData = resolveModelData(await userRelation.getRelatedUser())
        // add second relation type
        const inverseRelationType = resolveModelData(await UserRelationshipModel.findOne({
          where: {
            userId: userRelation.relatedUserId,
            relatedUserId: userId
          }
        }))

        if (inverseRelationType) {
          Object.assign(userData, { inverseRelationType: inverseRelationType.type })
        }

        Object.assign(userData, { relationType: userRelationType.type })

        resolvedData.push(userData)
      }

      Object.assign(result, { [userRelationType.type]: resolvedData })
    }

    Object.assign(result, { userId })
    return result
  }

  async create (data: any, params: Params): Promise<any> {
    const authUser = params[loggedInUserEntity]
    const userId = authUser.userId
    const { relatedUserId, userRelationshipType } = data
    const UserRelationshipModel = this.getModel(params)
    let result: any

    console.log('-----------create---------', userId, relatedUserId)

    await this.app.get('sequelizeClient').transaction(async (trans: Transaction) => {
      result = await UserRelationshipModel.create({
        userId: userId,
        relatedUserId: relatedUserId,
        userRelationshipType
      }, {
        transaction: trans
      })

      await UserRelationshipModel.create({
        userId: relatedUserId,
        relatedUserId: userId,
        userRelationshipType: userRelationshipType === 'blocking' ? 'blocked' : 'requested'
      }, {
        transaction: trans
      })
    })

    return result
  }

  async patch (id: NullableId, data: any, params: Params): Promise<any> {
    const authUser = params[loggedInUserEntity]
    const userId = authUser.userId
    const { userRelationshipType } = data
    const UserRelationshipModel = this.getModel(params)

    return UserRelationshipModel.update({
      userRelationshipType
    }, {
      where: {
        userId: userId,
        relatedUserId: id
      }
    })
  }

  async remove (id: NullableId, params: Params): Promise<any> {
    const authUser = params[loggedInUserEntity]
    const userId = authUser.userId
    const UserRelationshipModel = this.getModel(params)

    return UserRelationshipModel.destroy({
      where: Sequelize.literal(
          `(userId='${userId as string}' AND relatedUserId='${id as string}') OR 
             (userId='${id as string}' AND relatedUserId='${userId as string}')`)
    })
  }
}
