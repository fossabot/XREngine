import { Entity } from '@xrengine/engine/src/ecs/classes/Entity'
import { getComponent } from '@xrengine/engine/src/ecs/functions/ComponentFunctions'
import { Network } from '@xrengine/engine/src/networking/classes/Network'
import { NetworkObjectComponent } from '@xrengine/engine/src/networking/components/NetworkObjectComponent'
import { NetworkObjectType } from '@xrengine/engine/src/networking/interfaces/NetworkObjectList'
import { GolfState } from '../GolfSystem'

export const getGolfPlayerNumber = (entity: Entity = Network.instance.localClientEntity) => {
  const uniqueId = getComponent(entity, NetworkObjectComponent, true)?.uniqueId
  if (!uniqueId) return undefined
  const number = GolfState.players.findIndex((player) => player.id.value === uniqueId)
  if (number < 0) return undefined
  return number
}

export function getGolfPlayerState(
  playerNumber = GolfState.currentPlayer.value
): typeof GolfState.players[0]['value'] | undefined {
  return GolfState.players[playerNumber].value
}

export const isCurrentGolfPlayer = (entity: Entity) => {
  const currentPlayerNumber = GolfState.currentPlayer.value
  const currentPlayerId = GolfState.players[currentPlayerNumber].id.value
  return currentPlayerId === getComponent(entity, NetworkObjectComponent).uniqueId
}

export const getCurrentGolfPlayerEntity = () => {
  const currentPlayerNumber = GolfState.currentPlayer.value
  const currentPlayerId = GolfState.players[currentPlayerNumber].id.value
  return Object.values(Network.instance.networkObjects).find((obj) => obj.uniqueId === currentPlayerId)?.entity
}

export const getPlayerEntityFromNumber = (number: number) => {
  const player = GolfState.players[number]
  if (!player) return undefined
  const entity = Object.values(Network.instance.networkObjects).find(
    (obj: NetworkObjectType) => obj.uniqueId === player.value.id
  )?.entity
  if (entity < 0) return undefined
  return entity
}
