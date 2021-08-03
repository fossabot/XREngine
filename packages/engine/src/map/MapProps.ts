import { Vector3 } from 'three'

export interface MapProps {
  scale?: Vector3
  isGlobal?: boolean
  name?: string
  style?: any
  useTimeOfDay?: number
  useDirectionalShadows?: boolean
  useStartCoordinates?: boolean
  startLatitude?: string
  startLongitude?: string
}
