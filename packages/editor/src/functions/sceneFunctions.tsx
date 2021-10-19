import i18n from 'i18next'
import { SceneDetailInterface, SceneInterface } from '@xrengine/common/src/interfaces/SceneInterface'
import { upload } from '@xrengine/client-core/src/util/upload'
import { ProjectManager } from '../managers/ProjectManager'
import { SceneManager } from '../managers/SceneManager'
import { client } from '@xrengine/client-core/src/feathers'

/**
 * getScenes used to get list projects created by user.
 *
 * @return {Promise}
 */
export const getScenes = async (): Promise<SceneDetailInterface[]> => {
  try {
    return await client.service('scene').find()
  } catch (error) {
    console.log('Error in Getting Project:' + error)
    throw new Error(error)
  }
}

/**
 * Function to get project data.
 *
 * @param projectId
 * @returns
 */
export const getScene = async (projectId): Promise<SceneDetailInterface> => {
  try {
    return await client.service('scene').get(projectId)
  } catch (error) {
    console.log('Error in Getting Project:' + error)
    throw new Error(error)
  }
}

/**
 * createScene used to create a scene.
 *
 * @author Robert Long
 * @author Abhishek Pathak
 * @param  {any}  scene         [contains the data related to scene]
 * @param  {any}  parentSceneId
 * @param  {any}  thumbnailBlob [thumbnail data]
 * @param  {any}  signal        [used to check if signal is not aborted]
 * @param  {any}  showDialog    [shows the message dialog]
 * @param  {any}  hideDialog
 * @return {Promise}               [response as json]
 */
export const createScene = async (
  scene,
  parentSceneId,
  thumbnailBlob,
  signal,
  showDialog,
  hideDialog
): Promise<SceneDetailInterface> => {
  if (signal.aborted) {
    throw new Error(i18n.t('editor:errors.saveProjectAborted'))
  }

  // uploading thumbnail providing file_id and meta
  const {
    file_id: thumbnailFileId,
    meta: { access_token: thumbnailFileToken }
  } = (await upload(thumbnailBlob, undefined, signal, 'thumbnailOwnedFileId')) as any

  if (signal.aborted) {
    throw new Error(i18n.t('editor:errors.saveProjectAborted'))
  }

  const serializedScene = await scene.serialize()
  const projectBlob = new Blob([JSON.stringify(serializedScene)], { type: 'application/json' })
  const {
    file_id: projectFileId,
    meta: { access_token: projectFileToken }
  } = (await upload(projectBlob, undefined, signal)) as any

  if (signal.aborted) {
    throw new Error(i18n.t('editor:errors.saveProjectAborted'))
  }

  const sceneData = {
    name: scene.name,
    thumbnailOwnedFileId: {
      file_id: thumbnailFileId,
      file_token: thumbnailFileToken
    },
    ownedFileIds: {},
    scene_file_id: projectFileId,
    scene_file_token: projectFileToken
  }

  if (parentSceneId) {
    sceneData['parent_scene_id'] = parentSceneId
  }
  ProjectManager.instance.ownedFileIds = Object.assign(
    {},
    ProjectManager.instance.ownedFileIds,
    ProjectManager.instance.currentOwnedFileIds
  )
  sceneData.ownedFileIds = Object.assign({}, sceneData.ownedFileIds, ProjectManager.instance.ownedFileIds)
  ProjectManager.instance.currentOwnedFileIds = {}

  try {
    return (await client.service('scene').create({ scene: sceneData })) as SceneDetailInterface
  } catch (error) {
    console.log('Error in Getting Project:' + error)
    throw new Error(error)
  }
}

/**
 * deleteScene used to delete project using projectId.
 *
 * @author Robert Long
 * @param  {any}  sceneId
 * @return {Promise}
 */
export const deleteScene = async (sceneId): Promise<any> => {
  try {
    await client.service('scene').remove(sceneId)
  } catch (error) {
    console.log('Error in Getting Project:' + error)
    throw new Error(error)
  }
  return true
}

/**
 * saveScene used to save changes in existing project.
 *
 * @author Robert Long
 * @author Abhishek Pathak
 * @param  {any}  projectId
 * @param  {any}  signal
 * @return {Promise}
 */
export const saveScene = async (projectId, signal): Promise<SceneDetailInterface> => {
  if (signal.aborted) {
    throw new Error(i18n.t('editor:errors.saveProjectAborted'))
  }

  const thumbnailBlob = await SceneManager.instance.takeScreenshot(512, 320) // Fixed blob undefined

  if (signal.aborted) {
    throw new Error(i18n.t('editor:errors.saveProjectAborted'))
  }

  const {
    file_id: thumbnailFileId,
    meta: { access_token: thumbnailFileToken }
  } = (await upload(thumbnailBlob, undefined, signal, 'thumbnailOwnedFileId', projectId)) as any

  if (signal.aborted) {
    throw new Error(i18n.t('editor:errors.saveProjectAborted'))
  }

  const scene = SceneManager.instance.scene
  const serializedScene = await scene.serialize(projectId)
  const projectBlob = new Blob([JSON.stringify(serializedScene)], { type: 'application/json' })
  const {
    file_id: projectFileId,
    meta: { access_token: projectFileToken }
  } = (await upload(projectBlob, undefined, signal)) as any

  if (signal.aborted) {
    throw new Error(i18n.t('editor:errors.saveProjectAborted'))
  }

  const project = {
    name: scene.name,
    thumbnailOwnedFileId: {
      file_id: thumbnailFileId,
      file_token: thumbnailFileToken
    },
    ownedFileIds: {},
    project_file_id: projectFileId,
    project_file_token: projectFileToken
  }

  const sceneId = scene.metadata && scene.metadata.sceneId ? scene.metadata.sceneId : null

  if (sceneId) {
    project['scene_id'] = sceneId
  }

  ProjectManager.instance.ownedFileIds = Object.assign(
    {},
    ProjectManager.instance.ownedFileIds,
    ProjectManager.instance.currentOwnedFileIds
  )
  project.ownedFileIds = Object.assign({}, project.ownedFileIds, ProjectManager.instance.ownedFileIds)
  ProjectManager.instance.currentOwnedFileIds = {}

  try {
    return (await client.service('scene').patch(projectId, { project })) as SceneDetailInterface
  } catch (error) {
    console.log('Error in Getting Project:' + error)
    throw new Error(error)
  }
}
