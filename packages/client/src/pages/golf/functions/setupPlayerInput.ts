import { Quaternion, Vector3 } from 'three'
import { LifecycleValue } from '@xrengine/engine/src/common/enums/LifecycleValue'
import { isDev } from '@xrengine/engine/src/common/functions/isDev'
import { Entity } from '@xrengine/engine/src/ecs/classes/Entity'
import { getComponent } from '@xrengine/engine/src/ecs/functions/ComponentFunctions'
import { InputComponent } from '@xrengine/engine/src/input/components/InputComponent'
import { GamepadButtons } from '@xrengine/engine/src/input/enums/InputEnums'
import { InputValue } from '@xrengine/engine/src/input/interfaces/InputValue'
import { InputAlias } from '@xrengine/engine/src/input/types/InputAlias'
import { ColliderComponent } from '@xrengine/engine/src/physics/components/ColliderComponent'
import { TransformComponent } from '@xrengine/engine/src/transform/components/TransformComponent'
import { GolfClubComponent } from '../components/GolfClubComponent'
import { hideClub } from '../prefab/GolfClubPrefab'
import { isClient } from '@xrengine/engine/src/common/functions/isClient'
import { VelocityComponent } from '@xrengine/engine/src/physics/components/VelocityComponent'
import { getBall, getClub, getHole, GolfState } from '../GolfSystem'
import { getGolfPlayerNumber, isCurrentGolfPlayer } from '../functions/golfFunctions'
import { swingClub } from '../functions/golfBotHookFunctions'
import { simulateXR, updateHead } from '@xrengine/engine/src/bot/functions/xrBotHookFunctions'
import { eulerToQuaternion } from '@xrengine/engine/src/common/functions/MathRandomFunctions'
import { AvatarComponent } from '@xrengine/engine/src/avatar/components/AvatarComponent'
import { AvatarControllerComponent } from '@xrengine/engine/src/avatar/components/AvatarControllerComponent'
import { BALL_STATES, setBallState } from '../prefab/GolfBallPrefab'
import { dispatchFromClient } from '@xrengine/engine/src/networking/functions/dispatch'
import { GolfAction } from '../GolfAction'
import { Network } from '@xrengine/engine/src/networking/classes/Network'
import { NetworkObjectComponent } from '@xrengine/engine/src/networking/components/NetworkObjectComponent'
import { World } from '@xrengine/engine/src/ecs/classes/World'
import { teleportRigidbody } from '@xrengine/engine/src/physics/functions/teleportRigidbody'

// we need to figure out a better way than polluting an 8 bit namespace :/

export enum GolfInput {
  TELEPORT = 120,
  TOGGLECLUB = 121
}

const rotate90onY = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2)

export const setupPlayerInput = (world: World, entityPlayer: Entity) => {
  const inputs = getComponent(entityPlayer, InputComponent)
  if (!inputs) return

  // override the default mapping and behavior of input schema and interact
  inputs.schema.inputMap.set('KeyK', GolfInput.TELEPORT)
  // inputs.schema.inputMap.set(GamepadButtons.A, GolfInput.TELEPORT) // todo: gamepad stuff broken

  inputs.schema.behaviorMap.set(
    GolfInput.TELEPORT,
    (entity: Entity, inputKey: InputAlias, inputValue: InputValue, delta: number) => {
      if (inputValue.lifecycleState !== LifecycleValue.ENDED) return
      const playerNumber = getGolfPlayerNumber(entity)
      const ballEntity = getBall(world, playerNumber)
      console.log('k', playerNumber, ballEntity)
      if (!ballEntity) return
      const ballTransform = getComponent(ballEntity, TransformComponent)
      const position = ballTransform.position
      console.log('teleporting to', position.x, position.y, position.z)

      const holeEntity = getHole(world, GolfState.currentHole.value)
      const holeTransform = getComponent(holeEntity, TransformComponent)
      // its do ball - hole
      let pos1 = new Vector3().copy(ballTransform.position).setY(0)
      let pos2 = new Vector3().copy(holeTransform.position).setY(0)
      // its do hole - ball
      if (position.z < holeTransform.position.z) {
        pos1 = new Vector3().copy(holeTransform.position).setY(0)
        pos2 = new Vector3().copy(ballTransform.position).setY(0)
      }
      // face character towards hole
      let angle = new Vector3(-1, 0, 0).angleTo(pos1.sub(pos2).normalize())
      // with out it direction right but club invert side
      if (position.z < holeTransform.position.z) {
        angle += Math.PI
      }

      const controller = getComponent(entity, AvatarControllerComponent)
      const actor = getComponent(entity, AvatarComponent)

      const pos = new Vector3(position.x, position.y + actor.avatarHalfHeight, position.z)
      controller.controller.setPosition(pos)

      const transform = getComponent(entity, TransformComponent)
      const quat = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), angle)
      transform.rotation.copy(quat)
    }
  )

  inputs.schema.inputMap.set('KeyY', GolfInput.TOGGLECLUB)
  // inputs.schema.inputMap.set(GamepadButtons.Y, GolfInput.TOGGLECLUB)

  inputs.schema.behaviorMap.set(
    GolfInput.TOGGLECLUB,
    (entity: Entity, inputKey: InputAlias, inputValue: InputValue, delta: number) => {
      if (inputValue.lifecycleState !== LifecycleValue.STARTED) return

      const playerNumber = getGolfPlayerNumber(entity)
      const clubEntity = getClub(world, playerNumber)
      const golfClubComponent = getComponent(clubEntity, GolfClubComponent)
      golfClubComponent.hidden = !golfClubComponent.hidden

      if (isClient) {
        hideClub(clubEntity, golfClubComponent.hidden, false)
      }
    }
  )

  // DEBUG STUFF
  if (isDev) {
    if (isClient) {
      const teleportballkey = 130

      inputs.schema.inputMap.set('KeyH', teleportballkey)
      inputs.schema.behaviorMap.set(
        teleportballkey,
        (entity: Entity, inputKey: InputAlias, inputValue: InputValue, delta: number) => {
          if (inputValue.lifecycleState !== LifecycleValue.STARTED) return
          if (!isCurrentGolfPlayer(entity)) return
          const playerNumber = getGolfPlayerNumber(entity)
          const currentHole = GolfState.currentHole.value
          const holeEntity = getHole(world, currentHole)
          const ballEntity = getBall(world, playerNumber)
          const position = new Vector3().copy(getComponent(holeEntity, TransformComponent).position)
          position.y += 0.1
          teleportRigidbody(getComponent(ballEntity, ColliderComponent).body, position)

          const { uniqueId } = getComponent(Network.instance.localClientEntity, NetworkObjectComponent)
          setBallState(ballEntity, BALL_STATES.MOVING)
          dispatchFromClient(GolfAction.playerStroke(uniqueId))
        }
      )

      const teleportballOut = 140
      inputs.schema.inputMap.set('KeyB', teleportballOut)
      inputs.schema.behaviorMap.set(
        teleportballOut,
        (entity: Entity, inputKey: InputAlias, inputValue: InputValue, delta: number) => {
          if (inputValue.lifecycleState !== LifecycleValue.STARTED) return
          if (!isCurrentGolfPlayer(entity)) return
          const playerNumber = getGolfPlayerNumber(entity)
          const ballEntity = getBall(world, playerNumber)
          const collider = getComponent(ballEntity, ColliderComponent)
          const velocity = getComponent(ballEntity, VelocityComponent)
          velocity.velocity.set(0, 0, 0)
          teleportRigidbody(collider.body, new Vector3(2, 1, -4))
          collider.body.setLinearVelocity(new Vector3(), true)

          const { uniqueId } = getComponent(Network.instance.localClientEntity, NetworkObjectComponent)
          setBallState(ballEntity, BALL_STATES.MOVING)
          dispatchFromClient(GolfAction.playerStroke(uniqueId))
        }
      )
      let xrSetup = false
      const setupBotKey = 141
      inputs.schema.inputMap.set('Semicolon', setupBotKey)
      inputs.schema.behaviorMap.set(setupBotKey, () => {
        if (xrSetup) return
        xrSetup = true
        simulateXR()
      })
    }

    const swingClubKey = 142
    inputs.schema.inputMap.set('KeyL', swingClubKey)
    inputs.schema.behaviorMap.set(
      swingClubKey,
      (entity: Entity, inputKey: InputAlias, inputValue: InputValue, delta: number) => {
        if (inputValue.lifecycleState !== LifecycleValue.STARTED) return
        updateHead({
          position: [0, 2, 1],
          rotation: eulerToQuaternion(-1.25, 0, 0).toArray()
        })
        // rotatePlayer()
        swingClub()
      }
    )
  }

  const showScorecardKey = 143
  inputs.schema.inputMap.set('KeyI', showScorecardKey)
  inputs.schema.inputMap.set(GamepadButtons.B, showScorecardKey)
  inputs.schema.behaviorMap.set(
    showScorecardKey,
    (entity: Entity, inputKey: InputAlias, inputValue: InputValue, delta: number) => {
      if (inputValue.lifecycleState !== LifecycleValue.ENDED) return
      console.log('SHOW SCORECARD')
      dispatchFromClient(GolfAction.showScorecard('toggle'))
    }
  )
}
