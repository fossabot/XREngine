import { AssetLoader } from '@xrengine/engine/src/assets/classes/AssetLoader'
import { AvatarComponent } from '@xrengine/engine/src/avatar/components/AvatarComponent'
import { XRInputSourceComponent } from '@xrengine/engine/src/avatar/components/XRInputSourceComponent'
import { SkeletonUtils } from '@xrengine/engine/src/avatar/SkeletonUtils'
import { Entity } from '@xrengine/engine/src/ecs/classes/Entity'
import { addComponent, getComponent, hasComponent } from '@xrengine/engine/src/ecs/functions/ComponentFunctions'
import { Object3DComponent } from '@xrengine/engine/src/scene/components/Object3DComponent'
import { GolfAvatarComponent } from '../components/GolfAvatarComponent'
import { Quaternion, Vector3 } from 'three'
import { isEntityLocalClient } from '@xrengine/engine/src/networking/functions/isEntityLocalClient'

const avatarScale = 1.3
const rotateHalfY = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI)

export const setupPlayerAvatar = async (entityPlayer: Entity) => {
  const avatarComponent = getComponent(entityPlayer, AvatarComponent)
  const { value } = getComponent(entityPlayer, Object3DComponent)
  value.remove(avatarComponent.modelContainer)
  avatarComponent.modelContainer.children.forEach((child) => child.removeFromParent())

  const { scene: headGLTF } = AssetLoader.getFromCache('/models/golf/avatars/avatar_head.glb')
  const { scene: handGLTF } = AssetLoader.getFromCache('/models/golf/avatars/avatar_hands.glb')
  const { scene: torsoGLTF } = AssetLoader.getFromCache('/models/golf/avatars/avatar_torso.glb')

  const headModel = SkeletonUtils.clone(headGLTF)
  headModel.scale.multiplyScalar(avatarScale)

  const leftHandModel = SkeletonUtils.clone(handGLTF)
  const rightHandModel = SkeletonUtils.clone(handGLTF)
  leftHandModel.scale.setX(-1)
  leftHandModel.scale.multiplyScalar(avatarScale)
  rightHandModel.scale.multiplyScalar(avatarScale)

  const torsoModel = SkeletonUtils.clone(torsoGLTF)
  torsoModel.scale.multiplyScalar(avatarScale)

  addComponent(entityPlayer, GolfAvatarComponent, { headModel, leftHandModel, rightHandModel, torsoModel })

  setupPlayerAvatarNotInVR(entityPlayer)
}

export const setupPlayerAvatarVR = async (entityPlayer: Entity) => {
  const golfAvatarComponent = getComponent(entityPlayer, GolfAvatarComponent)
  ;[
    golfAvatarComponent.headModel,
    golfAvatarComponent.leftHandModel,
    golfAvatarComponent.rightHandModel,
    golfAvatarComponent.torsoModel
  ].forEach((model) => model.removeFromParent())

  const xrInputSourceComponent = getComponent(entityPlayer, XRInputSourceComponent)

  golfAvatarComponent.headModel.position.set(0, 0, 0)
  golfAvatarComponent.leftHandModel.position.set(0, 0, 0)
  golfAvatarComponent.rightHandModel.position.set(0, 0, 0)
  golfAvatarComponent.torsoModel.position.set(0, -0.3, 0)
  golfAvatarComponent.leftHandModel.scale.setZ(-1)
  golfAvatarComponent.rightHandModel.scale.setZ(-1)

  golfAvatarComponent.headModel.applyQuaternion(rotateHalfY)

  if (!isEntityLocalClient(entityPlayer)) {
    xrInputSourceComponent.head.add(golfAvatarComponent.headModel)
    golfAvatarComponent.headModel.add(golfAvatarComponent.torsoModel)
  }
  xrInputSourceComponent.controllerLeft.add(golfAvatarComponent.leftHandModel)
  xrInputSourceComponent.controllerRight.add(golfAvatarComponent.rightHandModel)
}

export const setupPlayerAvatarNotInVR = (entityPlayer: Entity) => {
  if (!entityPlayer || !hasComponent(entityPlayer, GolfAvatarComponent)) return
  const golfAvatarComponent = getComponent(entityPlayer, GolfAvatarComponent)
  ;[
    golfAvatarComponent.headModel,
    golfAvatarComponent.leftHandModel,
    golfAvatarComponent.rightHandModel,
    golfAvatarComponent.torsoModel
  ].forEach((model) => model.removeFromParent())

  // TODO: replace pos offset with animation hand position once new animation rig is in
  golfAvatarComponent.headModel.position.set(0, 1.6, 0)
  golfAvatarComponent.leftHandModel.position.set(0.35, 1, 0)
  golfAvatarComponent.rightHandModel.position.set(-0.35, 1, 0)
  golfAvatarComponent.torsoModel.position.set(0, 1.25, 0)
  golfAvatarComponent.leftHandModel.scale.setZ(1)
  golfAvatarComponent.rightHandModel.scale.setZ(1)

  const { value } = getComponent(entityPlayer, Object3DComponent)

  value.add(
    golfAvatarComponent.headModel,
    golfAvatarComponent.leftHandModel,
    golfAvatarComponent.rightHandModel,
    golfAvatarComponent.torsoModel
  )
}
