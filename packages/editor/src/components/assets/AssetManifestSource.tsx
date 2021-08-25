import Fuse from 'fuse.js'
import { BaseSource } from './sources'
import { ItemTypes } from '../dnd'
import ImageNode from '@xrengine/editor/src/nodes/ImageNode'
import VideoNode from '@xrengine/editor/src/nodes/VideoNode'
import ModelNode from '@xrengine/editor/src/nodes/ModelNode'
import VolumetricNode from '@xrengine/editor/src/nodes/VolumetricNode'
import { fetchUrl } from '@xrengine/engine/src/scene/functions/fetchUrl'
function hasTags(result, tags) {
  for (const { value } of tags) {
    if (result.tags.indexOf(value) === -1) {
      return false
    }
  }
  return true
}

/**
 * Declairing assetTypeToNodeClass that contains types of node classes.
 *
 * @author Robert Long
 * @type {Object}
 */
const assetTypeToNodeClass = {
  [ItemTypes.Audio]: AudioNode,
  [ItemTypes.Image]: ImageNode,
  [ItemTypes.Video]: VideoNode,
  [ItemTypes.Volumetric]: VolumetricNode,
  [ItemTypes.Model]: ModelNode
}

/**
 * AssetManifestSource used to load sources using manifestUrl.
 *
 * @author Robert Long
 * @type {class component}
 */
export class AssetManifestSource extends BaseSource {
  editor: any
  manifestUrl: any
  assets: any[]
  tags: any[]
  loaded: boolean
  searchPlaceholder: any
  fuse: Fuse<any>

  constructor(editor, name, manifestUrl) {
    super()
    this.editor = editor
    this.id = manifestUrl
    this.name = name
    this.manifestUrl = new URL(manifestUrl, (window as any).location).href
    this.assets = []
    this.tags = []
    this.loaded = false
    this.searchDebounceTimeout = 0
  }

  /**
   * load used to calling api to load source.
   *
   * @author Robert Long
   * @return {Promise}
   */
  async load() {
    // calling api using manifestUrl
    const response = await fetchUrl(this.manifestUrl)

    //getting json using response
    const manifest = await response.json().catch((err) => {
      console.log(err)
    })

    //initializing placeholder if there exist manifest.searchPlaceholder
    if (manifest.searchPlaceholder) {
      this.searchPlaceholder = manifest.searchPlaceholder
    }
    // loop over manifest assets
    for (const asset of manifest.assets) {
      // get proxied asset url using manifestUrl
      const assetUrl = new URL(asset.url, this.manifestUrl).href
      const nodeClass = assetTypeToNodeClass[asset.type]
      const nodeEditor = this.editor.nodeEditors.get(nodeClass)
      //creationg array assets by pushing assets one by one
      this.assets.push({
        id: asset.id,
        label: asset.label,
        url: assetUrl,
        tags: asset.tags || [],
        type: asset.type,
        iconComponent: nodeEditor.iconComponent,
        nodeClass,
        initialProps: {
          name: asset.label,
          src: assetUrl
        }
      })
    }
    // initializing tags by assigning manifest tags
    this.tags = manifest.tags
    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['label', 'tags']
    }

    //Creating a new Fuse search instance using options for assets
    this.fuse = new Fuse(this.assets, options)
    this.loaded = true
  }

  /**
   * function used to search assets.
   *
   * @author Robert Long
   * @param  {any}  params
   * @param  {any}  _cursor
   * @param  {any}  _abortSignal
   * @return {Promise}
   */
  /* @ts-ignore */
  async search(params, _cursor, _abortSignal) {
    //check if component not get loaded then load
    if (!this.loaded) {
      await this.load()
    }

    //adding all assets to results
    let results = this.assets

    //check if params contains tag then filter assets having tag
    if (params.tags && params.tags.length > 0) {
      results = results.filter((result) => hasTags(result, params.tags))
    }

    //check if params contains query option then search using fuse
    if (params.query) {
      results = this.fuse.search(params.query)
    }

    //returning searched assets results
    return {
      results,
      hasMore: false
    }
  }
}

export default AssetManifestSource
