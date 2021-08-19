import { Feature } from 'geojson'

export interface TileFeaturesByLayer {
  building: Feature[]
  road: Feature[]
  water: Feature[]
  waterway: Feature[]
}
export type ILayerName = keyof TileFeaturesByLayer
