import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import {
  Params
} from '@feathersjs/feathers';
import { QueryTypes } from 'sequelize';
import { extractLoggedInUserFromParams } from '../auth-management/auth-management.utils';
import { Forbidden } from '@feathersjs/errors';

export class User extends Service {
  app: Application

  constructor (options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async find (params: Params): Promise<any> {
    const action = params.query?.action;
    const skip = params.query?.$skip ? params.query.$skip : 0;
    const limit = params.query?.$limit ? params.query.$limit : 10;
    if (action === 'withRelation') {
      const userId = params.query?.userId;
      const search = params.query?.search as string;

      delete params.query?.action;
      delete params.query?.userId;
      delete params.query?.search;

      const UserRelationshipModel = this.app.get('sequelizeClient').models.user_relationship;
      let foundUsers: any;

      // TODO: Clean up this inline raw SQL
      if (search && search !== '') {
        const where = `id <> :userId 
          AND (name LIKE :search 
          OR id IN 
            (SELECT userId FROM identity_provider 
            WHERE \`token\` LIKE :search))`;
        const countQuery = `SELECT COUNT(id) FROM \`user\` WHERE ${where}`;
        const dataQuery = `SELECT * FROM \`user\` WHERE ${where} LIMIT :skip, :limit`;

        const total = await this.app.get('sequelizeClient').query(countQuery,
          {
            type: QueryTypes.SELECT,
            raw: true,
            replacements: {
              userId,
              search: `%${search}%`
            }
          });
        foundUsers = await this.app.get('sequelizeClient').query(dataQuery,
          {
            type: QueryTypes.SELECT,
            model: this.getModel(params),
            mapToModel: true,
            replacements: {
              userId,
              search: `%${search}%`,
              $skip: params.query?.$skip || 0,
              $limit: params.query?.$limit || 10
            }
          });

        foundUsers = {
          total,
          $limit: params.query?.$limit || 10,
          $skip: params.query?.$skip || 0,
          data: foundUsers
        };
      } else {
        params.query = {
          ...params.query,
          id: {
            $nin: [userId]
          }
        };

        foundUsers = await super.find(params);
      }

      let users;
      if (!Array.isArray(foundUsers)) {
        users = foundUsers.data;
      } else {
        users = foundUsers;
      }

      for (const user of users) {
        const userRelation = await UserRelationshipModel.findOne({
          where: {
            userId,
            relatedUserId: user.id
          },
          attributes: ['userRelationshipType']
        });
        const userInverseRelation = await UserRelationshipModel.findOne({
          where: {
            userId: user.id,
            relatedUserId: userId
          },
          attributes: ['userRelationshipType']
        });

        if (userRelation) {
          Object.assign(user, { relationType: userRelation.userRelationshipType });
        }
        if (userInverseRelation) {
          Object.assign(user, { inverseRelationType: userInverseRelation.userRelationshipType });
        }
      }

      return foundUsers;
    } else if (action === 'friends') {
      const loggedInUser = extractLoggedInUserFromParams(params);
      const userResult = await this.app.service('user').Model.findAndCountAll({
        offset: skip,
        limit: limit,
        order: [
          ['name', 'ASC']
        ],
        include: [
          {
            model: this.app.service('user-relationship').Model,
            where: {
              relatedUserId: loggedInUser.userId,
              userRelationshipType: 'friend'
            }
          },
          {
            model: this.app.service('user-relationship').Model,
            where: {
              userId: loggedInUser.userId,
              userRelationshipType: 'friend'
            }
          }
        ]
      });

      await Promise.all(userResult.rows.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
        return new Promise(async (resolve) => {
          const userAvatarResult = await this.app.service('static-resource').find({
            query: {
              staticResourceType: 'user-thumbnail',
              userId: user.id
            }
          }) as any;

          if (userAvatarResult.total > 0) {
            user.dataValues.avatarUrl = userAvatarResult.data[0].url;
          }

          resolve();
        });
      }));

      return {
        skip: skip,
        limit: limit,
        total: userResult.count,
        data: userResult.rows
      };
    } else if (action === 'layer-users') {
      const loggedInUser = extractLoggedInUserFromParams(params);
      let user;
      if (loggedInUser) user = await super.get(loggedInUser.userId);
      return super.find({
        query: {
          $limit: params.query.$limit || 10,
          $skip: params.query.$skip || 0,
          instanceId: params.query.instanceId || user.instanceId || 'intentionalBadId'
        }
      });
    } else if (action === 'admin') {
      const loggedInUser = extractLoggedInUserFromParams(params);
      const user = await super.get(loggedInUser.userId);
      if (user.userRole !== 'admin') throw new Forbidden ('Must be system admin to execute this action');
      return super.find({
        query: {
          $sort: params.query.$sort,
          $skip: params.query.$skip || 0,
          $limit: params.query.$limit || 10
        }
      });
    } else {
      const loggedInUser = extractLoggedInUserFromParams(params);
      const user = await super.get(loggedInUser.userId);
      if (user.userRole !== 'admin') throw new Forbidden ('Must be system admin to execute this action');
      return await super.find(params);
    }
  }
}
