import { Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../../declarations'
import { SceneDetailInterface, SceneJson } from '@xrengine/common/src/interfaces/SceneInterface'
import fs from 'fs'
import path from 'path'
import appRootPath from 'app-root-path'
import { getCachedAsset } from '../../media/storageprovider/storageProviderUtils'
import { cleanString } from '../../util/cleanString'
import { uploadLocalProjectToProvider } from '../../projects/project/project.class'
import { isDev } from '@xrengine/common/src/utils/isDev'
import defaultSceneSeed from '@xrengine/projects/default-project/default.scene.json'
import { useStorageProvider } from '../../media/storageprovider/storageprovider'

export const sceneRelativePathIdentifier = '__$project$__'
const storageProvider = useStorageProvider()

export const parseSceneDataCacheURLs = (sceneData: SceneJson) => {
  for (const [key, val] of Object.entries(sceneData)) {
    if (val && typeof val === 'object') {
      sceneData[key] = parseSceneDataCacheURLs(val)
    }
    if (typeof val === 'string' && val.includes(sceneRelativePathIdentifier)) {
      sceneData[key] = getCachedAsset(val.replace(sceneRelativePathIdentifier, '/projects'))
    }
  }
  return sceneData
}

export const cleanSceneDataCacheURLs = (sceneData: SceneJson) => {
  for (const [key, val] of Object.entries(sceneData)) {
    if (val && typeof val === 'object') {
      sceneData[key] = cleanSceneDataCacheURLs(val)
    }
    if (typeof val === 'string' && val.includes('https://' + storageProvider.cacheDomain + '/projects')) {
      sceneData[key] = val.replace('https://' + storageProvider.cacheDomain + '/projects', sceneRelativePathIdentifier)
    }
  }
  return sceneData
}

export const getSceneData = (projectName, sceneName, metadataOnly) => {
  const newSceneJsonPath = path.resolve(
    appRootPath.path,
    `packages/projects/projects/${projectName}/${sceneName}.scene.json`
  )

  if (!fs.existsSync(newSceneJsonPath)) throw new Error(`No scene named ${sceneName} exists in project ${projectName}`)

  const sceneThumbnailPath = getCachedAsset(`projects/${projectName}/${sceneName}.thumbnail.jpeg`)

  const sceneData: SceneDetailInterface = {
    name: sceneName,
    thumbnailUrl: sceneThumbnailPath,
    scene: metadataOnly
      ? undefined
      : parseSceneDataCacheURLs(JSON.parse(fs.readFileSync(path.resolve(newSceneJsonPath), 'utf8')))
  }

  return sceneData
}

interface UpdateParams {
  sceneName: string
  sceneData?: SceneJson
  thumbnailBuffer?: Buffer
}

export class Scene implements ServiceMethods<any> {
  app: Application
  docs: any

  constructor(app: Application) {
    this.app = app
  }

  async setup() {}

  async find(params): Promise<{ data: SceneDetailInterface[] }> {
    const projects = await this.app.service('project').find(params)

    const scenes = []
    for (const project of projects.data) {
      const { data } = await this.app.service('scenes').get({ projectName: project.name, metadataOnly: true }, params)
      scenes.push(
        ...data.map((d) => {
          d.project = project.name
          return d
        })
      )
    }

    return {
      data: scenes
    }
  }

  // @ts-ignore
  async get({ projectName, sceneName, metadataOnly }, params?: Params): Promise<{ data: SceneDetailInterface }> {
    console.log(projectName, sceneName, metadataOnly)
    const project = await this.app.service('project').get(projectName, params)
    if (!project.data) throw new Error(`No project named ${projectName} exists`)

    const sceneData = getSceneData(projectName, sceneName, metadataOnly)

    return {
      data: sceneData
    }
  }

  async update(projectName: string, data: UpdateParams, params?: Params): Promise<any> {
    const { sceneName, sceneData, thumbnailBuffer } = data
    console.log('[scene.update]:', projectName, data)

    const project = await this.app.service('project').get(projectName, params)
    if (!project.data) throw new Error(`No project named ${projectName} exists`)

    const newSceneJsonPath = path.resolve(
      appRootPath.path,
      `packages/projects/projects/${projectName}/${sceneName}.scene.json`
    )

    if (thumbnailBuffer) {
      const sceneThumbnailPath = path.resolve(
        appRootPath.path,
        `packages/projects/projects/${projectName}/${sceneName}.thumbnail.jpeg`
      )
      fs.writeFileSync(path.resolve(sceneThumbnailPath), thumbnailBuffer)
    }

    fs.writeFileSync(
      path.resolve(newSceneJsonPath),
      JSON.stringify(cleanSceneDataCacheURLs(sceneData ?? defaultSceneSeed), null, 2)
    )

    /**
     * For local development flow only
     * Updates the local storage provider with the project's current files
     */
    if (isDev) {
      await uploadLocalProjectToProvider(projectName)
    }
  }

  // async patch(sceneId: NullableId, data: PatchData, params: Params): Promise<SceneDetailInterface> {}

  // @ts-ignore
  async remove({ projectName, sceneName }, params?: Params): Promise<any> {
    const name = cleanString(sceneName)

    if (projectName === 'default-project') return

    const project = await this.app.service('project').get(projectName, params)
    if (!project.data) throw new Error(`No project named ${projectName} exists`)

    const sceneJsonPath = path.resolve(appRootPath.path, `packages/projects/projects/${projectName}/${name}.scene.json`)
    if (fs.existsSync(sceneJsonPath)) {
      fs.rmSync(path.resolve(sceneJsonPath))
    }
  }
}
