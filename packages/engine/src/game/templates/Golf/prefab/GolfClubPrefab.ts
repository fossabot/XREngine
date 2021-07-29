import { Entity } from '../../../../ecs/classes/Entity'
import { NetworkPrefab } from '../../../../networking/interfaces/NetworkPrefab'
import { TransformComponent } from '../../../../transform/components/TransformComponent'
import { ColliderComponent } from '../../../../physics/components/ColliderComponent'
import { RigidBodyComponent } from '../../../../physics/components/RigidBody'
import { initializeNetworkObject } from '../../../../networking/functions/initializeNetworkObject'
import { GolfCollisionGroups, GolfColours, GolfPrefabTypes } from '../GolfGameConstants'
import {
  BoxBufferGeometry,
  DoubleSide,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  MathUtils,
  Euler
} from 'three'
import { Body, BodyType, ColliderHitEvent, ShapeType, RaycastQuery, SceneQueryType, SHAPES } from 'three-physx'
import { CollisionGroups } from '../../../../physics/enums/CollisionGroups'
import { PhysicsSystem } from '../../../../physics/systems/PhysicsSystem'
import { Object3DComponent } from '../../../../scene/components/Object3DComponent'
import { GameObject } from '../../../components/GameObject'
import { Behavior } from '../../../../common/interfaces/Behavior'
import {
  hasComponent,
  addComponent,
  getComponent,
  getMutableComponent,
  removeComponent
} from '../../../../ecs/functions/EntityFunctions'
import { Network } from '../../../../networking/classes/Network'
import { getGame } from '../../../functions/functions'
import { NetworkObject } from '../../../../networking/components/NetworkObject'
import { GolfClubComponent } from '../components/GolfClubComponent'
import { getHandTransform } from '../../../../xr/functions/WebXRFunctions'
import { DebugArrowComponent } from '../../../../debug/DebugArrowComponent'
import { GameObjectInteractionBehavior } from '../../../interfaces/GameObjectPrefab'
import { NetworkObjectOwner } from '../../../../networking/components/NetworkObjectOwner'
import { Action, State } from '../../../types/GameComponents'
import { addActionComponent } from '../../../functions/functionsActions'
import { GamePlayer } from '../../../components/GamePlayer'
import { XRUserSettings } from '../../../../xr/types/XRUserSettings'

import { ifVelocity } from '../functions/ifVelocity'
import { ifOwned } from '../../gameDefault/checkers/ifOwned'
import { isClient } from '../../../../common/functions/isClient'

const vector0 = new Vector3()
const vector1 = new Vector3()
const vector2 = new Vector3()
const eulerX90 = new Euler(Math.PI * 0.5, 0, 0)

/**
 * @author Josh Field <github.com/HexaField>
 */

export const spawnClub: Behavior = (
  entityPlayer: Entity,
  args?: any,
  delta?: number,
  entityTarget?: Entity,
  time?: number,
  checks?: any
): void => {
  const game = getGame(entityPlayer)
  const playerNetworkObject = getComponent(entityPlayer, NetworkObject)

  const networkId = Network.getNetworkId()
  const uuid = MathUtils.generateUUID()

  const parameters: GolfClubSpawnParameters = {
    gameName: game.name,
    role: 'GolfClub',
    uuid,
    ownerNetworkId: playerNetworkObject.networkId
  }

  // this spawns the club on the server
  createGolfClubPrefab({
    networkId,
    uniqueId: uuid,
    ownerId: playerNetworkObject.ownerId,
    parameters
  })

  // this sends the club to the clients
  Network.instance.worldState.createObjects.push({
    networkId,
    ownerId: playerNetworkObject.ownerId,
    uniqueId: uuid,
    prefabType: GolfPrefabTypes.Club,
    parameters
  })
}

export const setClubOpacity = (golfClubComponent: GolfClubComponent, opacity: number): void => {
  //@ts-ignore
  golfClubComponent?.meshGroup?.traverse((obj: Mesh) => {
    if (obj.material) {
      ;(obj.material as Material).opacity = opacity
    }
  })
}

export const enableClub = (entityClub: Entity, enable: boolean): void => {
  const golfClubComponent = getMutableComponent(entityClub, GolfClubComponent)
  if (golfClubComponent === undefined) return
  golfClubComponent.canHitBall = enable
  setClubOpacity(golfClubComponent, enable ? 1 : golfClubComponent.disabledOpacity)
}

export const hideClub = (entityClub: Entity, hide: boolean, yourTurn: boolean): void => {
  const golfClubComponent = getMutableComponent(entityClub, GolfClubComponent)
  const maxOpacity = yourTurn ? 1 : golfClubComponent.disabledOpacity
  setClubOpacity(golfClubComponent, hide ? 0 : maxOpacity)
}

/**
 * @author Josh Field <github.com/HexaField>
 */

export const updateClub: Behavior = (
  entityClub: Entity,
  args?: any,
  delta?: number,
  entityTarget?: Entity,
  time?: number,
  checks?: any
): void => {
  const ownerNetworkId = getComponent(entityClub, NetworkObjectOwner).networkId
  const ownerEntity = Network.instance.networkObjects[ownerNetworkId]?.component.entity

  if (!ownerEntity) return

  const golfClubComponent = getMutableComponent(entityClub, GolfClubComponent)
  if (!golfClubComponent.raycast) return

  const transformClub = getMutableComponent(entityClub, TransformComponent)
  const collider = getMutableComponent(entityClub, ColliderComponent)

  const handTransform = getHandTransform(ownerEntity)
  const { position, rotation } = handTransform

  transformClub.position.copy(position)
  transformClub.rotation.copy(rotation)

  golfClubComponent.raycast.origin.copy(position)
  golfClubComponent.raycast.direction.set(0, 0, -1).applyQuaternion(rotation)

  const hit = golfClubComponent.raycast.hits[0]

  const headDistance = !hit?.distance ? clubLength : Math.min(hit.distance, clubLength)

  // update position of club
  golfClubComponent.headGroup.position.setZ(-(headDistance - clubPutterLength * 0.5))
  golfClubComponent.neckObject.position.setZ(-headDistance * 0.5)
  golfClubComponent.neckObject.scale.setZ(headDistance * 0.5)

  golfClubComponent.headGroup.quaternion.setFromEuler(eulerX90)
  golfClubComponent.headGroup.getWorldDirection(vector2)
  golfClubComponent.raycast1.origin.copy(position.addScaledVector(vector2, -clubHalfWidth * 2))
  golfClubComponent.raycast1.direction.set(0, 0, -1).applyQuaternion(rotation)

  const hit1 = golfClubComponent.raycast1.hits[0]

  if (hit && hit1) {
    // Update the head's up direction using ground normal
    // We can use interpolated normals between two ray hits for more accurate result
    vector0.set(hit.normal.x, hit.normal.y, hit.normal.z)

    // Only apply the rotation on nearly horizontal surfaces
    if (vector0.dot(vector1.set(0, 1, 0)) >= 0.75) {
      golfClubComponent.headGroup.up.copy(vector0)

      vector2.set(hit1.position.x - hit.position.x, hit1.position.y - hit.position.y, hit1.position.z - hit.position.z)

      golfClubComponent.headGroup.getWorldPosition(vector1)
      vector1.addScaledVector(vector2, -1)
      golfClubComponent.headGroup.lookAt(vector1)
    }
  }

  // calculate velocity of the head of the golf club
  // average over multiple frames
  golfClubComponent.headGroup.getWorldPosition(vector1)
  vector0.subVectors(vector1, golfClubComponent.lastPositions[0])
  for (let i = 0; i < golfClubComponent.velocityPositionsToCalculate - 1; i++) {
    vector0.add(vector1.subVectors(golfClubComponent.lastPositions[i], golfClubComponent.lastPositions[i + 1]))
  }
  vector0.multiplyScalar(1 / (golfClubComponent.velocityPositionsToCalculate + 1))
  golfClubComponent.velocity.copy(vector0)
  collider.body.transform.linearVelocity.x = vector0.x
  collider.body.transform.linearVelocity.y = vector0.y
  collider.body.transform.linearVelocity.z = vector0.z
  // now shift all previous positions down the list
  for (let i = golfClubComponent.velocityPositionsToCalculate - 1; i > 0; i--) {
    golfClubComponent.lastPositions[i].copy(golfClubComponent.lastPositions[i - 1])
  }
  // add latest position to list
  golfClubComponent.headGroup.getWorldPosition(vector1)
  golfClubComponent.lastPositions[0].copy(vector1)

  // calculate relative rotation of club head
  vector0.copy(golfClubComponent.headGroup.position)
  vector1.copy(golfClubComponent.headGroup.children[0].position)
  vector1.applyQuaternion(golfClubComponent.headGroup.quaternion)
  vector0.add(vector1)

  collider.body.shapes[0].transform = {
    translation: {
      x: vector0.x,
      y: vector0.y,
      z: vector0.z
    },
    rotation: golfClubComponent.headGroup.quaternion
  }
}

// https://github.com/PersoSirEduard/OculusQuest-Godot-MiniGolfGame/blob/master/Scripts/GolfClub/GolfClub.gd#L18

export const onClubColliderWithBall: GameObjectInteractionBehavior = (
  entityClub: Entity,
  delta: number,
  args: { hitEvent: ColliderHitEvent },
  entityBall: Entity
) => {
  if (
    args.hitEvent.type === 'TRIGGER_START' &&
    hasComponent(entityBall, State.Active) &&
    hasComponent(entityClub, State.Active) &&
    ifOwned(entityClub, null, entityBall) &&
    ifVelocity(entityClub, { component: GolfClubComponent, more: 0.01, less: 1 })
  ) {
    addActionComponent(entityBall, Action.GameObjectCollisionTag)
    addActionComponent(entityClub, Action.GameObjectCollisionTag)
  } else if (args.hitEvent.type === 'TRIGGER_END') {
    removeComponent(entityBall, Action.GameObjectCollisionTag)
    removeComponent(entityClub, Action.GameObjectCollisionTag)
  }
}

/**
 * @author Josh Field <github.com/HexaField>
 */

const clubHalfWidth = 0.03
const clubPutterLength = 0.1
const clubColliderSize = new Vector3(clubHalfWidth * 0.5, clubHalfWidth * 0.5, clubPutterLength)
const clubLength = 1.5
const rayLength = clubLength * 1.1

export const initializeGolfClub = (entityClub: Entity) => {
  const transform = getComponent(entityClub, TransformComponent)
  const golfClubComponent = getMutableComponent(entityClub, GolfClubComponent)

  const ownerNetworkId = getComponent(entityClub, NetworkObjectOwner)?.networkId
  if (ownerNetworkId === undefined) return
  const ownerEntity = Network.instance.networkObjects[ownerNetworkId].component.entity
  const ownerPlayerNumber = Number(getComponent(ownerEntity, GamePlayer).role.substr(0, 1)) - 1

  const color = GolfColours[ownerPlayerNumber]

  golfClubComponent.raycast = PhysicsSystem.instance.addRaycastQuery(
    new RaycastQuery({
      type: SceneQueryType.Closest,
      origin: new Vector3(),
      direction: new Vector3(0, -1, 0),
      maxDistance: rayLength,
      collisionMask: CollisionGroups.Default | CollisionGroups.Ground | GolfCollisionGroups.Course
    })
  )
  golfClubComponent.raycast1 = PhysicsSystem.instance.addRaycastQuery(
    new RaycastQuery({
      type: SceneQueryType.Closest,
      origin: new Vector3(),
      direction: new Vector3(0, -1, 0),
      maxDistance: rayLength,
      collisionMask: CollisionGroups.Default | CollisionGroups.Ground | GolfCollisionGroups.Course
    })
  )

  const handleObject = new Mesh(
    new BoxBufferGeometry(clubHalfWidth, clubHalfWidth, 0.25),
    new MeshStandardMaterial({ color, transparent: true })
  )
  golfClubComponent.handleObject = handleObject

  const headGroup = new Group()
  const headObject = new Mesh(
    new BoxBufferGeometry(clubHalfWidth, clubHalfWidth, clubPutterLength * 2),
    new MeshStandardMaterial({ color: 0x736e63, transparent: true })
  )
  // raise the club by half it's height and move it out by half it's length so it's flush to ground and attached at end
  headObject.position.set(0, clubHalfWidth, -(clubPutterLength * 0.5))
  headGroup.add(headObject)
  golfClubComponent.headGroup = headGroup

  const neckObject = new Mesh(
    new BoxBufferGeometry(clubHalfWidth * 0.5, clubHalfWidth * 0.5, -1.75),
    new MeshStandardMaterial({ color: 0x736e63, transparent: true, side: DoubleSide })
  )
  golfClubComponent.neckObject = neckObject

  const meshGroup = new Group()
  meshGroup.add(handleObject, headGroup, neckObject)
  golfClubComponent.meshGroup = meshGroup

  meshGroup.traverse((obj) => {
    obj.castShadow = true
    obj.receiveShadow = true
  })
  addComponent(entityClub, Object3DComponent, { value: meshGroup })

  const shapeHead: ShapeType = {
    shape: SHAPES.Box,
    options: { boxExtents: clubColliderSize },
    config: {
      isTrigger: true,
      collisionLayer: GolfCollisionGroups.Club,
      collisionMask: GolfCollisionGroups.Ball
    }
  }

  const body = PhysicsSystem.instance.addBody(
    new Body({
      shapes: [shapeHead],
      type: BodyType.KINEMATIC,
      transform: {
        translation: { x: transform.position.x, y: transform.position.y, z: transform.position.z }
      }
    })
  )

  addComponent(entityClub, ColliderComponent, { body })

  for (let i = 0; i < golfClubComponent.velocityPositionsToCalculate; i++) {
    golfClubComponent.lastPositions[i] = new Vector3()
  }
  golfClubComponent.velocity = new Vector3()
  addComponent(entityClub, DebugArrowComponent)

  const gameObject = getComponent(entityClub, GameObject)
  gameObject.collisionBehaviors['GolfBall'] = onClubColliderWithBall

  if (isClient) {
    if (hasComponent(entityClub, State.Active)) {
      enableClub(entityClub, true)
    } else if (hasComponent(entityClub, State.Inactive)) {
      enableClub(entityClub, false)
    }
  }
}

type GolfClubSpawnParameters = {
  gameName: string
  role: string
  uuid: string
  ownerNetworkId: number
}

export const createGolfClubPrefab = (args: {
  parameters?: GolfClubSpawnParameters
  networkId?: number
  uniqueId: string
  ownerId?: string
}) => {
  console.log('createGolfClubPrefab', args)
  initializeNetworkObject({
    prefabType: GolfPrefabTypes.Club,
    uniqueId: args.uniqueId,
    ownerId: args.ownerId,
    networkId: args.networkId,
    parameters: args.parameters,
    override: {
      networkComponents: [
        {
          type: GameObject,
          data: {
            gameName: args.parameters.gameName,
            role: args.parameters.role,
            uuid: args.parameters.uuid
          }
        },
        {
          type: NetworkObjectOwner,
          data: {
            networkId: args.parameters.ownerNetworkId
          }
        }
      ]
    }
  })
}

// Prefab is a pattern for creating an entity and component collection as a prototype
export const GolfClubPrefab: NetworkPrefab = {
  //@ts-ignore
  initialize: createGolfClubPrefab,
  // These will be created for all players on the network
  networkComponents: [
    // Transform system applies values from transform component to three.js object (position, rotation, etc)
    { type: TransformComponent },
    { type: RigidBodyComponent },
    { type: GameObject },
    { type: GolfClubComponent },
    { type: NetworkObjectOwner }
    // Local player input mapped to behaviors in the input map
  ],
  // These are only created for the local player who owns this prefab
  localClientComponents: [],
  //clientComponents: [{ type: InterpolationComponent, data: { } }],
  clientComponents: [],
  serverComponents: [],
  onAfterCreate: [],
  onBeforeDestroy: []
}
