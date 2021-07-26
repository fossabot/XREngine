import { AssetLoader } from '../../../../assets/classes/AssetLoader'
import { Model } from '../../../../assets/superbuffer'
import { CharacterComponent } from '../../../../character/components/CharacterComponent'
import { XRInputSourceComponent } from '../../../../character/components/XRInputSourceComponent'
import { SkeletonUtils } from '../../../../character/SkeletonUtils'
import { Entity } from '../../../../ecs/classes/Entity'
import { addComponent, getComponent, hasComponent, removeComponent } from '../../../../ecs/functions/EntityFunctions'
import { Network } from '../../../../networking/classes/Network'
import { GolfAvatarComponent } from '../components/GolfAvatarComponent'

const avatarScale = 1.3

export const setupPlayerAvatar = async (entityPlayer: Entity) => {
  const headGLTF = await AssetLoader.loadAsync({ url: '/models/golf/avatars/avatar_head.glb' })
  const handGLTF = await AssetLoader.loadAsync({ url: '/models/golf/avatars/avatar_hands.glb' })
  const torsoGLTF = await AssetLoader.loadAsync({ url: '/models/golf/avatars/avatar_torso.glb' })

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
  golfAvatarComponent.torsoModel.position.set(0, 0, 0)

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

  const actor = getComponent(entityPlayer, CharacterComponent)
  actor.modelContainer.add(
    golfAvatarComponent.headModel,
    golfAvatarComponent.leftHandModel,
    golfAvatarComponent.rightHandModel,
    golfAvatarComponent.torsoModel
  )
}
