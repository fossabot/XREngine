import { GolfPrefabTypes } from '../GolfGameConstants'
import { createMappedComponent } from '@xrengine/engine/src/ecs/functions/ComponentFunctions'

export const GolfBallTagComponent = createMappedComponent<{}>()
export const GolfClubTagComponent = createMappedComponent<{}>()

export const GolfPrefabs = {
  [GolfPrefabTypes.Ball]: GolfBallTagComponent,
  [GolfPrefabTypes.Club]: GolfClubTagComponent
}
