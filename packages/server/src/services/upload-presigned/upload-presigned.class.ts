import { Op } from "sequelize";
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import S3Provider from '../../storage/s3.storage';
import { MAX_AVATAR_FILE_SIZE, MIN_AVATAR_FILE_SIZE, PRESIGNED_URL_EXPIRATION_DURATION } from "@xr3ngine/engine/src/common/constants/AvatarConstants";

interface Data {}

interface ServiceOptions {}

/**
 * A class for Upload service 
 * 
 * @author Vyacheslav Solovjov
 */
export class UploadPresigned implements ServiceMethods<Data> {
  app: Application
  options: ServiceOptions
  docs: any
  s3 = new S3Provider();

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  async get (id: Id, params?: Params): Promise<Data> {
    const url = await this.s3.getSignedUrl(
      this.getKeyForFilename(params['identity-provider'].userId + '/' + params.query.fileName),
      PRESIGNED_URL_EXPIRATION_DURATION || 3600, // Expiration duration in Seconds
      [
        {"acl": "public-read"},
        ['content-length-range', MIN_AVATAR_FILE_SIZE, MAX_AVATAR_FILE_SIZE ] // Max size 15 MB
      ]
    );
    return url;
  }

  async create (data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async remove (id: NullableId, params?: Params): Promise<Data> {
    const data = await this.s3.deleteResources(params.query.keys);
    await this.app.service('static-resource').Model.destroy({
      where: {
        key: {
          [Op.in]: [params.query.keys],
        }
      }
    });
    return { data };
  }

  getKeyForFilename = (key: string): string => {
    return `${process.env.STORAGE_S3_AVATAR_DIRECTORY}${process.env.STORAGE_S3_DEV_MODE ? '/' + process.env.STORAGE_S3_DEV_MODE : ''}/${key}`;
  }
}
