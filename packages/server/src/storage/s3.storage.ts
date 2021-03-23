import { StorageProviderInterface } from './storageprovider.interface';
import AWS from 'aws-sdk';
import config from '../config';
import S3BlobStore from 's3-blob-store';
import { callbackify } from 'util';

export default class S3Provider implements StorageProviderInterface {
  bucket = config.aws.s3.staticResourceBucket;
  provider: AWS.S3 = new AWS.S3({
    accessKeyId: config.aws.keys.accessKeyId,
    secretAccessKey: config.aws.keys.secretAccessKey,
    region: config.aws.s3.region,
  });

  blob: S3BlobStore = new S3BlobStore({
    client: this.provider,
    bucket: this.bucket,
    ACL: 'public-read'
  })


  getProvider = (): any => {
    return this.provider;
  }

  getStorage = (): S3BlobStore => this.blob;

  getSignedUrl = async (key: string, expiresAfter: number, conditions): Promise<any> => { 
    const result = await new Promise((resolve) => {
      this.provider.createPresignedPost({
        Bucket: this.bucket,
        Fields: {
          Key: key,
        },
        Expires: expiresAfter,
        Conditions: conditions
      }, (err, data) => {
        resolve(data);
      });
    });
    return result;
  }

  deleteResources = (keys: string[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.provider.deleteObjects({
        Bucket: this.bucket,
        Delete: {
          Objects: keys.map(key => { return { Key: key }; })
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
}
