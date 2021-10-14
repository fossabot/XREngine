import i18n from 'i18next'
import { loadRoute, RoutePageInterface } from '@xrengine/projects/loadRoute'
import { client } from '@xrengine/client-core/src/feathers'

/**
 * getCustomRoutes used to get a the routes created by the user.
 *
 * @return {Promise}
 */
export const getCustomRoutes = async (): Promise<any> => {
  const routes = await client.service('route').find()

  const components: RoutePageInterface[] = []

  if (!Array.isArray(routes.data) || routes.data == null) {
    throw new Error(
      i18n.t('editor:errors.fetchingRouteError', { error: routes.error || i18n.t('editor:errors.unknownError') })
    )
  } else {
    for (const project of routes.data) {
      const pages = await loadRoute({
        project: project.project,
        routes: project.routes.split(',')
      })
      components.push(...pages)
    }
  }

  return components
}
