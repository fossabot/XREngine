import { ControllerColliderComponent } from '../../character/components/ControllerColliderComponent'
import { Entity } from '../../ecs/classes/Entity'
import { getComponent } from '../../ecs/functions/EntityFunctions'
import { Network } from '../../networking/classes/Network'
import { NetworkObjectEditInterface } from '../../networking/interfaces/WorldState'
import { ColliderComponent } from '../components/ColliderComponent'

export const handleForceTransform = (editObject: NetworkObjectEditInterface): void => {
  const [x, y, z, qX, qY, qZ, qW] = editObject.values
  console.log('handleForceTransform', editObject.values)

  if (!Network.instance.networkObjects[editObject.networkId])
    return console.warn(`Entity with id ${editObject.networkId} does not exist! You should probably reconnect...`)

  const entity: Entity = Network.instance.networkObjects[editObject.networkId].component.entity

  const colliderComponent = getComponent(entity, ColliderComponent)
  if (colliderComponent) {
    colliderComponent.body?.updateTransform({
      translation: { x, y, z },
      rotation: { x: qX, y: qY, z: qZ, w: qW }
    })
    return
  }

  const controllerComponent = getComponent(entity, ControllerColliderComponent)
  if (controllerComponent) {
    controllerComponent.controller?.updateTransform({
      translation: { x, y, z },
      rotation: { x: qX, y: qY, z: qZ, w: qW }
    })
  }
}
