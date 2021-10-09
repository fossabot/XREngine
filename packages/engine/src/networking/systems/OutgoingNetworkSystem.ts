import { NetworkObjectComponent } from '../components/NetworkObjectComponent'
import { defineQuery, getComponent, hasComponent } from '../../ecs/functions/ComponentFunctions'
import { Network } from '../classes/Network'
import { World } from '../../ecs/classes/World'
import { TransformComponent } from '../../transform/components/TransformComponent'
import { XRInputSourceComponent } from '../../avatar/components/XRInputSourceComponent'
import { WorldStateInterface, WorldStateModel } from '../schema/networkSchema'
import { AvatarControllerComponent } from '../../avatar/components/AvatarControllerComponent'
import { isClient } from '../../common/functions/isClient'
import { Engine } from '../../ecs/classes/Engine'
import { System } from '../../ecs/classes/System'
import { VelocityComponent } from '../../physics/components/VelocityComponent'
import { isZero } from '@xrengine/common/src/utils/mathUtils'
import { arraysAreEqual } from '@xrengine/common/src/utils/miscUtils'
import { Action } from '../interfaces/Action'
import { pipe } from 'bitecs'
import { NetworkTransport } from '../interfaces/NetworkTransport'

/***********
 * QUERIES *
 **********/

const networkTransformsQuery =
  // isClient
  //   ? defineQuery([NetworkObjectOwnerComponent, NetworkObjectComponent, TransformComponent]) :
  defineQuery([NetworkObjectComponent, TransformComponent])

const ikTransformsQuery = isClient
  ? defineQuery([AvatarControllerComponent, XRInputSourceComponent])
  : defineQuery([XRInputSourceComponent])

/*************
 * UTILITIES *
 ************/

function velocityIsTheSame(previousNetworkState, netId, vel): boolean {
  for (let i = 0; i < previousNetworkState.pose.length; i++) {
    if (previousNetworkState.pose[i].networkId === netId) {
      if (arraysAreEqual(previousNetworkState.pose[i].angularVelocity, vel)) {
        return true
      } else {
        return false
      }
    }
  }

  return false
}
function transformIsTheSame(previousNetworkState, netId, pos, rot, vel): boolean {
  if (vel === undefined) vel = [0]
  for (let i = 0; i < previousNetworkState.pose.length; i++) {
    if (previousNetworkState.pose[i].networkId === netId) {
      if (
        arraysAreEqual(previousNetworkState.pose[i].position, pos) &&
        arraysAreEqual(previousNetworkState.pose[i].rotation, rot) &&
        arraysAreEqual(previousNetworkState.pose[i].linearVelocity, vel)
      ) {
        return true
      } else {
        return false
      }
    }
  }

  return false
}
function ikPoseIsTheSame(previousNetworkState, netId, hp, hr, lp, lr, rp, rr): boolean {
  for (let i = 0; i < previousNetworkState.ikPose.length; i++) {
    if (previousNetworkState.ikPose[i].networkId === netId) {
      if (
        arraysAreEqual(previousNetworkState.ikPose[i].headPosePosition, hp) &&
        arraysAreEqual(previousNetworkState.ikPose[i].headPoseRotation, hr) &&
        arraysAreEqual(previousNetworkState.ikPose[i].leftPosePosition, lp) &&
        arraysAreEqual(previousNetworkState.ikPose[i].leftPoseRotation, lr) &&
        arraysAreEqual(previousNetworkState.ikPose[i].rightPosePosition, rp) &&
        arraysAreEqual(previousNetworkState.ikPose[i].rightPoseRotation, rr)
      ) {
        return true
      } else {
        return false
      }
    }
  }

  return false
}

/************************
 * ACTION PREPROCESSING *
 ***********************/

export const forwardIncomingActionsFromOthersIfHost = (world: World) => {
  const { incomingActions, outgoingActions } = world

  if (world.isHosting) {
    for (const incoming of incomingActions) {
      // if incoming action is not from this client
      if (incoming.$from !== Engine.userId) {
        // forward it out
        outgoingActions.add(incoming)
      }
    }
  }

  incomingActions.clear()

  return world
}

export const rerouteOutgoingActionsBoundForSelf = (world: World) => {
  const { incomingActions, outgoingActions } = world

  for (const out of outgoingActions) {
    // if it's a forwarded action, use existing $from id
    // if not, use this client's userId
    out.$from = out.$from ?? Engine.userId
    // if action is from this client and going to this client
    if (out.$from === Engine.userId && out.$to === 'local') {
      // add action to incoming action and remove from outgoing actions
      // this prevents the action from leaving this client and applying itself to other connected clients' state
      incomingActions.add(out as Required<Action>)
      outgoingActions.delete(out)
    }
    // if client is hosting and action is from this client
    if (world.isHosting && out.$from === Engine.userId) {
      // add outgoing action to incoming action, but do not remove from outgoing actions
      // this applies the action to both this host and other connected clients' state
      incomingActions.add(out as Required<Action>)
    }
  }

  return world
}

// prettier-ignore
export const rerouteActions = pipe(
  forwardIncomingActionsFromOthersIfHost,
  rerouteOutgoingActionsBoundForSelf,
)

/***************
 * DATA QUEING *
 **************/

export const queueUnchangedPoses = (world: World) => {
  const { outgoingNetworkState, previousNetworkState } = world

  const ents = networkTransformsQuery(world)
  for (let i = 0; i < ents.length; i++) {
    const entity = ents[i]
    const networkObject = getComponent(entity, NetworkObjectComponent)

    const transformComponent = getComponent(entity, TransformComponent)

    let vel = undefined! as number[]
    let angVel = undefined
    if (hasComponent(entity, VelocityComponent)) {
      const velC = getComponent(entity, VelocityComponent)
      if (isZero(velC.velocity) || velocityIsTheSame(previousNetworkState, networkObject.networkId, velC.velocity))
        vel = [0]
      else vel = velC.velocity.toArray()
    }
    // const networkObjectOwnerComponent = getComponent(entity, NetworkObjectOwnerComponent)
    // networkObjectOwnerComponent && console.log('outgoing', getComponent(entity, NameComponent).name, transformComponent.position)
    // console.log('outgoing', getComponent(entity, NameComponent).name, transformComponent.position.toArray().concat(transformComponent.rotation.toArray()))
    if (
      // if there is no previous state (first frame)
      previousNetworkState === undefined ||
      // or if the transform is not the same as last frame
      !transformIsTheSame(
        previousNetworkState,
        networkObject.networkId,
        transformComponent.position.toArray(),
        transformComponent.rotation.toArray(),
        vel
      )
    )
      outgoingNetworkState.pose.push({
        networkId: networkObject.networkId,
        position: transformComponent.position.toArray(),
        rotation: transformComponent.rotation.toArray(),
        linearVelocity: vel !== undefined ? vel : [0],
        angularVelocity: angVel !== undefined ? angVel : [0]
      })
  }
  return world
}

// todo: move to client-specific system?
export const queueUnchangedPosesForClient = (world: World) => {
  const { outgoingNetworkState, previousNetworkState } = world

  const networkComponent = getComponent(world.localClientEntity, NetworkObjectComponent)
  if (isClient && networkComponent) {
    const transformComponent = getComponent(world.localClientEntity, TransformComponent)
    let vel = undefined! as number[]
    let angVel = undefined
    if (hasComponent(world.localClientEntity, VelocityComponent)) {
      const velC = getComponent(world.localClientEntity, VelocityComponent)
      if (isZero(velC.velocity) || velocityIsTheSame(previousNetworkState, world.localClientEntity, velC.velocity))
        vel = [0]
      else vel = velC.velocity.toArray()
    }

    if (
      // if there is no previous state (first frame)
      previousNetworkState === undefined ||
      // or if the transform is not the same as last frame
      !transformIsTheSame(
        previousNetworkState,
        networkComponent.networkId,
        transformComponent.position.toArray(),
        transformComponent.rotation.toArray(),
        vel
      )
    )
      outgoingNetworkState.pose.push({
        networkId: networkComponent.networkId,
        position: transformComponent.position.toArray(),
        rotation: transformComponent.rotation.toArray(),
        linearVelocity: vel !== undefined ? vel : [0],
        angularVelocity: angVel !== undefined ? angVel : [0]
      })
  }
  return world
}

export const queueUnchangedIkPoses = (world: World) => {
  const { outgoingNetworkState, previousNetworkState } = world

  const ents = ikTransformsQuery(world)
  for (let i = 0; i < ents.length; i++) {
    const entity = ents[i]

    const { networkId } = getComponent(entity, NetworkObjectComponent)

    const xrInputs = getComponent(entity, XRInputSourceComponent)

    const headPosePosition = xrInputs.head.position.toArray()
    const headPoseRotation = xrInputs.head.quaternion.toArray()
    const leftPosePosition = xrInputs.controllerLeft.position.toArray()
    const leftPoseRotation = xrInputs.controllerLeft.quaternion.toArray()
    const rightPosePosition = xrInputs.controllerRight.position.toArray()
    const rightPoseRotation = xrInputs.controllerRight.quaternion.toArray()

    if (
      // if there is no previous state (first frame)
      previousNetworkState === undefined ||
      // or if the transform is not the same as last frame
      !ikPoseIsTheSame(
        previousNetworkState,
        networkId,
        headPosePosition,
        headPoseRotation,
        leftPosePosition,
        leftPoseRotation,
        rightPosePosition,
        rightPoseRotation
      )
    )
      outgoingNetworkState.ikPose.push({
        networkId,
        headPosePosition,
        headPoseRotation,
        leftPosePosition,
        leftPoseRotation,
        rightPosePosition,
        rightPoseRotation
      })
  }
  return world
}

export const resetNetworkState = (world: World) => {
  world.previousNetworkState = world.outgoingNetworkState
  world.outgoingNetworkState = {
    tick: world.fixedTick,
    time: Date.now(),
    pose: [],
    ikPose: []
  }
  return world
}

// prettier-ignore
export const queueAllOutgoingPoses = pipe(
  resetNetworkState,
  queueUnchangedPoses, 
  queueUnchangedPosesForClient, 
  queueUnchangedIkPoses,
)

/****************
 * DATA SENDING *
 ***************/

const sendActionsOnTransport = (transport: NetworkTransport) => (world: World) => {
  const { outgoingActions } = world

  transport.sendActions(outgoingActions)

  outgoingActions.clear()

  return world
}

const sendDataOnTransport = (transport: NetworkTransport) => (data) => {
  transport.sendData(data)
}

export default async function OutgoingNetworkSystem(world: World): Promise<System> {
  /**
   * For the client, we only want to send out objects we have authority over,
   *   which are the local avatar and any owned objects
   * For the server, we want to send all objects
   */

  const sendActions = sendActionsOnTransport(Network.instance.transport)
  const sendData = sendDataOnTransport(Network.instance.transport)

  return () => {
    rerouteActions(world)

    // side effect - network IO
    try {
      sendActions(world)
    } catch (e) {
      console.error(e)
    }

    if (Engine.offlineMode) return

    queueAllOutgoingPoses(world)

    // side effect - network IO
    try {
      const data = WorldStateModel.toBuffer(world.outgoingNetworkState)
      sendData(data)
    } catch (e) {
      console.error(e)
    }
  }
}
