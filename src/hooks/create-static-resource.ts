import { Hook, HookContext } from '@feathersjs/feathers'
import getBasicMimetype from '../util/get-basic-mimetype'

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { data, params } = context
    const body = params.body || {}

    const resourceData = {
      name: data.name || body.name || context.params.file.originalname,
      description: data.description || body.description,
      url: data.uri || data.url,
      mime_type: data.mime_type || params.mime_type,
      metadata: data.metadata || body.metadata
    }

    if (context.params.skipResourceCreation === true) {
      context.result = await context.app.service('static-resource').patch(context.params.patchId, {
        url: resourceData.url,
        metadata: resourceData.metadata
      })
    } else {
      if (context.params.parentResourceId) {
        (resourceData as any).parentResourceId = context.params.parentResourceId
      }
      (resourceData as any).type = getBasicMimetype(resourceData.mime_type)
      if (context.params.uuid && context.params.parentResourceId == null) {
        (resourceData as any).id = context.params.uuid
      }
      context.result = await context.app.service('static-resource').create(resourceData)
    }

    return context
  }
}
