import { Group } from 'three'
import { createMappedComponent } from '@xrengine/engine/src/ecs/functions/EntityFunctions'

export type GolfAvatarComponentType = {
  headModel: Group
  leftHandModel: Group
  rightHandModel: Group
  torsoModel: Group
}

export const GolfAvatarComponent = createMappedComponent<GolfAvatarComponentType>()
