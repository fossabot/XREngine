import React, { Component } from "react";
import PropTypes from "prop-types";
import configs from "../configs";
import Modal from "react-modal";
import Helmet from "next/head"
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import ToolBar from "./toolbar/ToolBar";

import HierarchyPanelContainer from "./hierarchy/HierarchyPanelContainer";
import PropertiesPanelContainer from "./properties/PropertiesPanelContainer";
import ViewportPanelContainer from "./viewport/ViewportPanelContainer";

import { defaultSettings, SettingsContextProvider } from "./contexts/SettingsContext";
import { EditorContextProvider } from "./contexts/EditorContext";
import { DialogContextProvider } from "./contexts/DialogContext";
import { OnboardingContextProvider } from "./contexts/OnboardingContext";
import { withApi } from "./contexts/ApiContext";

import { createEditor } from "../nodes/Nodes";

import ErrorDialog from "./dialogs/ErrorDialog";
import ProgressDialog from "./dialogs/ProgressDialog";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import SaveNewProjectDialog from "./dialogs/SaveNewProjectDialog";
import ExportProjectDialog from "./dialogs/ExportProjectDialog";

import Onboarding from "./onboarding/Onboarding";
import SupportDialog from "./dialogs/SupportDialog";
import { cmdOrCtrlString, objectToMap } from "./utils";
import BrowserPrompt from "./router/BrowserPrompt";
import Resizeable from "./layout/Resizeable";
import DragLayer from "./dnd/DragLayer";
import Editor from "../Editor";
import defaultTemplateUrl from "../../../pages/editor/crater.json";
import tutorialTemplateUrl from "../../../pages/editor/tutorial.json";
import { withRouter, Router } from "next/router";
import Api from "../api/Api";
'../../../pages/editor/crater.json'
const StyledEditorContainer = (styled as any).div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: fixed;
`;

const WorkspaceContainer = (styled as any).div`
  display: flex;
  flex: 1;
  overflow: hidden;
  margin: 6px;
`;

type EditorContainerProps = {
  api: Api;
  history: any;
  router: Router;
};
type EditorContainerState = {
  onboardingContext: { enabled: boolean };
  project: null;
  parentSceneId: null;
  templateUrl: any;
  settingsContext: any;
  error: null;
  editor: Editor;
  creatingProject: any;
  DialogComponent: null;
  queryParams: Map<string, string>;
  dialogProps: {};
  modified: boolean;
};

class EditorContainer extends Component<EditorContainerProps, EditorContainerState> {
  static propTypes = {
    api: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    let settings = defaultSettings;
    const storedSettings = localStorage.getItem("editor-settings");
    if (storedSettings) {
      settings = JSON.parse(storedSettings);
    }

    const editor = createEditor(props.api, settings);
    (window as any).editor = editor;
    editor.init();
    editor.addListener("initialized", this.onEditorInitialized);

    this.state = {
      error: null,
      project: null,
      parentSceneId: null,
      editor,
      queryParams: new Map(Object.entries(props.router.query)),
      settingsContext: {
        settings,
        updateSetting: this.updateSetting
      },
      onboardingContext: {
        enabled: false
      },
      creatingProject: null,
      templateUrl: defaultTemplateUrl,
      DialogComponent: null,
      dialogProps: {},
      modified: false
    };
  }

  componentDidMount() {
    const queryParams = this.state.queryParams;
    const projectId = queryParams.get("projectId");

    if (projectId === "new") {
      if (queryParams.has("template")) {
        this.loadProjectTemplate(queryParams.get("template"));
      } else if (queryParams.has("sceneId")) {
        this.loadScene(queryParams.get("sceneId"));
      } else {
        this.loadProjectTemplate(defaultTemplateUrl);
      }
    } else if (projectId === "tutorial") {
      this.loadProjectTemplate(tutorialTemplateUrl);
    } else {
      this.loadProject(projectId);
    }

    if (projectId === "tutorial") {
      this.setState({ onboardingContext: { enabled: true } });
    }
  }

  componentDidUpdate(prevProps: EditorContainerProps) {
    if (this.props.router.route !== prevProps.router.route && !this.state.creatingProject) {
      // const { projectId } = this.props.match.params;
      const prevProjectId = prevProps.router.query.projectId;
      const queryParams = objectToMap(this.props.router.query);
      this.setState({
        queryParams
      })
      const projectId = queryParams.get("projectId");
      let templateUrl = null;

      if (projectId === "new" && !queryParams.has("sceneId")) {
        templateUrl = queryParams.get("template") || defaultTemplateUrl;
      } else if (projectId === "tutorial") {
        templateUrl = tutorialTemplateUrl;
      }

      if (projectId === "new" || projectId === "tutorial") {
        this.loadProjectTemplate(templateUrl);
      } else if (prevProjectId !== "tutorial" && prevProjectId !== "new") {
        this.loadProject(projectId);
      }

      if (projectId === "tutorial") {
        this.setState({ onboardingContext: { enabled: true } });
      }
    }
  }

  async loadProjectTemplate(templateUrl) {
    this.setState({
      project: null,
      parentSceneId: null,
      templateUrl
    });

    this.showDialog(ProgressDialog, {
      title: "Loading Project",
      message: "Loading project..."
    });

    const editor = this.state.editor;

    try {
      const templateFile = await this.props.api.fetch(templateUrl).then(response => response.json());

      await editor.init();

      if (templateFile.metadata) {
        delete templateFile.metadata.sceneUrl;
        delete templateFile.metadata.sceneId;
        delete templateFile.metadata.creatorAttribution;
        delete templateFile.metadata.allowRemixing;
        delete templateFile.metadata.allowPromotion;
      }

      await editor.loadProject(templateFile);

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error loading project.",
        message: error.message || "There was an error when loading the project.",
        error
      });
    }
  }

  async loadScene(sceneId) {
    this.setState({
      project: null,
      parentSceneId: sceneId,
      templateUrl: null,
      onboardingContext: { enabled: false }
    });

    this.showDialog(ProgressDialog, {
      title: "Loading Project",
      message: "Loading project..."
    });

    const editor = this.state.editor;

    try {
      const scene = await this.props.api.getScene(sceneId);
      const projectFile = await this.props.api.fetch(scene.scene_project_url).then(response => response.json());

      if (projectFile.metadata) {
        delete projectFile.metadata.sceneUrl;
        delete projectFile.metadata.sceneId;
        delete projectFile.metadata.creatorAttribution;
        delete projectFile.metadata.allowRemixing;
        delete projectFile.metadata.allowPromotion;
      }

      await editor.init();

      await editor.loadProject(projectFile);

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error loading project.",
        message: error.message || "There was an error when loading the project.",
        error
      });
    }
  }

  async importProject(projectFile) {
    const project = this.state.project;

    this.setState({
      project: null,
      parentSceneId: null,
      templateUrl: null,
      onboardingContext: { enabled: false }
    });

    this.showDialog(ProgressDialog, {
      title: "Loading Project",
      message: "Loading project..."
    });

    const editor = this.state.editor;

    try {
      await editor.init();

      await editor.loadProject(projectFile);

      editor.sceneModified = true;
      this.updateModifiedState();

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error loading project.",
        message: error.message || "There was an error when loading the project.",
        error
      });
    } finally {
      if (project) {
        this.setState({
          project
        });
      }
    }
  }

  async loadProject(projectId) {
    this.setState({
      project: null,
      parentSceneId: null,
      templateUrl: null,
      onboardingContext: { enabled: false }
    });

    this.showDialog(ProgressDialog, {
      title: "Loading Project",
      message: "Loading project..."
    });

    const editor = this.state.editor;

    let project;

    try {
      project = await this.props.api.getProject(projectId);

      const projectFile = await this.props.api.fetch(project.project_url).then(response => response.json());

      await editor.init();

      await editor.loadProject(projectFile);

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error loading project.",
        message: error.message || "There was an error when loading the project.",
        error
      });
    } finally {
      if (project) {
        this.setState({
          project
        });
      }
    }
  }

  updateModifiedState(then?) {
    const nextModified = this.state.editor.sceneModified && !this.state.creatingProject;

    if (nextModified !== this.state.modified) {
      this.setState({ modified: nextModified }, then);
    } else if (then) {
      then();
    }
  };

  generateToolbarMenu = () => {
    return [
      {
        name: "Back to Projects",
        action: this.onOpenProject
      },
      {
        name: "File",
        items: [
          {
            name: "New Project",
            action: this.onNewProject
          },
          {
            name: "Save Project",
            hotkey: `${cmdOrCtrlString} + S`,
            action: this.onSaveProject
          },
          {
            name: "Save As",
            action: this.onDuplicateProject
          },
          {
            name: "Publish Scene...",
            action: this.onPublishProject
          },
          {
            name: "Export as binary glTF (.glb) ...",
            action: this.onExportProject
          },
          {
            name: "Import legacy .editor project",
            action: this.onImportLegacyProject
          },
          {
            name: "Export legacy .editor project",
            action: this.onExportLegacyProject
          }
        ]
      },
      {
        name: "Help",
        items: [
          {
            name: "Tutorial",
            action: () => {
              // const { projectId } = this.props.match.params;
              const projectId = null

              if (projectId === "tutorial") {
                this.setState({ onboardingContext: { enabled: true } });
              } else {
                this.props.history.push("/projects/tutorial");
              }
            }
          },
          {
            name: "Keyboard and Mouse Controls",
            action: () => window.open("https://github.com/xr3ngine/xr3ngine/wiki/Keyboard-and-Mouse-Controls")
          },
          {
            name: "Get Support",
            action: () => this.showDialog(SupportDialog)
          },
          {
            name: "Report an Issue",
            action: () => window.open("https://github.com/xr3ngine/xr3ngine/issues/new")
          },
          {
            name: "Join us on Discord",
            action: () => window.open("https://discord.gg/mQ3D4FE")
          },
          {
            name: "Terms of Use",
            action: () => window.open("https://github.com/xr3ngine/xr3ngine/blob/master/TERMS.md")
          },
          {
            name: "Privacy Notice",
            action: () => window.open("https://github.com/xr3ngine/xr3ngine/blob/master/PRIVACY.md")
          }
        ]
      },
      {
        name: "Developer",
        items: [
          {
            name: this.state.settingsContext.settings.enableExperimentalFeatures
              ? "Disable Experimental Features"
              : "Enable Experimental Features",
            action: () =>
              this.updateSetting(
                "enableExperimentalFeatures",
                !this.state.settingsContext.settings.enableExperimentalFeatures
              )
          }
        ]
      }
    ];
  };

  onEditorInitialized = () => {
    const editor = this.state.editor;

    const gl = this.state.editor.renderer.renderer.context;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    let webglVendor = "Unknown";
    let webglRenderer = "Unknown";

    if (debugInfo) {
      webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    window.addEventListener("resize", this.onResize);
    this.onResize();
    editor.addListener("projectLoaded", this.onProjectLoaded);
    editor.addListener("error", this.onEditorError);
    editor.addListener("sceneModified", this.onSceneModified);
    editor.addListener("saveProject", this.onSaveProject);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);

    const editor = this.state.editor;
    editor.removeListener("sceneModified", this.onSceneModified);
    editor.removeListener("saveProject", this.onSaveProject);
    editor.removeListener("initialized", this.onEditorInitialized);
    editor.removeListener("error", this.onEditorError);
    editor.removeListener("projectLoaded", this.onProjectLoaded);
    editor.dispose();
  }

  onResize = () => {
    this.state.editor.onResize();
  };

  /**
   *  Dialog Context
   */

  showDialog = (DialogComponent, dialogProps = {}) => {
    this.setState({
      DialogComponent,
      dialogProps
    });
  };

  hideDialog = () => {
    this.setState({
      DialogComponent: null,
      dialogProps: {}
    });
  };

  dialogContext = {
    showDialog: this.showDialog,
    hideDialog: this.hideDialog
  };

  /**
   * Scene Event Handlers
   */

  onEditorError = error => {
    if (error["aborted"]) {
      this.hideDialog();
      return;
    }

    console.error(error);

    this.showDialog(ErrorDialog, {
      title: error.title || "Error",
      message: error.message || "There was an unknown error.",
      error
    });
  };

  onSceneModified = () => {
    this.updateModifiedState();
  };

  onProjectLoaded = () => {
    this.updateModifiedState();
  };

  updateSetting(key, value) {
    const settings = Object.assign(this.state.settingsContext.settings, { [key]: value });
    localStorage.setItem("editor-settings", JSON.stringify(settings));
    const editor = this.state.editor;
    editor.settings = settings;
    editor.emit("settingsChanged");
    this.setState({
      settingsContext: {
        ...this.state.settingsContext,
        settings
      }
    });
  }

  /**
   *  Project Actions
   */

  async createProject() {
    const { editor, parentSceneId } = this.state as any;

    this.showDialog(ProgressDialog, {
      title: "Generating Project Screenshot",
      message: "Generating project screenshot..."
    });

    // Wait for 5ms so that the ProgressDialog shows up.
    await new Promise(resolve => setTimeout(resolve, 5));

    const blob = await editor.takeScreenshot(512, 320);

    const result: any = await new Promise(resolve => {
      this.showDialog(SaveNewProjectDialog, {
        thumbnailUrl: URL.createObjectURL(blob),
        initialName: editor.scene.name,
        onConfirm: resolve,
        onCancel: resolve
      });
    }) as any;

    if (!result) {
      this.hideDialog();
      return null;
    }

    const abortController = new AbortController();

    this.showDialog(ProgressDialog, {
      title: "Saving Project",
      message: "Saving project...",
      cancelable: true,
      onCancel: () => {
        abortController.abort();
        this.hideDialog();
      }
    });

    editor.setProperty(editor.scene, "name", result.name, false);
    editor.scene.setMetadata({ name: result.name });

    const project = await this.props.api.createProject(
      editor.scene,
      parentSceneId,
      blob,
      abortController.signal,
      this.showDialog,
      this.hideDialog
    );

    editor.sceneModified = false;

    this.updateModifiedState(() => {
      this.setState({ creatingProject: true, project }, () => {
        this.props.history.replace(`/projects/${project.project_id}`);
        this.setState({ creatingProject: false });
      });
    });

    return project;
  }

  onNewProject = async () => {
    this.props.history.push("/projects/templates");
  };

  onOpenProject = () => {
    this.props.history.push("/projects");
  };

  onSaveProject = async () => {

    const abortController = new AbortController();

    this.showDialog(ProgressDialog, {
      title: "Saving Project",
      message: "Saving project...",
      cancelable: true,
      onCancel: () => {
        abortController.abort();
        this.hideDialog();
      }
    });

    // Wait for 5ms so that the ProgressDialog shows up.
    await new Promise(resolve => setTimeout(resolve, 5));

    try {
      const { editor, project } = this.state as any;

      if (project) {
        const newProject = await this.props.api.saveProject(
          project.project_id,
          editor,
          abortController.signal,
          this.showDialog,
          this.hideDialog
        );

        this.setState({ project: newProject });
      } else {
        await this.createProject();
      }

      editor.sceneModified = false;
      this.updateModifiedState();

      this.hideDialog();

    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error Saving Project",
        message: error.message || "There was an error when saving the project."
      });

    }
  };

  onDuplicateProject = async () => {
    const abortController = new AbortController();
    this.showDialog(ProgressDialog, {
      title: "Duplicating Project",
      message: "Duplicating project...",
      cancelable: true,
      onCancel: () => {
        abortController.abort();
        this.hideDialog();
      }
    });
    await new Promise(resolve => setTimeout(resolve, 5));
    try {
      const editor = this.state.editor;
      await this.createProject();
      editor.sceneModified = false;
      this.updateModifiedState();

      this.hideDialog();
    } catch (error) {
      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error Saving Project",
        message: error.message || "There was an error when saving the project."
      });
    }
  };

  onExportProject = async () => {
    const options = await new Promise(resolve => {
      this.showDialog(ExportProjectDialog, {
        defaultOptions: Object.assign({}, Editor.DefaultExportOptions),
        onConfirm: resolve,
        onCancel: resolve
      });
    });

    if (!options) {
      this.hideDialog();
      return;
    }

    const abortController = new AbortController();

    this.showDialog(ProgressDialog, {
      title: "Exporting Project",
      message: "Exporting project...",
      cancelable: true,
      onCancel: () => abortController.abort()
    });

    try {
      const editor = this.state.editor;

      const { glbBlob } = await editor.exportScene(abortController.signal, options);

      this.hideDialog();

      const el = document.createElement("a");
      el.download = editor.scene.name + ".glb";
      el.href = URL.createObjectURL(glbBlob);
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);

    } catch (error) {
      if (error["aborted"]) {
        this.hideDialog();
        return;
      }

      console.error(error);

      this.showDialog(ErrorDialog, {
        title: "Error Exporting Project",
        message: error.message || "There was an error when exporting the project.",
        error
      });
    }
  };

  onImportLegacyProject = async () => {
    const confirm = await new Promise(resolve => {
      this.showDialog(ConfirmDialog, {
        title: "Import Legacy World",
        message: "Warning! This will overwrite your existing scene! Are you sure you wish to continue?",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false)
      });
    });

    this.hideDialog();

    if (!confirm) return;

    const el = document.createElement("input");
    el.type = "file";
    el.accept = ".world";
    el.style.display = "none";
    el.onchange = () => {
      if (el.files.length > 0) {
        const fileReader: any = new FileReader();
        fileReader.onload = () => {
          const json = JSON.parse((fileReader as any).result);

          if (json.metadata) {
            delete json.metadata.sceneUrl;
            delete json.metadata.sceneId;
          }

          this.importProject(json);
        };
        fileReader.readAsText(el.files[0]);
      }
    };
    el.click();

  };

  onExportLegacyProject = async () => {
    const editor = this.state.editor;
    const projectFile = editor.scene.serialize();

    if (projectFile.metadata) {
      delete projectFile.metadata.sceneUrl;
      delete projectFile.metadata.sceneId;
    }

    const projectJson = JSON.stringify(projectFile);
    const projectBlob = new Blob([projectJson]);
    const el = document.createElement("a");
    const fileName = this.state.editor.scene.name.toLowerCase().replace(/\s+/g, "-");
    el.download = fileName + ".world";
    el.href = URL.createObjectURL(projectBlob);
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  onPublishProject = async () => {
    try {
      const editor = this.state.editor;
      let project = this.state.project;

      if (!project) {
        project = await this.createProject();
      }

      if (!project) {
        return;
      }

      project = await this.props.api.publishProject(project, editor, this.showDialog, this.hideDialog);

      if (!project) {
        return;
      }

      editor.sceneModified = false;
      this.updateModifiedState();

      this.setState({ project });
    } catch (error) {
      if (error["aborted"]) {
        this.hideDialog();
        return;
      }

      console.error(error);
      this.showDialog(ErrorDialog, {
        title: "Error Publishing Project",
        message: error.message || "There was an unknown error.",
        error
      });
    }
  };

  getSceneId() {
    const { editor, project } = this.state as any;
    return (
      (project && project.scene && project.scene.scene_id) || (editor.scene.metadata && editor.scene.metadata.sceneId)
    );
  }

  onOpenScene = () => {
    const sceneId = this.getSceneId();

    if (sceneId) {
      const url = this.props.api.getSceneUrl(sceneId);
      window.open(url);
    }
  };

  onFinishTutorial = nextAction => {
    this.setState({ onboardingContext: { enabled: false } });
  };

  onSkipTutorial = lastCompletedStep => {
    this.setState({ onboardingContext: { enabled: false } });
  };

  render() {
    const { DialogComponent, dialogProps, modified, settingsContext, onboardingContext, editor } = this.state;
    const toolbarMenu = this.generateToolbarMenu();
    const isPublishedScene = !!this.getSceneId();

    return (
      <StyledEditorContainer id="editor-container">
        <SettingsContextProvider value={settingsContext}>
          <EditorContextProvider value={editor}>
            <DialogContextProvider value={this.dialogContext}>
              <OnboardingContextProvider value={onboardingContext}>
                <DndProvider backend={HTML5Backend}>
                  <DragLayer />
                  {toolbarMenu && <ToolBar
                    menu={toolbarMenu}
                    editor={editor}
                    onPublish={this.onPublishProject}
                    isPublishedScene={isPublishedScene}
                    onOpenScene={this.onOpenScene}
                  />}
                  <WorkspaceContainer>
                    <Resizeable axis="x" initialSizes={[0.7, 0.3]} onChange={this.onResize}>
                      <ViewportPanelContainer />
                      <Resizeable axis="y" initialSizes={[0.5, 0.5]}>
                        <HierarchyPanelContainer />
                        <PropertiesPanelContainer />
                      </Resizeable>
                    </Resizeable>
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
                  <Helmet>
                    <title>{`${modified ? "*" : ""}${editor.scene.name} | ${(configs as any).longName()}`}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                  </Helmet>
                  {modified && (
                    <BrowserPrompt
                      message={`${editor.scene.name} has unsaved changes, are you sure you wish to navigate away from the page?`}
                    />
                  )}
                  {onboardingContext.enabled && (
                    <Onboarding onFinish={this.onFinishTutorial} onSkip={this.onSkipTutorial} />
                  )}
                </DndProvider>
              </OnboardingContextProvider>
            </DialogContextProvider>
          </EditorContextProvider>
        </SettingsContextProvider>
      </StyledEditorContainer>
    );
  }
}

export default withRouter(withApi(EditorContainer));
