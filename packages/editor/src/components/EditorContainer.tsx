import { ProjectDiagram } from '@styled-icons/fa-solid'
import { SlidersH } from '@styled-icons/fa-solid/SlidersH'
import { fetchAdminLocations } from '@xrengine/client-core/src/admin/reducers/admin/location/service'
import { selectAdminState } from '@xrengine/client-core/src/admin/reducers/admin/selector'
import { fetchAdminScenes, fetchLocationTypes } from '@xrengine/client-core/src/admin/reducers/admin/service'
import { cmdOrCtrlString } from '@xrengine/editor/src/functions/utils'
import PropTypes from 'prop-types'
import { DockLayout, DockMode } from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'
import React, { Component } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { withTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'
import { createProject, getProject, saveProject } from '@xrengine/engine/src/scene/functions/projectFunctions'
import { getScene } from '@xrengine/engine/src/scene/functions/getScene'
import { fetchUrl } from '@xrengine/engine/src/scene/functions/fetchUrl'
import AssetsPanel from './assets/AssetsPanel'
import { DialogContextProvider } from './contexts/DialogContext'
import { EditorContextProvider } from './contexts/EditorContext'
import { defaultSettings, SettingsContextProvider } from './contexts/SettingsContext'
import ConfirmDialog from './dialogs/ConfirmDialog'
import ErrorDialog from './dialogs/ErrorDialog'
import ExportProjectDialog from './dialogs/ExportProjectDialog'
import { ProgressDialog } from './dialogs/ProgressDialog'
import SaveNewProjectDialog from './dialogs/SaveNewProjectDialog'
import DragLayer from './dnd/DragLayer'
import Editor from './Editor'
import HierarchyPanelContainer from './hierarchy/HierarchyPanelContainer'
import { PanelDragContainer, PanelIcon, PanelTitle } from './layout/Panel'
// import BrowserPrompt from "./router/BrowserPrompt";
import { createEditor } from './Nodes'
import PropertiesPanelContainer from './properties/PropertiesPanelContainer'
import defaultTemplateUrl from './templates/crater.json'
import tutorialTemplateUrl from './templates/tutorial.json'
import ToolBar from './toolbar/ToolBar'
import ViewportPanelContainer from './viewport/ViewportPanelContainer'
import PerformanceCheckDialog from './dialogs/PerformanceCheckDialog'
import PublishDialog from './dialogs/PublishDialog'
import PublishedSceneDialog from './dialogs/PublishedSceneDialog'
import i18n from 'i18next'

/**
 * getSceneUrl used to create url for the scene.
 *
 * @author Robert Long
 * @param  {any} sceneId
 * @return {string}         [url]
 */
export const getSceneUrl = (sceneId): string => `${APP_URL}/scenes/${sceneId}`

/**
 * publishProject is used to publish project, firstly we save the project the publish.
 *
 * @author Robert Long
 * @param  {any}  project
 * @param  {any}  editor
 * @param  {any}  showDialog
 * @param  {any}  hideDialog
 * @return {Promise}            [returns published project data]
 */
export const publishProject = async (project, editor, showDialog, hideDialog?): Promise<any> => {
  let screenshotUrl
  try {
    const scene = editor.scene

    const abortController = new AbortController()
    const signal = abortController.signal

    // Save the scene if it has been modified.
    if (editor.sceneModified) {
      showDialog(ProgressDialog, {
        title: i18n.t('editor:saving'),
        message: i18n.t('editor:savingMsg'),
        cancelable: true,
        onCancel: () => {
          abortController.abort()
        }
      })
      // saving project.
      project = await saveProject(project.project_id, editor, signal, showDialog, hideDialog)

      if (signal.aborted) {
        const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
        error['aborted'] = true
        throw error
      }
    }

    showDialog(ProgressDialog, {
      title: i18n.t('editor:generateScreenshot'),
      message: i18n.t('editor:generateScreenshotMsg')
    })

    // Wait for 5ms so that the ProgressDialog shows up.
    await new Promise((resolve) => setTimeout(resolve, 5))

    // Take a screenshot of the scene from the current camera position to use as the thumbnail
    const screenshot = await editor.takeScreenshot()
    console.log('Screenshot is')
    console.log(screenshot)
    const { blob: screenshotBlob, cameraTransform: screenshotCameraTransform } = screenshot
    console.log('screenshotBlob is')
    console.log(screenshotBlob)

    screenshotUrl = URL.createObjectURL(screenshotBlob)

    console.log('Screenshot url is', screenshotUrl)

    if (signal.aborted) {
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    let { name } = scene.metadata

    name = (project.scene && project.scene.name) || name || editor.scene.name

    // Display the publish dialog and wait for the user to submit / cancel
    const publishParams: any = await new Promise((resolve) => {
      showDialog(PublishDialog, {
        screenshotUrl,
        initialSceneParams: {
          name
        },
        onCancel: () => resolve(null),
        onPublish: resolve
      })
    })

    // User clicked cancel
    if (!publishParams) {
      URL.revokeObjectURL(screenshotUrl)
      hideDialog()
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    // Update the scene with the metadata from the publishDialog
    scene.setMetadata({
      name: publishParams.name,
      previewCameraTransform: screenshotCameraTransform
    })

    showDialog(ProgressDialog, {
      title: i18n.t('editor:publishingScene'),
      message: i18n.t('editor:publishingSceneMsg'),
      cancelable: true,
      onCancel: () => {
        abortController.abort()
      }
    })

    // Clone the existing scene, process it for exporting, and then export as a glb blob
    const { glbBlob, scores } = await editor.exportScene(abortController.signal, { scores: true })

    if (signal.aborted) {
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    const performanceCheckResult = await new Promise((resolve) => {
      showDialog(PerformanceCheckDialog, {
        scores,
        onCancel: () => resolve(false),
        onConfirm: () => resolve(true)
      })
    })

    if (!performanceCheckResult) {
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    // Serialize Editor scene
    const serializedScene = await editor.scene.serialize(project.project_id)
    const sceneBlob = new Blob([JSON.stringify(serializedScene)], { type: 'application/json' })

    showDialog(ProgressDialog, {
      title: i18n.t('editor:publishingScene'),
      message: i18n.t('editor:publishingSceneMsg'),
      cancelable: true,
      onCancel: () => {
        abortController.abort()
      }
    })

    const size = glbBlob.size / 1024 / 1024
    const maxSize = maxUploadSize
    if (size > maxSize) {
      throw new Error(i18n.t('editor:errors.sceneTooLarge', { size: size.toFixed(2), maxSize }))
    }

    showDialog(ProgressDialog, {
      title: i18n.t('editor:publishingScene'),
      message: i18n.t('editor:uploadingThumbnailMsg'),
      cancelable: true,
      onCancel: () => {
        abortController.abort()
      }
    })

    // Upload the screenshot file
    const {
      file_id: screenshotId,
      meta: { access_token: screenshotToken }
    } = (await upload(screenshotBlob, undefined, abortController.signal)) as any

    if (signal.aborted) {
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    const {
      file_id: glbId,
      meta: { access_token: glbToken }
    }: any = await upload(glbBlob, (uploadProgress) => {
      showDialog(
        ProgressDialog,
        {
          title: i18n.t('editor:publishingScene'),
          message: i18n.t('editor:uploadingSceneMsg', { percentage: Math.floor(uploadProgress * 100) }),
          onCancel: () => {
            abortController.abort()
          }
        },
        abortController.signal
      )
    })

    if (signal.aborted) {
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    const {
      file_id: sceneFileId,
      meta: { access_token: sceneFileToken }
    } = (await upload(sceneBlob, undefined, abortController.signal)) as any

    if (signal.aborted) {
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    const sceneParams = {
      screenshot_file_id: screenshotId,
      screenshot_file_token: screenshotToken,
      model_file_id: glbId,
      model_file_token: glbToken,
      scene_file_id: sceneFileId,
      scene_file_token: sceneFileToken,
      name: publishParams.name
    }

    const token = getToken()

    const headers = {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`
    }
    const body = JSON.stringify({ scene: sceneParams })

    const resp = await fetchUrl(`${serverURL}/publish-project/${project.project_id}`, {
      method: 'POST',
      headers,
      body
    })

    console.log('Response: ' + Object.values(resp))

    if (signal.aborted) {
      const error = new Error(i18n.t('editor:errors.publishProjectAborted'))
      error['aborted'] = true
      throw error
    }

    if (resp.status !== 200) {
      throw new Error(i18n.t('editor:errors.sceneCreationFail', { reason: await resp.text() }))
    }

    project = await resp.json()

    showDialog(PublishedSceneDialog, {
      sceneName: sceneParams.name,
      screenshotUrl,
      sceneUrl: getSceneUrl(project.scene.scene_id),
      onConfirm: () => {
        hideDialog()
      }
    })
  } finally {
    if (screenshotUrl) {
      URL.revokeObjectURL(screenshotUrl)
    }
  }

  return project
}

/**
 * StyledEditorContainer component is used as root element of new project page.
 * On this page we have an editor to create a new or modifing an existing project.
 *
 * @author Robert Long
 * @type {Styled component}
 */
const StyledEditorContainer = (styled as any).div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: fixed;
`

/**
 *Styled component used as workspace container.
 *
 * @author Robert Long
 * @type {type}
 */
const WorkspaceContainer = (styled as any).div`
  display: flex;
  flex: 1;
  overflow: hidden;
  margin: 0px;
`

/**
 *Styled component used as dock container.
 *
 * @author Hanzla Mateen
 * @type {type}
 */
const DockContainer = (styled as any).div`
  .dock-panel {
    background: transparent;
    pointer-events: auto;
    opacity: 0.8;
    border: none;
  }
  .dock-panel:first-child {
    position: relative;
    z-index: 99;
  }
  .dock-panel[data-dockid="+3"] {
    visibility: hidden;
    pointer-events: none;
  }
  .dock-divider {
    pointer-events: auto;
  }
  .dock {
    border-radius: 4px;
    background: #282C31;
  }
  .dock-top .dock-bar {
    font-size: 12px;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    background: #282C31;
  }
  .dock-tab {
    background: #282C31; 
    border-bottom: none;
  }
  .dock-tab:hover, .dock-tab-active, .dock-tab-active:hover {
    color: #ffffff; 
  }
  .dock-ink-bar {
    background-color: #ffffff; 
  }
`

type EditorContainerProps = {
  adminState: any
  fetchAdminLocations?: any
  fetchAdminScenes?: any
  fetchLocationTypes?: any
  t: any
  Engine: any
  match: any
  location: any
  history: any
}
type EditorContainerState = {
  project: any
  parentSceneId: null
  // templateUrl: any;
  settingsContext: any
  // error: null;
  editor: Editor
  creatingProject: any
  DialogComponent: null
  pathParams: Map<string, unknown>
  queryParams: Map<string, string>
  dialogProps: {}
  modified: boolean
}

/**
 * EditorContainer class used for creating container for Editor
 *
 *  @author Robert Long
 */
class EditorContainer extends Component<EditorContainerProps, EditorContainerState> {
  static propTypes = {
    adminState: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { Engine } = props
    let settings = defaultSettings
    const storedSettings = localStorage.getItem('editor-settings')
    if (storedSettings) {
      settings = JSON.parse(storedSettings)
    }

    const editor = createEditor(settings, Engine)
    ;(window as any).editor = editor
    editor.init()
    editor.addListener('initialized', this.onEditorInitialized)

    this.state = {
      // error: null,
      project: null,
      parentSceneId: null,
      editor,
      pathParams: new Map(Object.entries(props.match.params)),
      queryParams: new Map(new URLSearchParams(window.location.search).entries()),
      settingsContext: {
        settings,
        updateSetting: this.updateSetting
      },
      creatingProject: null,
      // templateUrl: defaultTemplateUrl,
      DialogComponent: null,
      dialogProps: {},
      modified: false
    }

    this.t = this.props.t
  }

  componentDidMount() {
    if (this.props.adminState.get('locations').get('updateNeeded') === true) {
      this.props.fetchAdminLocations()
    }
    if (this.props.adminState.get('scenes').get('updateNeeded') === true) {
      this.props.fetchAdminScenes()
    }
    if (this.props.adminState.get('locationTypes').get('updateNeeded') === true) {
      this.props.fetchLocationTypes()
    }
    const pathParams = this.state.pathParams
    const queryParams = this.state.queryParams
    const projectId = pathParams.get('projectId')

    if (projectId === 'new') {
      if (queryParams.has('template')) {
        this.loadProjectTemplate(queryParams.get('template'))
      } else if (queryParams.has('sceneId')) {
        this.loadScene(queryParams.get('sceneId'))
      } else {
        this.loadProjectTemplate(defaultTemplateUrl)
      }
    } else if (projectId === 'tutorial') {
      this.loadProjectTemplate(tutorialTemplateUrl)
    } else {
      this.loadProject(projectId)
    }
  }

  componentDidUpdate(prevProps: EditorContainerProps) {
    if (this.props.location.pathname !== prevProps.location.pathname && !this.state.creatingProject) {
      // const { projectId } = this.props.match.params;
      const prevProjectId = prevProps.match.params.projectId
      const queryParams = new Map(new URLSearchParams(window.location.search).entries())
      this.setState({
        queryParams
      })
      const pathParams = this.state.pathParams
      const projectId = pathParams.get('projectId')
      let templateUrl = null

      if (projectId === 'new' && !queryParams.has('sceneId')) {
        templateUrl = queryParams.get('template') || defaultTemplateUrl
      } else if (projectId === 'tutorial') {
        templateUrl = tutorialTemplateUrl
      }

      if (projectId === 'new' || projectId === 'tutorial') {
        this.loadProjectTemplate(templateUrl)
      } else if (prevProjectId !== 'tutorial' && prevProjectId !== 'new') {
        this.loadProject(projectId)
      }
    }
  }

  componentWillUnmount() {
    const editor = this.state.editor
    editor.removeListener('sceneModified', this.onSceneModified)
    editor.removeListener('saveProject', this.onSaveProject)
    editor.removeListener('initialized', this.onEditorInitialized)
    editor.removeListener('error', this.onEditorError)
    editor.removeListener('projectLoaded', this.onProjectLoaded)
    editor.dispose()
  }

  t: Function

  async loadProjectTemplate(templateFile) {
    this.setState({
      project: null,
      parentSceneId: null
      // templateUrl
    })

    this.showDialog(ProgressDialog, {
      title: this.t('editor:loading'), // "Loading Project",
      message: this.t('editor:loadingMsg')
    })

    const editor = this.state.editor

    try {
      await editor.init()

      if (templateFile.metadata) {
        delete templateFile.metadata.sceneUrl
        delete templateFile.metadata.sceneId
      }

      await editor.loadProject(templateFile)

      this.hideDialog()
    } catch (error) {
      console.error(error)

      this.showDialog(ErrorDialog, {
        title: this.t('editor:loadingError'),
        message: error.message || this.t('editor:loadingErrorMsg'),
        error
      })
    }
  }

  async loadScene(sceneId) {
    this.setState({
      project: null,
      parentSceneId: sceneId
      // templateUrl: null,
    })

    this.showDialog(ProgressDialog, {
      title: this.t('editor:loading'),
      message: this.t('editor:loadingMsg')
    })

    const editor = this.state.editor

    try {
      const scene: any = await getScene(sceneId)
      console.warn('loadScene:scene', scene)
      const projectFile = scene.data

      await editor.init()

      await editor.loadProject(projectFile)

      this.hideDialog()
    } catch (error) {
      console.error(error)

      this.showDialog(ErrorDialog, {
        title: this.t('editor:loadingError'),
        message: error.message || this.t('editor:loadingErrorMsg'),
        error
      })
    }
  }

  async importProject(projectFile) {
    const project = this.state.project

    this.setState({
      project: null,
      parentSceneId: null
      // templateUrl: null,
    })

    this.showDialog(ProgressDialog, {
      title: this.t('editor:loading'),
      message: this.t('editor:loadingMsg')
    })

    const editor = this.state.editor

    try {
      await editor.init()

      await editor.loadProject(projectFile)

      editor.sceneModified = true
      this.updateModifiedState()

      this.hideDialog()
    } catch (error) {
      console.error(error)

      this.showDialog(ErrorDialog, {
        title: this.t('editor:loadingError'),
        message: error.message || this.t('editor:loadingErrorMsg'),
        error
      })
    } finally {
      if (project) {
        this.setState({
          project
        })
      }
    }
  }

  async loadProject(projectId) {
    this.setState({
      project: null,
      parentSceneId: null
    })

    this.showDialog(ProgressDialog, {
      title: this.t('editor:loading'),
      message: this.t('editor:loadingMsg')
    })

    const editor = this.state.editor

    let project

    try {
      project = await getProject(projectId)

      const projectFile = await fetchUrl(project.project_url).then((response) => response.json())

      await editor.init()

      await editor.loadProject(projectFile)

      this.hideDialog()
    } catch (error) {
      console.error(error)

      this.showDialog(ErrorDialog, {
        title: this.t('editor:loadingError'),
        message: error.message || this.t('editor:loadingErrorMsg'),
        error
      })
    } finally {
      if (project) {
        this.setState({
          project
        })
      }
    }
  }

  updateModifiedState(then?) {
    const nextModified = this.state.editor.sceneModified && !this.state.creatingProject

    if (nextModified !== this.state.modified) {
      this.setState({ modified: nextModified }, then)
    } else if (then) {
      then()
    }
  }

  generateToolbarMenu = () => {
    return [
      {
        name: this.t('editor:menubar.newProject'),
        action: this.onNewProject
      },
      {
        name: this.t('editor:menubar.saveProject'),
        hotkey: `${cmdOrCtrlString} + S`,
        action: this.onSaveProject
      },
      {
        name: this.t('editor:menubar.saveAs'),
        action: this.onDuplicateProject
      },
      {
        name: this.t('editor:menubar.exportGLB'), // TODO: Disabled temporarily till workers are working
        action: this.onExportProject
      },
      {
        name: this.t('editor:menubar.importProject'),
        action: this.onImportLegacyProject
      },
      {
        name: this.t('editor:menubar.exportProject'),
        action: this.onExportLegacyProject
      },
      {
        name: this.t('editor:menubar.quit'),
        action: this.onOpenProject
      }
    ]
  }

  onEditorInitialized = () => {
    const editor = this.state.editor

    const gl = this.state.editor.renderer.renderer.getContext()

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')

    let webglVendor = 'Unknown'
    let webglRenderer = 'Unknown'

    if (debugInfo) {
      webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    }

    editor.addListener('projectLoaded', this.onProjectLoaded)
    editor.addListener('error', this.onEditorError)
    editor.addListener('sceneModified', this.onSceneModified)
    editor.addListener('saveProject', this.onSaveProject)
  }

  /**
   *  Dialog Context
   */

  showDialog = (DialogComponent, dialogProps = {}) => {
    this.setState({
      DialogComponent,
      dialogProps
    })
  }

  hideDialog = () => {
    this.setState({
      DialogComponent: null,
      dialogProps: {}
    })
  }

  dialogContext = {
    showDialog: this.showDialog,
    hideDialog: this.hideDialog
  }

  /**
   * Scene Event Handlers
   */

  onEditorError = (error) => {
    if (error['aborted']) {
      this.hideDialog()
      return
    }

    console.error(error)

    this.showDialog(ErrorDialog, {
      title: error.title || this.t('editor:error'),
      message: error.message || this.t('editor:errorMsg'),
      error
    })
  }

  onSceneModified = () => {
    this.updateModifiedState()
  }

  onProjectLoaded = () => {
    this.updateModifiedState()
  }

  updateSetting(key, value) {
    const settings = Object.assign(this.state.settingsContext.settings, { [key]: value })
    localStorage.setItem('editor-settings', JSON.stringify(settings))
    const editor = this.state.editor
    editor.settings = settings
    editor.emit('settingsChanged')
    this.setState({
      settingsContext: {
        ...this.state.settingsContext,
        settings
      }
    })
  }

  /**
   *  Project Actions
   */

  createProject = async () => {
    const { editor, parentSceneId } = this.state as any
    this.showDialog(ProgressDialog, {
      title: this.t('editor:generateScreenshot'),
      message: this.t('editor:generateScreenshotMsg')
    })

    // Wait for 5ms so that the ProgressDialog shows up.
    await new Promise((resolve) => setTimeout(resolve, 5))

    const blob = await editor.takeScreenshot(512, 320)

    const result: any = (await new Promise((resolve) => {
      this.showDialog(SaveNewProjectDialog, {
        thumbnailUrl: URL.createObjectURL(blob),
        initialName: editor.scene.name,
        onConfirm: resolve,
        onCancel: resolve
      })
    })) as any

    if (!result) {
      this.hideDialog()
      return null
    }

    const abortController = new AbortController()

    this.showDialog(ProgressDialog, {
      title: this.t('editor:saving'),
      message: this.t('editor:savingMsg'),
      cancelable: true,
      onCancel: () => {
        abortController.abort()
        this.hideDialog()
      }
    })

    editor.setProperty(editor.scene, 'name', result.name, false)
    editor.scene.setMetadata({ name: result.name })

    const project = await createProject(
      editor.scene,
      parentSceneId,
      blob,
      abortController.signal,
      this.showDialog,
      this.hideDialog
    )

    editor.sceneModified = false
    globalThis.currentProjectID = project.project_id
    this.updateModifiedState(() => {
      this.setState({ creatingProject: true, project }, () => {
        this.props.history.replace(`/editor/projects/${project.project_id}`)
        this.setState({ creatingProject: false })
      })
    })

    return project
  }

  onNewProject = async () => {
    this.props.history.push('/editor/projects/new')
  }

  onOpenProject = () => {
    this.props.history.push('/editor/projects')
  }

  onDuplicateProject = async () => {
    const abortController = new AbortController()
    this.showDialog(ProgressDialog, {
      title: this.t('editor:duplicating'),
      message: this.t('editor:duplicatingMsg'),
      cancelable: true,
      onCancel: () => {
        abortController.abort()
        this.hideDialog()
      }
    })
    await new Promise((resolve) => setTimeout(resolve, 5))
    try {
      const editor = this.state.editor
      const newProject = await this.createProject()
      editor.sceneModified = false
      this.updateModifiedState()

      this.hideDialog()
      const pathParams = this.state.pathParams
      pathParams.set('projectId', newProject.project_id)
      this.setState({ pathParams: pathParams })
    } catch (error) {
      console.error(error)

      this.showDialog(ErrorDialog, {
        title: this.t('editor:savingError'),
        message: error.message || this.t('editor:savingErrorMsg')
      })
    }
  }

  onExportProject = async () => {
    const options = await new Promise((resolve) => {
      this.showDialog(ExportProjectDialog, {
        defaultOptions: Object.assign({}, Editor.DefaultExportOptions),
        onConfirm: resolve,
        onCancel: resolve
      })
    })

    if (!options) {
      this.hideDialog()
      return
    }

    const abortController = new AbortController()

    this.showDialog(ProgressDialog, {
      title: this.t('editor:exporting'),
      message: this.t('editor:exportingMsg'),
      cancelable: true,
      onCancel: () => abortController.abort()
    })

    try {
      const editor = this.state.editor

      const { glbBlob } = await editor.exportScene(abortController.signal, options)

      this.hideDialog()

      const el = document.createElement('a')
      el.download = editor.scene.name + '.glb'
      el.href = URL.createObjectURL(glbBlob)
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    } catch (error) {
      if (error['aborted']) {
        this.hideDialog()
        return
      }

      console.error(error)

      this.showDialog(ErrorDialog, {
        title: this.t('editor:exportingError'),
        message: error.message || this.t('editor:exportingErrorMsg'),
        error
      })
    }
  }

  onImportLegacyProject = async () => {
    const confirm = await new Promise((resolve) => {
      this.showDialog(ConfirmDialog, {
        title: this.t('editor:importLegacy'),
        message: this.t('editor:importLegacyMsg'),
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      })
    })

    this.hideDialog()

    if (!confirm) return

    const el = document.createElement('input')
    el.type = 'file'
    el.accept = '.world'
    el.style.display = 'none'
    el.onchange = () => {
      if (el.files.length > 0) {
        const fileReader: any = new FileReader()
        fileReader.onload = () => {
          const json = JSON.parse((fileReader as any).result)

          if (json.metadata) {
            delete json.metadata.sceneUrl
            delete json.metadata.sceneId
          }

          this.importProject(json)
        }
        fileReader.readAsText(el.files[0])
      }
    }
    el.click()
  }

  onExportLegacyProject = async () => {
    const { editor, project } = this.state
    const projectFile = await editor.scene.serialize(project.project_id)

    if (projectFile.metadata) {
      delete projectFile.metadata.sceneUrl
      delete projectFile.metadata.sceneId
    }

    const projectJson = JSON.stringify(projectFile)
    const projectBlob = new Blob([projectJson])
    const el = document.createElement('a')
    const fileName = this.state.editor.scene.name.toLowerCase().replace(/\s+/g, '-')
    el.download = fileName + '.world'
    el.href = URL.createObjectURL(projectBlob)
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }

  onSaveProject = async () => {
    const abortController = new AbortController()

    this.showDialog(ProgressDialog, {
      title: this.t('editor:saving'),
      message: this.t('editor:savingMsg'),
      cancelable: true,
      onCancel: () => {
        abortController.abort()
        this.hideDialog()
      }
    })

    // Wait for 5ms so that the ProgressDialog shows up.
    await new Promise((resolve) => setTimeout(resolve, 5))

    try {
      const { editor, project } = this.state
      if (project) {
        const newProject = await saveProject(
          project.project_id,
          editor,
          abortController.signal,
          this.showDialog,
          this.hideDialog
        )

        this.setState({ project: newProject })
        const pathParams = this.state.pathParams
        pathParams.set('projectId', newProject.project_id)
        this.setState({ pathParams: pathParams })
      } else {
        await this.createProject()
      }

      editor.sceneModified = false
      this.updateModifiedState()

      this.hideDialog()
    } catch (error) {
      console.error(error)

      this.showDialog(ErrorDialog, {
        title: this.t('editor:savingError'),
        message: error.message || this.t('editor:savingErrorMsg')
      })
    }
  }

  // Currently doesn't work
  onPublishProject = async (): Promise<void> => {
    try {
      const editor = this.state.editor
      let project = this.state.project

      if (!project) {
        project = await this.createProject()
      }

      if (!project) {
        return
      }

      project = await publishProject(project, editor, this.showDialog, this.hideDialog)

      if (!project) {
        return
      }

      editor.sceneModified = false
      this.updateModifiedState()

      this.setState({ project })
    } catch (error) {
      if (error['abortedsettingsContext']) {
        this.hideDialog()
        return
      }

      console.error(error)
      this.showDialog(ErrorDialog, {
        title: this.t('editor:publishingError'),
        message: error.message || this.t('editor:publishingErrorMsg'),
        error
      })
    }
  }

  getSceneId() {
    const { editor, project } = this.state as any
    return (
      (project && project.scene && project.scene.scene_id) || (editor.scene.metadata && editor.scene.metadata.sceneId)
    )
  }

  onOpenScene = () => {
    const sceneId = this.getSceneId()

    if (sceneId) {
      const url = getSceneUrl(sceneId)
      window.open(url)
    }
  }

  render() {
    const { DialogComponent, dialogProps, modified, settingsContext, editor } = this.state
    const toolbarMenu = this.generateToolbarMenu()
    const isPublishedScene = !!this.getSceneId()
    const locations = this.props.adminState.get('locations').get('locations')
    let assigneeScene
    if (locations) {
      locations.forEach((element) => {
        if (element.sceneId === this.state.queryParams.get('projectId')) {
          assigneeScene = element
        }
      })
    }

    let defaultLayout = {
      dockbox: {
        mode: 'horizontal' as DockMode,
        children: [
          {
            mode: 'vertical' as DockMode,
            size: 8,
            children: [
              {
                tabs: [{ id: 'viewPanel', title: 'Viewport', content: <div /> }],
                size: 1
              }
            ]
          },
          {
            mode: 'vertical' as DockMode,
            size: 2,
            children: [
              {
                tabs: [
                  {
                    id: 'hierarchyPanel',
                    title: (
                      <PanelDragContainer>
                        <PanelIcon as={ProjectDiagram} size={12} />
                        <PanelTitle>Hierarchy</PanelTitle>
                      </PanelDragContainer>
                    ),
                    content: <HierarchyPanelContainer />
                  }
                ]
              },
              {
                tabs: [
                  {
                    id: 'propertiesPanel',
                    title: (
                      <PanelDragContainer>
                        <PanelIcon as={SlidersH} size={12} />
                        <PanelTitle>Properties</PanelTitle>
                      </PanelDragContainer>
                    ),
                    content: <PropertiesPanelContainer />
                  },
                  {
                    id: 'assetsPanel',
                    title: 'Elements',
                    content: <AssetsPanel />
                  }
                ]
              }
            ]
          }
        ]
      }
    }

    return (
      <StyledEditorContainer id="editor-container">
        <SettingsContextProvider value={settingsContext}>
          <EditorContextProvider value={editor}>
            <DialogContextProvider value={this.dialogContext}>
              <DndProvider backend={HTML5Backend}>
                <DragLayer />
                {toolbarMenu && (
                  <ToolBar
                    menu={toolbarMenu}
                    editor={editor}
                    onPublish={this.onPublishProject}
                    isPublishedScene={isPublishedScene}
                    onOpenScene={this.onOpenScene}
                    queryParams={assigneeScene}
                  />
                )}
                <WorkspaceContainer>
                  <ViewportPanelContainer />
                  <DockContainer>
                    <DockLayout
                      defaultLayout={defaultLayout}
                      style={{ pointerEvents: 'none', position: 'absolute', left: 0, top: 5, right: 5, bottom: 5 }}
                    />
                  </DockContainer>
                </WorkspaceContainer>
                <Modal
                  ariaHideApp={false}
                  isOpen={!!DialogComponent}
                  onRequestClose={this.hideDialog}
                  shouldCloseOnOverlayClick={false}
                  className="Modal"
                  overlayClassName="Overlay"
                >
                  {DialogComponent && (
                    <DialogComponent onConfirm={this.hideDialog} onCancel={this.hideDialog} {...dialogProps} />
                  )}
                </Modal>
              </DndProvider>
            </DialogContextProvider>
          </EditorContextProvider>
        </SettingsContextProvider>
      </StyledEditorContainer>
    )
  }
}

const mapStateToProps = (state: any): any => {
  return {
    adminState: selectAdminState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  fetchAdminLocations: bindActionCreators(fetchAdminLocations, dispatch),
  fetchAdminScenes: bindActionCreators(fetchAdminScenes, dispatch),
  fetchLocationTypes: bindActionCreators(fetchLocationTypes, dispatch)
})

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(EditorContainer as any)))
