import S3Provider from '../../media/storageprovider/s3.storage';
import { Application } from '../../../declarations';
import config from '../../appconfig';
import axios from "axios";

const s3 = new S3Provider();
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)$/;
const thumbnailRegex = /([a-zA-Z0-9_-]+).jpeg/;

const getAssetKey = (value: string, packName: string) => `content-pack/${packName}/assets/${value}`;
const getAssetS3Key = (value: string) => value.replace('/assets', '');

const replaceRelativePath = (value: string) => {
    const stripped = value.replace('/assets', '');
    return `https://${config.aws.cloudfront.domain}${stripped}`;
};

const getThumbnailKey = (value: string) => {
    const regexExec = thumbnailRegex.exec(value);
    return `${regexExec[0]}`;
};

const getContentType = (url: string) => {
    if (/.glb$/.test(url) === true) return 'glb';
    if (/.jpeg$/.test(url) === true) return 'jpeg';
    if (/.json$/.test(url) === true) return 'json';
    return 'octet-stream';
};

export function assembleScene (scene: any, contentPack: string): any {
    const uploadPromises = [];
    const worldFile = {
        version: 4,
        root: scene.entities[0].entityId,
        metadata: JSON.parse(scene.metadata),
        entities: {}
    };
    for (const index in scene.entities) {
        const entity = (scene.entities[index] as any);
        const patchedComponents = [];
        for (const index in entity.components) {
            const component = entity.components[index];
            // eslint-disable-next-line prefer-const
            for (let [key,value] of Object.entries(component.props) as [string, any]) {
                if (typeof value === 'string' && key !== 'link') {
                    const regexExec = urlRegex.exec(value);
                    if (regexExec != null) {
                        const promise = new Promise(async (resolve, reject) => {
                            value = regexExec[2] as string;
                            component.props[key] = `/assets${value}`;
                            if (value[0] === '/') value = value.slice(1);
                            const file = await new Promise((resolve, reject) => {
                                s3.provider.getObject({
                                    Bucket: s3.bucket,
                                    Key: value
                                }, (err, data) => {
                                    if (err) {
                                        console.error(err);
                                        reject(err);
                                    } else {
                                        resolve(data);
                                    }
                                });
                            }) as any;
                            await new Promise((resolve, reject) => {
                                s3.provider.putObject({
                                    ACL: "public-read",
                                    Body: file.Body,
                                    Bucket: s3.bucket,
                                    ContentType: file.ContentType,
                                    Key: getAssetKey(value as string, contentPack)
                                }, (err, data) => {
                                    if (err) {
                                        console.error(err);
                                        reject(err);
                                    } else {
                                        resolve(data);
                                    }
                                });
                            });

                            resolve(null);
                        });
                        uploadPromises.push(promise);
                    }
                }
            }
            const toBePushed = {
                name: component.name,
                props: component.props
            };
            patchedComponents.push(toBePushed);
        }
        worldFile.entities[entity.entityId] = {
            name: entity.name,
            parent: entity.parent,
            index: entity.index,
            components: patchedComponents
        };
    }
    return {
        worldFile,
        uploadPromises
    };
}

export async function populateScene (sceneId: string, scene: any, app: Application, thumbnailUrl?: string): Promise<any> {
    const promises = [];
    const existingSceneResult = await (app.service('collection') as any).Model.findOne({
        where: {
            sid: sceneId
        }
    });
    if (existingSceneResult != null) {
        if (existingSceneResult.thumbnailOwnedFileId != null) await app.service('static-resource').remove(existingSceneResult.thumbnailOwnedFileId);
        const entityResult = await app.service('entity').find({
            query: {
                collectionId: existingSceneResult.id
            }
        });
        await Promise.all(entityResult.data.map(async entity => {
            await app.service('component').remove(null, {
                where: {
                    entityId: entity.id
                }
            });
            return app.service('entity').remove(entity.id);
        }));
        await app.service('collection').remove(existingSceneResult.id);
    }
    const collection = await app.service('collection').create({
        sid: sceneId,
        name: scene.metadata.name,
        metadata: scene.metadata,
        version: scene.version,
        isPublic: true,
        type: 'project'
    });
    if (thumbnailUrl != null) {
        const thumbnailResult = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
        const thumbnailKey = getThumbnailKey(thumbnailUrl);
        await new Promise((resolve, reject) => {
            s3.provider.putObject({
                ACL: "public-read",
                Body: thumbnailResult.data,
                Bucket: s3.bucket,
                ContentType: "jpeg",
                Key: thumbnailKey
            }, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        await app.service('static-resource').create({
            sid: collection.sid,
            url: `https://${config.aws.cloudfront.domain}/${thumbnailKey}`,
            mimeType: 'image/jpeg'
        });
        const newStaticResource = await app.service('static-resource').find({
            query: {
                sid: collection.sid,
                mimeType: 'image/jpeg'
            }
        });
        await app.service('static-resource').patch(newStaticResource.data[0].id, {
            key: `${newStaticResource.data[0].id}.jpeg`
        });
        await app.service('collection').patch(collection.id, {
            thumbnailOwnedFileId: newStaticResource.data[0].id
        });
    }
    for (const [key, value] of Object.entries(scene.entities) as [string, any]) {
        const entityResult = await app.service('entity').create({
            entityId: key,
            name: value.name,
            parent: value.parent,
            collectionId: collection.id,
            index: value.index
        });
        value.components.forEach(async component => {
            for (const [key, value] of Object.entries(component.props)) {
                if (typeof value === 'string' && /^\/assets/.test(value) === true) {
                    component.props[key] = replaceRelativePath(value);
                    // Insert Download/S3 upload
                    const contentType = getContentType(component.props[key]);
                    const downloadResult = await axios.get(component.props[key], { responseType: contentType === 'json' ? 'json' : 'arraybuffer' });
                    await new Promise((resolve, reject) => {
                        s3.provider.putObject({
                            ACL: "public-read",
                            Body: downloadResult.data,
                            Bucket: s3.bucket,
                            ContentType: contentType,
                            Key: getAssetS3Key(value as string)
                        }, (err, data) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                }
            }
            await app.service('component').create({
                data: component.props,
                entityId: entityResult.id,
                type: component.name
            });
        });
    }
    return Promise.all(promises);
}