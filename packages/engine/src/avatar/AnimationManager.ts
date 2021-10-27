import { AnimationClip, Group, Material, Mesh, Skeleton, Bone, SkinnedMesh, Vector3 } from 'three'
import { getLoader } from '../assets/functions/LoadGLTF'
import { isClient } from '../common/functions/isClient'
import { Engine } from '../ecs/classes/Engine'
import { getDefaultSkeleton } from './functions/avatarFunctions'

export class AnimationManager {
  static instance: AnimationManager = new AnimationManager()

  _animations: AnimationClip[]
  _defaultModel: Group
  _defaultSkeleton: SkinnedMesh

  getAnimationDuration(name: string): number {
    const animation = this._animations.find((a) => a.name === name)
    return animation ? animation.duration : 0
  }

  getAnimations(): Promise<AnimationClip[]> {
    return new Promise((resolve) => {
      if (this._animations) {
        resolve(this._animations)
      }
      if (!isClient) {
        resolve([])
      }
      getLoader().load(
        Engine.publicPath + '/default_assets/Animations.glb',
        (gltf) => {
          gltf.scene.traverse((child) => {
            if (child.type === 'SkinnedMesh' && !this._defaultSkeleton) {
              this._defaultSkeleton = child
            }
          })

          if (!this._defaultSkeleton) {
            // reconstruct skeleton from stored data
            this._defaultSkeleton = getDefaultSkeleton()
          }

          this._animations = gltf.animations
          this._animations?.forEach((clip) => {
            // TODO: make list of morph targets names
            clip.tracks = clip.tracks.filter((track) => !track.name.match(/^CC_Base_/))
          })
          resolve(this._animations)
        },
        console.log,
        console.error
      )
    })
  }
  getDefaultModel(): Promise<Group> {
    return new Promise((resolve) => {
      if (this._defaultModel) {
        resolve(this._defaultModel)
      }
      if (!isClient) {
        resolve(new Group())
      }
      getLoader().load(
        Engine.publicPath + '/default_assets/Allison.glb',
        (gltf) => {
          this._defaultModel = gltf.scene
          this._defaultModel.traverse((obj: Mesh) => {
            if (obj.material) {
              ;(obj.material as Material).transparent = true
              ;(obj.material as Material).opacity = 0.5
            }
          })
          resolve(this._defaultModel)
        },
        console.log,
        console.error
      )
    })
  }
}
