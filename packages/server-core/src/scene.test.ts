import assert from 'assert'
import app from '../../server/src/app'
import path from 'path'
import appRootPath from 'app-root-path'
import { deleteFolderRecursive } from './util/fsHelperFunctions'

const defaultProjectName = 'default-project'
const defaultSceneName = 'default'
const newProjectName = 'test_project_name'
const newSceneName = 'test_scene_name'

const params = { isInternal: true }
let defaultSceneData

describe('Scene Service', () => {

  before(async () => {
    await new Promise(resolve => setTimeout(resolve, 3000))
  })

  it("should have default test scene", async function () {
    const { data } = await app.service('scenes').get({ 
      projectName: defaultProjectName,
      metadataOnly: false
    }, params)
    defaultSceneData = data[0]
    const entities = Object.values(defaultSceneData.scene.entities)
    assert.ok(entities)
  })

  it("should get default scene data", async function() {
    const { data } = await app.service('scene').get({ 
      projectName: defaultProjectName,
      sceneName: defaultSceneName,
      metadataOnly: false
    })
    const entities = Object.values(data.scene.entities)
    assert.strictEqual(entities.length, 8)
  })

  it("should add new project", async function() {
    await app.service('project').create({ 
      name: newProjectName
    }, params)
    const { data } = await app.service('project').get(newProjectName)
    assert.strictEqual(data.name, newProjectName)
    assert.strictEqual(data.routes.length, 0)
  })

  it("should add new scene", async function() {
    await app.service('scene').update(newProjectName, {
      sceneName: newSceneName
    }, params)
    const { data } = await app.service('scene').get({
      projectName: newProjectName,
      sceneName: newSceneName,
      metadataOnly: false
    }, params)
    assert.strictEqual(data.name, newSceneName)
    assert.deepEqual(data.scene, defaultSceneData.scene)
  })

  it("should save scene", async function() {
    await app.service('scene').update(newProjectName, { 
      sceneData: defaultSceneData.scene,
      sceneName: newSceneName
    }, params)
    const { data } = await app.service('scene').get({
      projectName: newProjectName,
      sceneName: newSceneName,
      metadataOnly: false
    }, params)
    assert.deepStrictEqual(data.name, newSceneName)
    assert.deepStrictEqual(data.scene, defaultSceneData.scene)
  })

  it("should remove scene", async function() {
    await app.service('scene').remove({ 
      projectName: newProjectName,
      sceneName: newSceneName
    }, params)
    assert.rejects(async () => {
      await app.service('scene').get({
        projectName: newProjectName,
        sceneName: newSceneName,
        metadataOnly: true
      }, params)
    })
  })

  it("should remove project", async function() {
    const { data } = await app.service('project').get(newProjectName, params)
    await app.service('project').remove(data.id, params)
    const project = await app.service('project').get(newProjectName, params)
    assert.strictEqual(project, undefined)
  })

  after(() => {
    const projectDir = path.resolve(appRootPath.path, `packages/projects/projects/${newProjectName}/`)
    deleteFolderRecursive(projectDir)
  })
})
