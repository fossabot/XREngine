import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import {BadRequest} from '@feathersjs/errors';
import _ from 'lodash';
import Sequelize, { Op } from 'sequelize';
import getLocalServerIp from '../../util/get-local-server-ip';
import logger from '../../app/logger';
import config from '../../config';


const releaseRegex = /^([a-zA-Z0-9]+)-/;

interface Data {}

interface ServiceOptions {}

const gsNameRegex = /gameserver-([a-zA-Z0-9]{5}-[a-zA-Z0-9]{5})/;


/**
 * @class for InstanceProvision service 
 * 
 * @author Vyacheslav Solovjov
 */
export class InstanceProvision implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;
  docs: any
  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  /**
   * An method which start server for instance 
   * @author Vyacheslav Solovjov
   */
  async getFreeGameserver(): Promise<any> {
    if (process.env.KUBERNETES !== 'true') {
      console.log('Local server spinning up new instance');
      (this.app as any).instance = null;
      return getLocalServerIp();
    }
    logger.info('Getting free gameserver');
    const serverResult = await (this.app as any).k8AgonesClient.get('gameservers');
    const readyServers = _.filter(serverResult.items, (server: any) => {
      const releaseMatch = releaseRegex.exec(server.metadata.name);
      return server.status.state === 'Ready' && releaseMatch != null && releaseMatch[1] === config.server.releaseName;
    } );
    const server = readyServers[Math.floor(Math.random() * readyServers.length)];
    if (server == null) {
      return {
        ipAddress: null,
        port: null
      };
    }
    return {
      ipAddress: server.status.address,
      port: server.status.ports[0].port
    };
  }

  /**
   * A method which get instance of GameServerr 
   * @param availableLocationInstances for Gameserver 
   * @returns ipAddress and port 
   * @author Vyacheslav Solovjov
   */

  async getGSInService(availableLocationInstances): Promise<any> {
    const instanceModel = this.app.service('instance').Model;
    const instanceUserSort = _.sortBy(availableLocationInstances, (instance: typeof instanceModel) => instance.currentUsers);
    if (process.env.KUBERNETES !== 'true') {
      logger.info('Resetting local instance to ' + instanceUserSort[0].id);
      (this.app as any).instance = instanceUserSort[0];
      return getLocalServerIp();
    }
    const gsCleanup = await this.gsCleanup(instanceUserSort[0]);
    if (gsCleanup === true)  {
      logger.info('GS did not exist and was cleaned up');
      if (availableLocationInstances.length > 1) return this.getGSInService(availableLocationInstances.slice(1));
      else return this.getFreeGameserver();
    }
    logger.info('GS existed, using it');
    const ipAddressSplit = instanceUserSort[0].ipAddress.split(':');
    return {
      ipAddress: ipAddressSplit[0],
      port: ipAddressSplit[1]
    };
  }
  /**
   * A method which get clean up server 
   * 
   * @param instance of ipaddress and port 
   * @returns {@Boolean}
   * @author Vyacheslav Solovjov
   */

  async gsCleanup(instance): Promise<boolean> {
    const gameservers = await (this.app as any).k8AgonesClient.get('gameservers');
    const gsIds = gameservers.items.map(gs => gsNameRegex.exec(gs.metadata.name) != null ? gsNameRegex.exec(gs.metadata.name)[1] : null);
    const [ip, port] = instance.ipAddress.split(':');
    const match = gameservers.items.find(gs => {
      const inputPort = gs.status.ports.find(port => port.name === 'default');
      return gs.status.address === ip && inputPort.port.toString() === port;
    });
    if (match == null) {
      await this.app.service('instance').remove(instance.id);
      await this.app.service('gameserver-subdomain-provision').patch(null, {
        allocated: false
      }, {
        query: {
          instanceId: null,
          gs_id: {
            $nin: gsIds
          }
        }
      });
      return true;
    }

    return false;
  }
  
  /**
   * A method which find running Gameserver 
   * 
   * @param params of query of locationId and instanceId 
   * @returns {@function} getFreeGameserver and getGSInService
   * @author Vyacheslav Solovjov
   */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find (params?: Params): Promise<any> {
    try {
      let userId;
      console.log('INCOMING QUERY');
      console.log(params.query);
      const locationId = params.query.locationId;
      const instanceId = params.query.instanceId;
      const channelId = params.query.channelId;
      const token = params.query.token;
      if (channelId != null) {
        // Check if JWT resolves to a user
        if (token != null) {
          const authResult = await this.app.service('authentication').strategies.jwt.authenticate({accessToken: token}, {});
          const identityProvider = authResult['identity-provider'];
          if (identityProvider != null) {
            userId = identityProvider.userId;
          } else {
            throw new BadRequest('Invalid user credentials');
          }
        }
        const channelInstance = await this.app.service('instance').Model.findOne({
          where: {
            channelId: channelId
          }
        });
        if (channelInstance == null) return this.getFreeGameserver();
        else {
          const ipAddressSplit = channelInstance.ipAddress.split(':');
          return {
            ipAddress: ipAddressSplit[0],
            port: ipAddressSplit[1]
          };
        }
      } else {
        if (locationId == null) {
          throw new BadRequest('Missing location ID');
        }
        const location = await this.app.service('location').get(locationId);
        if (location == null) {
          throw new BadRequest('Invalid location ID');
        }
        if (instanceId != null) {
          const instance = await this.app.service('instance').get(instanceId);
          if (instance == null) {
            throw new BadRequest('Invalid instance ID');
          }
          const ipAddressSplit = instance.ipAddress.split(':');
          if (process.env.KUBERNETES !== 'true') {
            (this.app as any).instance.id = instanceId;
          }
          return {
            ipAddress: ipAddressSplit[0],
            port: ipAddressSplit[1]
          };
        }
        // Check if JWT resolves to a user
        if (token != null) {
          const authResult = await this.app.service('authentication').strategies.jwt.authenticate({accessToken: token}, {});
          const identityProvider = authResult['identity-provider'];
          if (identityProvider != null) {
            userId = identityProvider.userId;
          } else {
            throw new BadRequest('Invalid user credentials');
          }
        }
        const user = await this.app.service('user').get(userId);
        // If the user is in a party, they should be sent to their party's server as long as they are
        // trying to go to the scene their party is in.
        // If the user is going to a different scene, they will be removed from the party and sent to a random instance
        if (user.partyId) {
          console.log('Joining party\'s instance');
          const partyOwnerResult = await this.app.service('party-user').find({
            query: {
              partyId: user.partyId,
              isOwner: true
            }
          });
          const partyOwner = (partyOwnerResult as any).data[0];
          // Only redirect non-party owners. Party owner will be provisioned below this and will pull the
          // other party members with them.
          if (partyOwner?.userId !== userId && partyOwner?.user.instanceId) {
            const partyInstance = await this.app.service('instance').get(partyOwner.user.instanceId);
            // Only provision the party's instance if the non-owner is trying to go to the party's scene.
            // If they're not, they'll be removed from the party
            if (partyInstance.locationId === locationId) {
              if (process.env.KUBERNETES !== 'true') {
                return getLocalServerIp();
              }
              const addressSplit = partyInstance.ipAddress.split(':');
              console.log('addressSplit:');
              console.log(addressSplit);
              return {
                ipAddress: addressSplit[0],
                port: addressSplit[1]
              };
            } else {
              // Remove the party user for this user, as they're going to a different scene from their party.
              const partyUser = await this.app.service('party-user').find({
                query: {
                  userId: user.id,
                  partyId: user.partyId
                }
              });
              const {query, ...paramsCopy} = params;
              paramsCopy.query = {};
              await this.app.service('party-user').remove((partyUser as any).data[0].id, paramsCopy);
            }
          } else if (partyOwner?.userId === userId && partyOwner?.user.instanceId) {
            const partyInstance = await this.app.service('instance').get(partyOwner.user.instanceId);
            if (partyInstance.locationId === locationId) {
              if (process.env.KUBERNETES !== 'true') {
                return getLocalServerIp();
              }
              const addressSplit = partyInstance.ipAddress.split(':');
              console.log('addressSplit:');
              console.log(addressSplit);
              return {
                ipAddress: addressSplit[0],
                port: addressSplit[1]
              };
            }
          }
        }
        const friendsAtLocationResult = await this.app.service('user').Model.findAndCountAll({
          include: [
            {
              model: this.app.service('user-relationship').Model,
              where: {
                relatedUserId: userId,
                userRelationshipType: 'friend'
              }
            },
            {
              model: this.app.service('instance').Model,
              where: {
                locationId: locationId
              }
            }
          ]
        });
        if (friendsAtLocationResult.count > 0) {
          const instances = {};
          friendsAtLocationResult.rows.forEach((friend) => {
            if (instances[friend.instanceId] == null) {
              instances[friend.instanceId] = 1;
            } else {
              instances[friend.instanceId]++;
            }
          });
          let maxFriends, maxInstanceId;
          Object.keys(instances).forEach((key) => {
            if (maxFriends == null) {
              maxFriends = instances[key];
              maxInstanceId = key;
            } else {
              if (instances[key] > maxFriends) {
                maxFriends = instances[key];
                maxInstanceId = key;
              }
            }
          });
          const maxInstance = await this.app.service('instance').get(maxInstanceId);
          if (process.env.KUBERNETES !== 'true') {
            logger.info('Resetting local instance to ' + maxInstanceId);
            (this.app as any).instance = maxInstance;
            return getLocalServerIp();
          }
          const ipAddressSplit = maxInstance.ipAddress.split(':');
          return {
            ipAddress: ipAddressSplit[0],
            port: ipAddressSplit[1]
          };
        }
        const availableLocationInstances = await this.app.service('instance').Model.findAll({
          where: {
            locationId: location.id
          },
          include: [
            {
              model: this.app.service('location').Model,
              where: {
                maxUsersPerInstance: {
                  [Op.gt]: Sequelize.col('instance.currentUsers')
                }
              }
            }
          ]
        });
        if (availableLocationInstances.length === 0) return this.getFreeGameserver();
        else return this.getGSInService(availableLocationInstances);
      }
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * A method which get specific instance 
   * 
   * @param id of instance 
   * @param params 
   * @returns id and text 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get (id: Id, params?: Params): Promise<Data> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  /**
   * A method which is used to create instance 
   * 
   * @param data which is used to create instance 
   * @param params 
   * @returns data of instance 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }
/**
 * A method used to update instance 
 * 
 * @param id 
 * @param data which is used to update instance 
 * @param params 
 * @returns data of updated instance
 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  /**
   * 
   * @param id 
   * @param data  
   * @param params 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  /**
   * A method used to remove specific instance 
   * 
   * @param id of instance 
   * @param params 
   * @returns id 
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove (id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
