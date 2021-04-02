import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import { Id, Params } from "@feathersjs/feathers";
import { QueryTypes } from "sequelize";
import { Feed as FeedInterface } from '../../../../common/interfaces/Feed';
import { extractLoggedInUserFromParams } from "../auth-management/auth-management.utils";
import { BadRequest } from '@feathersjs/errors';
/**
 * A class for ARC Feed service
 */
export class Feed extends Service {
  app: Application
  docs: any

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  /**
   * @function find it is used to find specific users
   *
   * @param params 
   * @returns {@Array} of found users
   */

  async find (params: Params): Promise<any> {
    const action = params.query?.action;
    const skip = params.query?.$skip ? params.query.$skip : 0;
    const limit = params.query?.$limit ? params.query.$limit : 100;

    const queryParamsReplacements = {
      skip,
      limit,
    } as any;

    //All Feeds as Admin
    if (action === 'admin') {
      const dataQuery = `SELECT feed.*, creator.id as creatorId, creator.name as creatorName, creator.username as creatorUserName, 
      sr2.url as previewUrl, sr1.url as videoUrl, sr3.url as avatar, COUNT(ff.id) as fires, COUNT(fb.id) as bookmarks 
        FROM \`feed\` as feed
        JOIN \`creator\` as creator ON creator.id=feed.creatorId
        JOIN \`static_resource\` as sr1 ON sr1.id=feed.videoId
        JOIN \`static_resource\` as sr2 ON sr2.id=feed.previewId
        LEFT JOIN \`static_resource\` as sr3 ON sr3.id=creator.avatarId
        LEFT JOIN \`feed_fires\` as ff ON ff.feedId=feed.id
        LEFT JOIN \`feed_bookmark\` as fb ON fb.feedId=feed.id
        WHERE 1
        GROUP BY feed.id
        ORDER BY feed.createdAt DESC    
        LIMIT :skip, :limit `;

      const feeds = await this.app.get('sequelizeClient').query(dataQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: {...queryParamsReplacements}
        });

      return {
        data: feeds,
        skip,
        limit,
        total: feeds.count,
      };
    }

    //common  - TODO -move somewhere
    let creatorId =  params.query?.creatorId ? params.query.creatorId : null;
    const loggedInUser = extractLoggedInUserFromParams(params);
    if(loggedInUser){
      const creatorQuery = `SELECT id  FROM \`creator\` WHERE userId=:userId`;
      const [creator] = await this.app.get('sequelizeClient').query(creatorQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: {userId:loggedInUser.userId}
        });  
      creatorId = creator?.id ;
    }

    //Featured menu item
    if (action === 'featured') {
      const select = `SELECT feed.id, feed.viewsCount, sr.url as previewUrl 
        FROM \`feed\` as feed
        JOIN \`follow_creator\` as fc ON fc.creatorId=feed.creatorId
        JOIN \`static_resource\` as sr ON sr.id=feed.previewId`;
       let where=` WHERE feed.featured=1 `;
       let orderBy = ` ORDER BY feed.createdAt DESC    
        LIMIT :skip, :limit `;
      
      queryParamsReplacements.creatorId = creatorId;
      if(loggedInUser){
        where += ` AND (fc.followerId=:creatorId OR feed.creatorId=:creatorId)`
      }else{
        where += ` AND feed.creatorId=:creatorId`
      }
      const feeds = await this.app.get('sequelizeClient').query(select+where+orderBy,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: queryParamsReplacements
        });

      return {
        data: feeds,
        skip,
        limit,
        total: feeds.count,
      };
    }

    if (action === 'creator') {
      const dataQuery = `SELECT feed.id, feed.creatorId, feed.featured, feed.viewsCount, sr.url as previewUrl
        FROM \`feed\` as feed
        JOIN \`static_resource\` as sr ON sr.id=feed.previewId
        WHERE feed.creatorId=:creatorId
        ORDER BY feed.createdAt DESC    
        LIMIT :skip, :limit 
        `;
      
      queryParamsReplacements.creatorId =  params.query?.creatorId ? params.query.creatorId : creatorId;
      const feeds = await this.app.get('sequelizeClient').query(dataQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: queryParamsReplacements
        });

      return {
        data: feeds,
        skip,
        limit,
        total: feeds.count,
      };
    }

    if (action === 'myFeatured') {
      const dataQuery = `SELECT feed.id, feed.creatorId, feed.featured,  feed.viewsCount, sr.url as previewUrl 
        FROM \`feed\` as feed
        JOIN \`static_resource\` as sr ON sr.id=feed.previewId
        WHERE feed.creatorId=:creatorId AND feed.featured=1
        ORDER BY feed.createdAt DESC    
        LIMIT :skip, :limit `;
      queryParamsReplacements.creatorId = creatorId;
      const feeds = await this.app.get('sequelizeClient').query(dataQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: queryParamsReplacements
        });

      return {
        data: feeds,
        skip,
        limit,
        total: feeds.count,
      };
    }

    if (action === 'bookmark') {
      const dataQuery = `SELECT feed.id, feed.viewsCount, sr.url as previewUrl 
        FROM \`feed\` as feed
        JOIN \`static_resource\` as sr ON sr.id=feed.previewId
        JOIN \`feed_bookmark\` as fb ON fb.feedId=feed.id
        WHERE fb.creatorId=:creatorId
        ORDER BY feed.createdAt DESC    
        LIMIT :skip, :limit 
        `;
      
      queryParamsReplacements.creatorId = creatorId;
      const feeds = await this.app.get('sequelizeClient').query(dataQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: queryParamsReplacements
        });

      return {
        data: feeds,
        skip,
        limit,
        total: feeds.count,
      };
    }

    // TheFeed menu item - just for followed creatos!!!!!
    let select = `SELECT feed.*, creator.id as creatorId, creator.name as creatorName, creator.username as creatorUserName, creator.verified as creatorVerified, 
    sr3.url as avatar, COUNT(ff.id) as fires, sr1.url as videoUrl, sr2.url as previewUrl, fc.id as follow_id, fc.creatorId as fc_creatorId, 
    fc.followerId as fc_follower_id  `;
    const from = ` FROM \`feed\` as feed`;
    let join = ` JOIN \`creator\` as creator ON creator.id=feed.creatorId
                  LEFT JOIN \`follow_creator\` as fc ON fc.creatorId=feed.creatorId 
                  LEFT JOIN \`feed_fires\` as ff ON ff.feedId=feed.id 
                  JOIN \`static_resource\` as sr1 ON sr1.id=feed.videoId
                  JOIN \`static_resource\` as sr2 ON sr2.id=feed.previewId
                  LEFT JOIN \`static_resource\` as sr3 ON sr3.id=creator.avatarId
                  `;
    const where = ` WHERE fc.followerId=:creatorId OR feed.creatorId=:creatorId`;
    const order = ` GROUP BY feed.id
    ORDER BY feed.createdAt DESC    
    LIMIT :skip, :limit `;

    if(creatorId){
      select += ` , isf.id as fired, isb.id as bookmarked `;
      join += ` LEFT JOIN \`feed_fires\` as isf ON isf.feedId=feed.id  AND isf.creatorId=:creatorId
                LEFT JOIN \`feed_bookmark\` as isb ON isb.feedId=feed.id  AND isb.creatorId=:creatorId`;
      queryParamsReplacements.creatorId =  creatorId;
    }

    const dataQuery = select + from + join + where + order;
    const feeds = await this.app.get('sequelizeClient').query(dataQuery,
      {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: queryParamsReplacements
      });

    const data = feeds.map(feed => {
      const newFeed: FeedInterface = {
        creator: {
          id:feed.creatorId,
          avatar: feed.avatar,
          name: feed.creatorName,
          username: feed.creatorUserName,
          verified : !!+feed.creatorVerified,
        },
        description: feed.description,
        fires: feed.fires,
        isFired: feed.fired ? true : false,
        isBookmarked: feed.bookmarked ? true : false,
        id: feed.id,
        videoUrl: feed.videoUrl,
        previewUrl: feed.previewUrl,
        title: feed.title,
        viewsCount: feed.viewsCount
      };

      return newFeed;
    });

    const feedsResult = {
      data,
      skip: skip,
      limit: limit,
      total: feeds.length,
    };

    return feedsResult;
  }

    /**
   * A function which is used to find specific project 
   * 
   * @param id of single feed
   * @param params contains current user 
   * @returns {@Object} contains specific feed
   * @author Vykliuk Tetiana
   */
    async get (id: Id, params?: Params): Promise<any> {
      let select = `SELECT feed.*, creator.id as creatorId, creator.name as creatorName, creator.username as creatorUserName, sr3.url as avatar, 
      creator.verified as creatorVerified, COUNT(ff.id) as fires, sr1.url as videoUrl, sr2.url as previewUrl `;
      const from = ` FROM \`feed\` as feed`;
      let join = ` JOIN \`creator\` as creator ON creator.id=feed.creatorId
                    LEFT JOIN \`feed_fires\` as ff ON ff.feedId=feed.id 
                    JOIN \`static_resource\` as sr1 ON sr1.id=feed.videoId
                    JOIN \`static_resource\` as sr2 ON sr2.id=feed.previewId
                    LEFT JOIN \`static_resource\` as sr3 ON sr3.id=creator.avatarId
                    `;
      const where = ` WHERE feed.id=:id`;      

      const queryParamsReplacements = {
        id,
      } as any;

      //common  - TODO -move somewhere
      const loggedInUser = extractLoggedInUserFromParams(params);
      const creatorQuery = `SELECT id  FROM \`creator\` WHERE userId=:userId`;
      const [creator] = await this.app.get('sequelizeClient').query(creatorQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: {userId:loggedInUser.userId}
        });   
      const creatorId = creator.id;

      if(creatorId){
        select += ` , isf.id as fired, isb.id as bookmarked `;
        join += ` LEFT JOIN \`feed_fires\` as isf ON isf.feedId=feed.id  AND isf.creatorId=:creatorId
                  LEFT JOIN \`feed_bookmark\` as isb ON isb.feedId=feed.id  AND isb.creatorId=:creatorId`;
        queryParamsReplacements.creatorId = creatorId; 
      }
  
      const dataQuery = select + from + join + where;
      const [feed] = await this.app.get('sequelizeClient').query(dataQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: queryParamsReplacements
        });

      const newFeed: FeedInterface = ({
        creator: {
          id: feed.creatorId,
          avatar: feed.avatar,
          name: feed.creatorName,
          username: feed.creatorUserName,
          verified : !!+feed.creatorVerified,
        },
        description: feed.description,
        fires: feed.fires,
        isFired: feed.fired ? true : false,
        isBookmarked: feed.bookmarked ? true : false,
        id: feed.id,
        videoUrl: feed.videoUrl,
        previewUrl: feed.previewUrl,
        title: feed.title,
        viewsCount: feed.viewsCount
      });     
      return newFeed;
    }

    async create (data: any,  params?: Params): Promise<any> {
      const {feed:feedModel} = this.app.get('sequelizeClient').models;

      //common  - TODO -move somewhere
      const loggedInUser = extractLoggedInUserFromParams(params);
      const creatorQuery = `SELECT id  FROM \`creator\` WHERE userId=:userId`;
      const [creator] = await this.app.get('sequelizeClient').query(creatorQuery,
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: {userId:loggedInUser.userId}
        });   

      data.creatorId = creator.id;
      const newFeed =  await feedModel.create(data);
      return  newFeed;
    }

      /**
   * A function which is used to update viewsCount field of feed 
   * 
   * @param id of feed to update 
   * @param params 
   * @returns updated feed
   * @author 
   */
  async patch (id: string, data?: any, params?: Params): Promise<any> {
    const {feed:feedModel } = this.app.get('sequelizeClient').models;
    let result = null;
    if(data.viewsCount){
      const feedItem = await feedModel.findOne({where: {id: id}});
      if(!feedItem){
        return Promise.reject(new BadRequest('Could not update feed. Feed not found! '));
      }
      result = await super.patch(feedItem.id, {
        viewsCount: (feedItem.viewsCount as number) + 1,
      });
    }else{
      result = await super.patch(id, data);
    }
    console.log('result', result);
    return result;
    
  }
}
