import { Feature } from 'geojson'
import { FeatureKey, ILayerName, MapDerivedFeatureGeometry } from '../types'
import { LongLat } from '../units'
import ArrayKeyedMap from './ArrayKeyedMap'
import AsyncPhase from './AsyncPhase'
import CreateGeometryTask from './CreateGeometryTask'
import FeatureCache from './FeatureCache'

export default class CreateGeometryPhase extends AsyncPhase<CreateGeometryTask, FeatureKey, MapDerivedFeatureGeometry> {
  taskMap: ArrayKeyedMap<FeatureKey, CreateGeometryTask>
  center: LongLat
  minimumSceneRadius: number
  featureCache: FeatureCache<Feature>
  cache: FeatureCache<MapDerivedFeatureGeometry>

  constructor(
    taskMap: ArrayKeyedMap<FeatureKey, CreateGeometryTask>,
    featureCache: FeatureCache<Feature>,
    geometryCache: FeatureCache<MapDerivedFeatureGeometry>,
    center: LongLat
  ) {
    super()
    this.taskMap = taskMap
    this.featureCache = featureCache
    this.cache = geometryCache
    this.center = center
  }

  *getTaskKeys() {
    let count = 0
    for (const key of this.featureCache.keys()) {
      const feature = this.featureCache.get(key)
      if (feature.geometry.type !== 'Point') {
        yield key
        // TODO why does this for loop not end on its own??
        if (count > 2000) break
        count++
      }
    }
  }

  createTask(layerName: ILayerName, x: number, y: number, tileIndex: string) {
    return new CreateGeometryTask(this.featureCache, this.cache, layerName, x, y, tileIndex, this.center)
  }

  cleanupCacheItem(value: MapDerivedFeatureGeometry) {
    value.geometry.dispose()
  }
}
