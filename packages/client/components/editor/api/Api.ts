// @ts-nocheck

import EventEmitter from "eventemitter3";
import jwtDecode from "jwt-decode";
import { buildAbsoluteURL } from "url-toolkit";
import { client } from "../../../redux/feathers";
import configs from "../configs";
import { AudioFileTypes, matchesFileTypes } from "../ui/assets/fileTypes";
import PerformanceCheckDialog from "../ui/dialogs/PerformanceCheckDialog";
import ProgressDialog from "../ui/dialogs/ProgressDialog";
import { RethrownError } from "../utils/errors";
import PublishDialog from "./PublishDialog";
import PublishedSceneDialog from "./PublishedSceneDialog";

const resolveUrlCache = new Map();
const resolveMediaCache = new Map();

const API_SERVER_ADDRESS = (configs as any).API_SERVER_ADDRESS;

const {
  API_ASSETS_ROUTE,
  API_ASSETS_ACTION,
  API_MEDIA_ROUTE,
  API_MEDIA_SEARCH_ROUTE,
  API_META_ROUTE,
  API_PROJECT_PUBLISH_ACTION,
  API_PROJECTS_ROUTE,
  API_RESOLVE_MEDIA_ROUTE,
  API_SCENES_ROUTE,
  CLIENT_ADDRESS,
  CLIENT_SCENE_ROUTE,
  CLIENT_LOCAL_SCENE_ROUTE,
  CORS_PROXY_SERVER,
  THUMBNAIL_ROUTE,
  THUMBNAIL_SERVER,
  USE_DIRECT_UPLOAD_API,
  NON_CORS_PROXY_DOMAINS,
  USE_HTTPS
} = configs as any;

const prefix = USE_HTTPS ? "https://" : "http://";

function b64EncodeUnicode(str): string {
  // first we use encodeURIComponent to get percent-encoded UTF-8, then we convert the percent-encodings
  // into raw bytes which can be fed into btoa.
  const CHAR_RE = /%([0-9A-F]{2})/g;
  return btoa(encodeURIComponent(str).replace(CHAR_RE, (_, p1) => String.fromCharCode(("0x" + p1) as any)));
}

const farsparkEncodeUrl = (url): string => {
  // farspark doesn't know how to read '=' base64 padding characters
  // translate base64 + to - and / to _ for URL safety
  return b64EncodeUnicode(url)
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const nonCorsProxyDomains = (NON_CORS_PROXY_DOMAINS || "").split(",");
if (CORS_PROXY_SERVER) {
  nonCorsProxyDomains.push(CORS_PROXY_SERVER);
}

function shouldCorsProxy(url): boolean {
  // Skip known domains that do not require CORS proxying.
  try {
    const parsedUrl = new URL(url);
    if (nonCorsProxyDomains.find(domain => parsedUrl.hostname.endsWith(domain))) return false;
  } catch (e) {
    // Ignore
  }

  return true;
}

export const proxiedUrlFor = url => {
  // if (!(url.startsWith("http:") || url.startsWith("https:"))) return url;

  // if (!shouldCorsProxy(url)) {
  //   return url;
  // }

  // return `${prefix}${CORS_PROXY_SERVER}/${url}`;
  return url;
};

export const scaledThumbnailUrlFor = (url, width, height) => {
  if (API_SERVER_ADDRESS.includes("localhost") && url.includes("localhost")) {
    return url;
  }

  return `${prefix}${THUMBNAIL_SERVER}${THUMBNAIL_ROUTE}${farsparkEncodeUrl(url)}?w=${width}&h=${height}`;
};

const CommonKnownContentTypes = {
  gltf: "model/gltf",
  glb: "model/gltf-binary",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  pdf: "application/pdf",
  mp4: "video/mp4",
  mp3: "audio/mpeg"
};

function guessContentType(url): string {
  const extension = new URL(url).pathname.split(".").pop();
  return CommonKnownContentTypes[extension];
}

const LOCAL_STORE_KEY = " ";

export default class Api extends EventEmitter {
  serverURL: string;
  apiURL: string;
  projectDirectoryPath: string;
  maxUploadSize: number;
  props: any;
  constructor() {
    super();
    if (process.browser) {
      const { protocol, host } = new URL((window as any).location.href);
      this.serverURL = protocol + "//" + host;
    }
    
    this.apiURL = `${prefix}${API_SERVER_ADDRESS}`;

    this.projectDirectoryPath = "/api/files/";

    // Max size in MB
    this.maxUploadSize = 128;

    // This will manage the not authorized users
    this.handleAuthorization();
  }

  isAuthenticated(): boolean {
    const value = localStorage.getItem(LOCAL_STORE_KEY);

    const store = JSON.parse(value);

    return !!(store && store.credentials && store.credentials.token);
  }

  getToken(): string {
    const value = localStorage.getItem(LOCAL_STORE_KEY);

    if (!value) {
      throw new Error("Not authenticated");
    }

    const store = JSON.parse(value);
    
    if (!store || !store.credentials || !store.credentials.token) {
      throw new Error("Not authenticated");
    }

    return store.credentials.token;
  }

  getAccountId(): string {
    const token = this.getToken();
    return jwtDecode(token).sub;
  }

  async getProjects(): any {
    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const response = await this.fetch(`${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}`, { headers });

    console.log("Response: " + Object.values(response));

    const json = await response.json();

    if (!Array.isArray(json.projects)) {
      throw new Error(`Error fetching projects: ${json.error || "Unknown error."}`);
    }

    return json.projects;
  }

  async getProject(projectId): JSON {
    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const response = await this.fetch(`${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}/${projectId}`, {
      headers
    });

    const json = await response.json();
    console.log("Response: " + Object.values(response));

    return json;
  }

  async resolveUrl(url, index?): string {
    if (!shouldCorsProxy(url)) {
      return { origin: url };
    }

    const cacheKey = `${url}|${index}`;
    if (resolveUrlCache.has(cacheKey)) return resolveUrlCache.get(cacheKey);
    const request = this.fetch(`${prefix}${API_SERVER_ADDRESS}${API_RESOLVE_MEDIA_ROUTE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media: { url, index } })
    })
    // client.service("resolve-media").create({ media: { url, index } })
    .then(async response => {
    if (!response.ok) {
        const message = `Error resolving url "${url}":\n  `;
        try {
          const body = await response.text();
          throw new Error(message + body.replace(/\n/g, "\n  "));
        } catch (e) {
          throw new Error(message + response.statusText.replace(/\n/g, "\n  "));
        }
      }
      console.log("Response: " + Object.values(response));

      return response.json();
    }).catch(e => {
      console.warn(e);
    });

    resolveUrlCache.set(cacheKey, request);

    return request;
  }

  fetchContentType(accessibleUrl): string {
    const f = this.fetch(accessibleUrl, { method: "HEAD" }).then(r => r.headers.get("content-type"));
    console.log("Response: " + Object.values(f));

    return f;
  }

  async getContentType(url): string {
    const result = await this.resolveUrl(url);
    const canonicalUrl = result.origin;
    const accessibleUrl = proxiedUrlFor(canonicalUrl);

    return (
      (result.meta && result.meta.expected_content_type) ||
      guessContentType(canonicalUrl) ||
      (await this.fetchContentType(accessibleUrl))
    );
  }

  async resolveMedia(url, index): any {
    const absoluteUrl = new URL(url, (window as any).location).href;

    if (absoluteUrl.startsWith(this.serverURL)) {
      return { accessibleUrl: absoluteUrl };
    }

    const cacheKey = `${absoluteUrl}|${index}`;

    if (resolveMediaCache.has(cacheKey)) return resolveMediaCache.get(cacheKey);

    const request = (async () => {
      let contentType, canonicalUrl, accessibleUrl;

      try {
        const result = await this.resolveUrl(absoluteUrl);
        canonicalUrl = result.origin;
        accessibleUrl = proxiedUrlFor(canonicalUrl);

        contentType =
          (result.meta && result.meta.expected_content_type) ||
          guessContentType(canonicalUrl) ||
          (await this.fetchContentType(accessibleUrl));
      } catch (error) {
        throw new RethrownError(`Error resolving media "${absoluteUrl}"`, error);
      }

      try {
        if (contentType === "model/gltf+zip") {
          // TODO: Sketchfab object urls should be revoked after they are loaded by the glTF loader.
          const { getFilesFromSketchfabZip } = await import(
            /* webpackChunkName: "SketchfabZipLoader", webpackPrefetch: true */ "./SketchfabZipLoader"
          );
          const files = await getFilesFromSketchfabZip(accessibleUrl);
          return { canonicalUrl, accessibleUrl: files["scene.gtlf"].url, contentType, files };
        }
      } catch (error) {
        throw new RethrownError(`Error loading Sketchfab model "${accessibleUrl}"`, error);
      }

      return { canonicalUrl, accessibleUrl, contentType };
    })();

    resolveMediaCache.set(cacheKey, request);

    return request;
  }

  proxyUrl(url): any {
    return proxiedUrlFor(url);
  }

  unproxyUrl(baseUrl, url): any {
    if (CORS_PROXY_SERVER) {
      const corsProxyPrefix = `${prefix}${CORS_PROXY_SERVER}/`;

      if (baseUrl.startsWith(corsProxyPrefix)) {
        baseUrl = baseUrl.substring(corsProxyPrefix.length);
      }

      if (url.startsWith(corsProxyPrefix)) {
        url = url.substring(corsProxyPrefix.length);
      }
    }

    // HACK HLS.js resolves relative urls internally, but our CORS proxying screws it up. Resolve relative to the original unproxied url.
    // TODO extend HLS.js to allow overriding of its internal resolving instead
    if (!url.startsWith("http")) {
      url = buildAbsoluteURL(baseUrl, url.startsWith("/") ? url : `/${url}`);
    }

    return proxiedUrlFor(url);
  }
  
  async searchMedia(source, params, cursor, signal): any {
    const url = new URL(`${prefix}${API_SERVER_ADDRESS}${API_MEDIA_ROUTE}${API_MEDIA_SEARCH_ROUTE}`);

    const headers: any = {
      "content-type": "application/json"
    };

    const searchParams = url.searchParams;

    searchParams.set("source", source);

    if (source === "assets") {
      searchParams.set("user", this.getAccountId());
      const token = this.getToken();
      headers.authorization = `Bearer ${token}`;
    }

    if (params.type) {
      searchParams.set("type", params.type);
    }

    if (params.query) {
      //checking BLOCK_SEARCH_TERMSsearchParams.set("q", params.query);
    }

    if (params.filter) {
      searchParams.set("filter", params.filter);
    }

    if (params.collection) {
      searchParams.set("collection", params.collection);
    }

    if (cursor) {
      searchParams.set("cursor", cursor);
    }

    console.log("Fetching...");
    const resp = await this.fetch(url, { headers, signal });
    console.log("Response: " + Object.values(resp));

    if (signal.aborted) {
      const error = new Error("Media search aborted") as any;
      error["aborted"] = true;
      throw error;
    }

    const json = await resp.json();

    if (signal.aborted) {
      const error = new Error("Media search aborted") as any;
      error["aborted"] = true;
      throw error;
    }

    const thumbnailedEntries = json.entries.map(entry => {
      if (entry.images && entry.images.preview && entry.images.preview.url) {
        if (entry.images.preview.type === "mp4") {
          entry.images.preview.url = proxiedUrlFor(entry.images.preview.url);
        } else {
          entry.images.preview.url = scaledThumbnailUrlFor(entry.images.preview.url, 200, 200);
        }
      }
      return entry;
    });

    return {
      results: thumbnailedEntries,
      suggestions: json.suggestions,
      nextCursor: json.meta.next_cursor
    };
  }
  searchTermFilteringBlacklist(query: any): any {
    throw new Error("Method not implemented.");
  }

  async createProject(scene, parentSceneId, thumbnailBlob, signal, showDialog, hideDialog): Promise<any> {
    this.emit("project-saving");

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    const {
      file_id: thumbnailFileId,
      meta: { access_token: thumbnailFileToken }
    } = await this.upload(thumbnailBlob, undefined, signal) as any;

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    const serializedScene = scene.serialize();
    const projectBlob = new Blob([JSON.stringify(serializedScene)], { type: "application/json" });
    const {
      file_id: projectFileId,
      meta: { access_token: projectFileToken }
    } = await this.upload(projectBlob, undefined, signal) as any;

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const project = {
      name: scene.name,
      thumbnail_file_id: thumbnailFileId,
      thumbnail_file_token: thumbnailFileToken,
      project_file_id: projectFileId,
      project_file_token: projectFileToken
    };

    if (parentSceneId) {
      project["parent_scene_id"] = parentSceneId;
    }

    const body = JSON.stringify({ project });

    const projectEndpoint = `${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}`;

    const resp = await this.fetch(projectEndpoint, { method: "POST", headers, body, signal });
    console.log("Response: " + Object.values(resp));

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    if (resp.status !== 200) {
      throw new Error(`Project creation failed. ${await resp.text()}`);
    }

    const json = await resp.json();

    this.emit("project-saved");

    return json;
  }

  async deleteProject(projectId): any {
    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const projectEndpoint = `${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}/${projectId}`;

    const resp = await this.fetch(projectEndpoint, { method: "DELETE", headers });
    console.log("Response: " + Object.values(resp));

    if (resp.status === 401) {
      throw new Error("Not authenticated");
    }

    if (resp.status !== 200) {
      throw new Error(`Project deletion failed. ${await resp.text()}`);
    }

    return true;
  }

  async saveProject(projectId, editor, signal, showDialog, hideDialog): any {
    this.emit("project-saving");

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    const thumbnailBlob = await editor.takeScreenshot(512, 320); // Fixed blob undefined

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    const {
      file_id: thumbnailFileId,
      meta: { access_token: thumbnailFileToken }
    } = await this.upload(thumbnailBlob, undefined, signal, projectId) as any;

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    const serializedScene = editor.scene.serialize();
    const projectBlob = new Blob([JSON.stringify(serializedScene)], { type: "application/json" });
    const {
      file_id: projectFileId,
      meta: { access_token: projectFileToken }
    } = await this.upload(projectBlob, undefined, signal) as any;

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const project = {
      name: editor.scene.name,
      thumbnail_file_id: thumbnailFileId,
      thumbnail_file_token: thumbnailFileToken,
      project_file_id: projectFileId,
      project_file_token: projectFileToken
    };

    const sceneId = editor.scene.metadata && editor.scene.metadata.sceneId ? editor.scene.metadata.sceneId : null;

    if (sceneId) {
      project["scene_id"] = sceneId;
    }

    const body = JSON.stringify({
      project
    });

    const projectEndpoint = `${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}/${projectId}`;

    const resp = await this.fetch(projectEndpoint, { method: "PATCH", headers, body, signal });
    console.log("Response: " + Object.values(resp));

    const json = await resp.json();

    if (signal.aborted) {
      throw new Error("Save project aborted");
    }

    if (resp.status !== 200) {
      throw new Error(`Saving project failed. ${await resp.text()}`);
    }

    this.emit("project-saved");

    return json;
  }

  async getProjectFile(sceneId): any {
    return await this.props.api.getScene(sceneId);
    // TODO: Make this a main branch thing
    // const scene = await this.props.api.getScene(sceneId);
    // return await this.props.api.fetch(scene.scene_project_url).then(response => response.json());
  }

  async getScene(sceneId): JSON {
    const headers = {
      "content-type": "application/json"
    };

    const response = await this.fetch(`${prefix}${API_SERVER_ADDRESS}${API_SCENES_ROUTE}/${sceneId}`, {
      headers
    });

    console.log("Response: " + Object.values(response));

    const json = await response.json();

    return json.scenes[0];
  }

  getSceneUrl(sceneId): string {
    // If we recognize a local address relative to this Editor instance
    if (CLIENT_ADDRESS === "localhost:8080") {
      return `${prefix}${CLIENT_ADDRESS}${CLIENT_LOCAL_SCENE_ROUTE}${sceneId}`;
    } else {
      return `${prefix}${CLIENT_ADDRESS}${CLIENT_SCENE_ROUTE}${sceneId}`;
    }
  }

  async publishProject(project, editor, showDialog, hideDialog?): any {
    let screenshotUrl;

    try {
      const scene = editor.scene;

      const abortController = new AbortController();
      const signal = abortController.signal;

      // Save the scene if it has been modified.
      if (editor.sceneModified) {
        showDialog(ProgressDialog, {
          title: "Saving Project",
          message: "Saving project...",
          cancelable: true,
          onCancel: () => {
            abortController.abort();
          }
        });

        project = await this.saveProject(project.project_id, editor, signal, showDialog, hideDialog);

        if (signal.aborted) {
          const error = new Error("Publish project aborted");
          error["aborted"] = true;
          throw error;
        }
      }

      showDialog(ProgressDialog, {
        title: "Generating Project Screenshot",
        message: "Generating project screenshot..."
      });

      // Wait for 5ms so that the ProgressDialog shows up.
      await new Promise(resolve => setTimeout(resolve, 5));

      // Take a screenshot of the scene from the current camera position to use as the thumbnail
      const screenshot = await editor.takeScreenshot();
      console.log("Screenshot is");
      console.log(screenshot);
      const { blob: screenshotBlob, cameraTransform: screenshotCameraTransform } = screenshot;
      console.log("screenshotBlob is");
      console.log(screenshotBlob);

      screenshotUrl = URL.createObjectURL(screenshotBlob);

      console.log("Screenshot url is", screenshotUrl);

      if (signal.aborted) {
        const error = new Error("Publish project aborted");
        error["aborted"] = true;
        throw error;
      }

      const userInfo = this.getUserInfo();

      // Gather all the info needed to display the publish dialog
      let { name, creatorAttribution, allowRemixing, allowPromotion } = scene.metadata;

      name = (project.scene && project.scene.name) || name || editor.scene.name;

      if (project.scene) {
        allowPromotion = project.scene.allow_promotion;
        allowRemixing = project.scene.allow_remixing;
        creatorAttribution = project.scene.attributions.creator || "";
      } else if ((!creatorAttribution || creatorAttribution.length === 0) && userInfo && userInfo.creatorAttribution) {
        creatorAttribution = userInfo.creatorAttribution;
      }

      const contentAttributions = scene.getContentAttributions();

      // Display the publish dialog and wait for the user to submit / cancel
      const publishParams: any = await new Promise(resolve => {
        showDialog(PublishDialog, {
          screenshotUrl,
          contentAttributions,
          initialSceneParams: {
            name,
            creatorAttribution: creatorAttribution || "",
            allowRemixing: typeof allowRemixing !== "undefined" ? allowRemixing : false,
            allowPromotion: typeof allowPromotion !== "undefined" ? allowPromotion : false
          },
          onCancel: () => resolve(null),
          onPublish: resolve
        });
      });

      // User clicked cancel
      if (!publishParams) {
        URL.revokeObjectURL(screenshotUrl);
        hideDialog();
        const error = new Error("Publish project aborted");
        error["aborted"] = true;
        throw error;
      }

      // Update the scene with the metadata from the publishDialog
      scene.setMetadata({
        name: publishParams.name,
        creatorAttribution: publishParams.creatorAttribution,
        allowRemixing: publishParams.allowRemixing,
        allowPromotion: publishParams.allowPromotion,
        previewCameraTransform: screenshotCameraTransform
      });

      // Save the creatorAttribution to localStorage so that the user doesn't have to input it again
      this.setUserInfo({ creatorAttribution: publishParams.creatorAttribution });

      showDialog(ProgressDialog, {
        title: "Publishing Scene",
        message: "Exporting scene...",
        cancelable: true,
        onCancel: () => {
          abortController.abort();
        }
      });

      // Clone the existing scene, process it for exporting, and then export as a glb blob
      const { glbBlob, scores } = await editor.exportScene(abortController.signal, { scores: true });

      if (signal.aborted) {
        const error = new Error("Publish project aborted");
        error["aborted"] = true;
        throw error;
      }

      const performanceCheckResult = await new Promise(resolve => {
        showDialog(PerformanceCheckDialog, {
          scores,
          onCancel: () => resolve(false),
          onConfirm: () => resolve(true)
        });
      });

      if (!performanceCheckResult) {
        const error = new Error("Publish project canceled");
        error["aborted"] = true;
        throw error;
      }

      // Serialize Editor scene
      const serializedScene = editor.scene.serialize();
      const sceneBlob = new Blob([JSON.stringify(serializedScene)], { type: "application/json" });

      showDialog(ProgressDialog, {
        title: "Publishing Scene",
        message: `Publishing scene`,
        cancelable: true,
        onCancel: () => {
          abortController.abort();
        }
      });

      const size = glbBlob.size / 1024 / 1024;
      const maxSize = this.maxUploadSize;
      if (size > maxSize) {
        throw new Error(`Scene is too large (${size.toFixed(2)}MB) to publish. Maximum size is ${maxSize}MB.`);
      }

      showDialog(ProgressDialog, {
        title: "Publishing Scene",
        message: "Uploading thumbnail...",
        cancelable: true,
        onCancel: () => {
          abortController.abort();
        }
      });

      // Upload the screenshot file
      const {
        file_id: screenshotId,
        meta: { access_token: screenshotToken }
      } = await this.upload(screenshotBlob, undefined, abortController.signal) as any;

      if (signal.aborted) {
        const error = new Error("Publish project aborted");
        error["aborted"] = true;
        throw error;
      }

      const {
        file_id: glbId,
        meta: { access_token: glbToken }
      }: any = await this.upload(glbBlob, uploadProgress => {
        showDialog(
          ProgressDialog,
          {
            title: "Publishing Scene",
            message: `Uploading scene: ${Math.floor(uploadProgress * 100)}%`,
            onCancel: () => {
              abortController.abort();
            }
          },
          abortController.signal
        );
      });

      if (signal.aborted) {
        const error = new Error("Publish project aborted");
        error["aborted"] = true;
        throw error;
      }

      const {
        file_id: sceneFileId,
        meta: { access_token: sceneFileToken }
      } = await this.upload(sceneBlob, undefined, abortController.signal) as any;

      if (signal.aborted) {
        const error = new Error("Publish project aborted");
        error["aborted"] = true;
        throw error;
      }

      const sceneParams = {
        screenshot_file_id: screenshotId,
        screenshot_file_token: screenshotToken,
        model_file_id: glbId,
        model_file_token: glbToken,
        scene_file_id: sceneFileId,
        scene_file_token: sceneFileToken,
        allow_remixing: publishParams.allowRemixing,
        allow_promotion: publishParams.allowPromotion,
        name: publishParams.name,
        attributions: {
          creator: publishParams.creatorAttribution,
          content: publishParams.contentAttributions
        }
      };

      const token = this.getToken();

      const headers = {
        "content-type": "application/json",
        authorization: `Bearer ${token}`
      };
      const body = JSON.stringify({ scene: sceneParams });

      const resp = await this.fetch(
        `${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}/${project.project_id}${API_PROJECT_PUBLISH_ACTION}`,
        {
          method: "POST",
          headers,
          body
        }
      );

      console.log("Response: " + Object.values(resp));

      if (signal.aborted) {
        const error = new Error("Publish project aborted");
        error["aborted"] = true;
        throw error;
      }

      if (resp.status !== 200) {
        throw new Error(`Scene creation failed. ${await resp.text()}`);
      }

      project = await resp.json();

      showDialog(PublishedSceneDialog, {
        sceneName: sceneParams.name,
        screenshotUrl,
        sceneUrl: this.getSceneUrl(project.scene.scene_id),
        onConfirm: () => {
          this.emit("project-published");
          hideDialog();
        }
      });
    } finally {
      if (screenshotUrl) {
        URL.revokeObjectURL(screenshotUrl);
      }
    }

    return project;
  }

  async upload(blob, onUploadProgress, signal?, projectId?): Proimse<void> {
    let host, port;
    const token = this.getToken();

    if (USE_DIRECT_UPLOAD_API) {
      const { phx_host: uploadHost } = await (
        await this.fetch(`${prefix}${API_SERVER_ADDRESS}${API_META_ROUTE}`)
      ).json();
      const uploadPort = new URL(`${prefix}${API_SERVER_ADDRESS}`).port;
      host = uploadHost;
      port = uploadPort;
    }

    return await new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      const onAbort = () => {
        request.abort();
        const error = new Error("Upload aborted");
        error.name = "AbortError";
        error["aborted"] = true;
        reject(error);
      };

      if (signal) {
        signal.addEventListener("abort", onAbort);
      }
      console.log("Posting to: ", `https://${API_SERVER_ADDRESS}/media`);

      if (USE_DIRECT_UPLOAD_API) {
        request.open("post", `${host}${API_MEDIA_ROUTE}`, true);
      } else {
        request.open("post", `${prefix}${API_SERVER_ADDRESS}${API_MEDIA_ROUTE}`, true);
      }

      request.upload.addEventListener("progress", e => {
        if (onUploadProgress) {
          onUploadProgress(e.loaded / e.total);
        }
      });

      request.addEventListener("error", error => {
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }
        reject(new RethrownError("Upload failed", error));
      });

      request.addEventListener("load", () => {
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }

        if (request.status < 300) {
          const response = JSON.parse(request.responseText);
          resolve(response);
        } else {
          reject(new Error(`Upload failed ${request.statusText}`));
        }
      });

      const formData = new FormData();
      formData.set("projectId", projectId);
      formData.set("media", blob);

      request.setRequestHeader('Authorization', `Bearer ${token}`);

      request.send(formData);
    });
  }

  uploadAssets(editor, files, onProgress, signal): any {
    return this._uploadAssets(`${prefix}${API_SERVER_ADDRESS}${API_ASSETS_ROUTE}`, editor, files, onProgress, signal);
  }

  async _uploadAssets(endpoint, editor, files, onProgress, signal): any {
    const assets = [];

    for (const file of Array.from(files)) {
      if (signal.aborted) {
        break;
      }

      const abortController = new AbortController();
      const onAbort = () => abortController.abort();
      signal.addEventListener("abort", onAbort);

      const asset = await this._uploadAsset(
        endpoint,
        editor,
        file,
        progress => onProgress(assets.length + 1, files.length, progress),
        abortController.signal
      );

      assets.push(asset);
      signal.removeEventListener("abort", onAbort);

      if (signal.aborted) {
        break;
      }
    }

    return assets;
  }

  uploadAsset(editor, file, onProgress, signal): any {
    return this._uploadAsset(`${prefix}${API_SERVER_ADDRESS}${API_ASSETS_ROUTE}`, editor, file, onProgress, signal);
  }

  uploadProjectAsset(editor, projectId, file, onProgress, signal): any {
    return this._uploadAsset(
      `${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}/${projectId}${API_ASSETS_ACTION}`,
      editor,
      file,
      onProgress,
      signal
    );
  }

  lastUploadAssetRequest = 0;

  async _uploadAsset(endpoint, editor, file, onProgress, signal): any {
    let thumbnailFileId = null;
    let thumbnailAccessToken = null;

    if (!matchesFileTypes(file, AudioFileTypes)) {
      const thumbnailBlob = await editor.generateFileThumbnail(file);

      const response = await this.upload(thumbnailBlob, undefined, signal) as any;

      thumbnailFileId = response.file_id;
      thumbnailAccessToken = response.meta.access_token;
    }

    const {
      file_id: assetFileId,
      meta: { access_token: assetAccessToken }
    } = await this.upload(file, onProgress, signal) as any;

    const delta = Date.now() - this.lastUploadAssetRequest;

    if (delta < 1100) {
      await new Promise(resolve => setTimeout(resolve, 1100 - delta));
    }

    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const body = JSON.stringify({
      asset: {
        name: file.name,
        file_id: assetFileId,
        access_token: assetAccessToken,
        thumbnail_file_id: thumbnailFileId,
        thumbnail_access_token: thumbnailAccessToken
      }
    });

    const resp = await this.fetch(endpoint, { method: "POST", headers, body, signal });
    console.log("Response: " + Object.values(resp));

    const json = await resp.json();

    const asset = json.assets[0];

    this.lastUploadAssetRequest = Date.now();

    return {
      id: asset.asset_id,
      name: asset.name,
      url: asset.file_url,
      type: asset.type,
      attributions: {},
      images: {
        preview: { url: asset.thumbnail_url }
      }
    };
  }

  async deleteAsset(assetId): boolean {
    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const assetEndpoint = `${prefix}${API_SERVER_ADDRESS}${API_ASSETS_ROUTE}/${assetId}`;

    const resp = await this.fetch(assetEndpoint, { method: "DELETE", headers });
    console.log("Response: " + Object.values(resp));

    if (resp.status === 401) {
      throw new Error("Not authenticated");
    }

    if (resp.status !== 200) {
      throw new Error(`Asset deletion failed. ${await resp.text()}`);
    }

    return true;
  }

  async deleteProjectAsset(projectId, assetId): boolean {
    const token = this.getToken();

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${token}`
    };

    const projectAssetEndpoint = `${prefix}${API_SERVER_ADDRESS}${API_PROJECTS_ROUTE}/${projectId}${API_ASSETS_ACTION}/${assetId}`;

    const resp = await this.fetch(projectAssetEndpoint, { method: "DELETE", headers });
    console.log("Response: " + Object.values(resp));

    if (resp.status === 401) {
      throw new Error("Not authenticated");
    }

    if (resp.status !== 200) {
      throw new Error(`Project Asset deletion failed. ${await resp.text()}`);
    }

    return true;
  }

  setUserInfo(userInfo): void {
    localStorage.setItem("editor-user-info", JSON.stringify(userInfo));
  }

  getUserInfo(): JSON {
    return JSON.parse(localStorage.getItem("editor-user-info"));
  }

  saveCredentials(email, token): void {
    localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify({ credentials: { email, token } }));
  }

  async fetch(url, options: any = {}): Promise<any> {
    try {
      const token = this.getToken();
      if (options.headers == null) {
        options.headers = {};
      }
      options.headers.authorization = `Bearer ${token}`;
      const res = await fetch(url, options);
      console.log("Response: " + Object.values(res));

      if (res.ok) {
        return res;
      }

      const err = new Error(
        `Network Error: ${res.status || "Unknown Status."} ${res.statusText || "Unknown Error. Possibly a CORS error."}`
      );
      err.response = res;
      throw err;
    } catch (error) {
      if (error.message === "Failed to fetch") {
        error.message += " (Possibly a CORS error)";
      }
      throw new RethrownError(`Failed to fetch "${url}"`, error);
    }
  }

  handleAuthorization(): void {
    if (process.browser) {
      const accessToken = localStorage.getItem('XREngine-Auth-Store');
      const email = 'test@test.com';
      if((accessToken && email) || this.isAuthenticated()){
        this.saveCredentials(email, accessToken);
      }
      // TODO: Disabled unauthorized redirection temporarily
      // else {
      //   (window as any).location = `${(window as any).location.origin}?redirectTo=editor&login=true`;
      // }
    }
  }
}
