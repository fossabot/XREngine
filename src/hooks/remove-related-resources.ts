import config from 'config'
import { Hook, HookContext } from '@feathersjs/feathers'
import StorageProvider from '../storage/storageprovider'
import { StaticResource } from '../services/static-resource/static-resource.class'

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const provider = new StorageProvider()
    const storage = provider.getStorage()

    const { app, id } = context
    if (id) {
      const staticResourceService = app.service('static-resource')

      const staticResourceResult = await staticResourceService.find({
        query: {
          id: id
        }
      })

      const staticResource = staticResourceResult.data[0]

      const storageRemovePromise = new Promise((resolve, reject) => {
        const key = staticResource.url.replace('https://s3.amazonaws.com/' + (config.get('aws.s3.static_resource_bucket') as string) + '/', '')

        if (storage === undefined) reject(new Error('Storage is undefined'))

        storage.remove({
          key: key
        }, (err: any, result: any) => {
          if (err) {
            console.log('Storage removal error')
            console.log(err)
            reject(err)
          }

          resolve(result)
        })
      })

      const children = await getAllChildren(staticResourceService, id, 0)

      const childRemovalPromises = children.map(async (child: any) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
        return await new Promise(async (resolve, reject) => {
          try {
            await staticResourceService.remove(child.id)
          } catch (err) {
            console.log('Failed to remove child: ')
            console.log(child.id)
            reject(err)
          }

          resolve()
        })
      })

      const attributionRemovePromise = staticResource.attributionId ? app.service('attribution').remove(staticResource.attributionId) : Promise.resolve()

      const staticResourceChildrenRemovePromise = Promise.all(childRemovalPromises)

      await Promise.all([
        storageRemovePromise,
        staticResourceChildrenRemovePromise,
        attributionRemovePromise
      ])
    }

    return context
  }
}

const getAllChildren = async (service: StaticResource, id: string | number | undefined, $skip: number): Promise<Object[]> => {
  const pageResult = (await service.find({
    query: {
      parentResourceId: id,
      $skip: $skip
    }
  })) as any

  const total = pageResult.total
  let data = pageResult.data
  const limit = pageResult.limit
  if ($skip + (data.length as number) < total) {
    const nextPageData = await getAllChildren(service, id, $skip + (limit as number))

    data = data.concat(nextPageData)

    return data
  } else {
    return data
  }
}
