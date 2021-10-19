import * as authentication from '@feathersjs/authentication'
import { disallow } from 'feathers-hooks-common'
import { BadRequest } from '@feathersjs/errors'

import { collectionType } from '../../entities/collection-type/collectionType'
import { HookContext } from '@feathersjs/feathers'

import attachOwnerIdInBody from '@xrengine/server-core/src/hooks/set-loggedin-user-in-body'
import attachOwnerIdInQuery from '@xrengine/server-core/src/hooks/set-loggedin-user-in-query'
import generateSceneCollection from './generate-collection.hook'
import mapProjectIdToQuery from '@xrengine/server-core/src/hooks/set-project-id-in-query'
import removeRelatedResources from '@xrengine/server-core/src/hooks/remove-related-resources'
import setResourceIdFromProject from '@xrengine/server-core/src/hooks/set-resource-id-from-project'
import setResponseStatusCode from '@xrengine/server-core/src/hooks/set-response-status-code'

const { authenticate } = authentication.hooks

/**
 * Used for Mapping data send according to database fields
 * @author Abhishek Pathak <abhi.pathak401@gmail.com>
 */
const mapSceneSaveData = () => {
  return (context: HookContext): HookContext => {
    context.data.ownedFileId = context.data.scene.scene_file_id
    context.data.name = context.data.scene.name
    context.data.thumbnailOwnedFileId = context.data.scene?.thumbnailOwnedFileId
    context.data.ownedFileIds = JSON.stringify(context.data.scene?.ownedFileIds)
    return context
  }
}

const validateCollectionData = () => {
  return async (context: HookContext): Promise<HookContext> => {
    console.log(context.data)
    if (!context?.data?.ownedFileId || !context?.data?.name || !context?.data?.thumbnailOwnedFileId) {
      return await Promise.reject(new BadRequest('Scene Data is required!'))
    }
    return context
  }
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      attachOwnerIdInBody('userId'),
      mapSceneSaveData(),
      validateCollectionData(),
      generateSceneCollection({ type: collectionType.scene })
    ],
    update: [disallow()],
    patch: [attachOwnerIdInBody('userId'), mapProjectIdToQuery(), mapSceneSaveData(), validateCollectionData()],
    remove: [attachOwnerIdInQuery('userId'), setResourceIdFromProject(), removeRelatedResources()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      // Editor is expecting 200, while feather is sending 201 for creation
      setResponseStatusCode(200)
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
} as any
