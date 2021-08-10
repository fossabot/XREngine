import { Entity } from '../../../../ecs/classes/Entity'
import { hasComponent } from '../../../../ecs/functions/EntityFunctions'
import { addStateComponent, removeStateComponent } from '../../../../game/functions/functionsState'
import { getGame } from '../../../functions/functions'
import { State } from '../../../types/GameComponents'

/**
 * @author HydraFire <github.com/HydraFire>
 */

export const addTurn = (entityPlayer: Entity): void => {
  const game = getGame(entityPlayer)
  const noOneTurn = Object.keys(game.gamePlayers).every((role) =>
    game.gamePlayers[role].every(
      (entity) => !(hasComponent(entity, State.YourTurn) || hasComponent(entity, State.Waiting))
    )
  )

  if (!hasComponent(entityPlayer, State.WaitTurn)) {
    console.warn('try to give turn to 1-Player, but he dont have WaitTurn State')
    return
  }
  if (noOneTurn) {
    removeStateComponent(entityPlayer, State.WaitTurn)
    addStateComponent(entityPlayer, State.YourTurn)
  }
}
