import { Behavior } from '../../../../common/interfaces/Behavior'
import { Entity } from '../../../../ecs/classes/Entity'
import { changeRole } from '../../../../game/functions/functionsState'
import { getGame } from '../../../functions/functions'
import { Game } from '../../../components/Game'
import { GameMode } from '../../../types/GameMode'
import { Engine } from '../../../../ecs/classes/Engine'
/**
 * @author HydraFire <github.com/HydraFire>
 */
function recurseSearchEmptyRole(game: Game, gameSchema: GameMode, newPlayerNumber: number, allowInOneRole: number = 1) {
  if (newPlayerNumber < 1) {
    return null
  } else if (
    game.gamePlayers[gameSchema.gamePlayerRoles[newPlayerNumber]] === undefined ||
    game.gamePlayers[gameSchema.gamePlayerRoles[newPlayerNumber]].length > allowInOneRole - 1
  ) {
    newPlayerNumber -= 1
    return recurseSearchEmptyRole(game, gameSchema, newPlayerNumber, 1)
  } else {
    return newPlayerNumber
  }
}

export const addRole: Behavior = (
  entity: Entity,
  args?: any,
  delta?: number,
  entityTarget?: Entity,
  time?: number,
  checks?: any
): void => {
  const game = getGame(entity)
  const gameSchema = Engine.gameModes[game.gameMode]
  const [availableRole] = Object.entries(game.gamePlayers).find(([key, entities]) => {
    return entities.length === 0
  })
  const newPlayerNumber = Number(availableRole.substr(0, 1)) - 1

  if (newPlayerNumber === null || newPlayerNumber > game.maxPlayers) {
    console.warn(
      'Player ' + newPlayerNumber + ' cant join game, because game set with maxPlayer count:' + game.maxPlayers
    )
    return
  }
  changeRole(entity, gameSchema.gamePlayerRoles[newPlayerNumber])
}
