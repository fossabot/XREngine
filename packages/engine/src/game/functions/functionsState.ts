import { isClient } from '../../common/functions/isClient'
import { Component } from '../../ecs/classes/Component'
import { Engine } from '../../ecs/classes/Engine'
import { Entity } from '../../ecs/classes/Entity'
import {
  addComponent,
  getComponent,
  getMutableComponent,
  hasComponent,
  removeComponent
} from '../../ecs/functions/EntityFunctions'
import { ComponentConstructor } from '../../ecs/interfaces/ComponentInterfaces'
import { Network } from '../../networking/classes/Network'

import { Game } from '../components/Game'
import { GameObject } from '../components/GameObject'
import { GamePlayer } from '../components/GamePlayer'
import { ClientActionToServer } from '../templates/DefaultGameStateAction'
import { SpawnedObject } from '../templates/gameDefault/components/SpawnedObjectTagComponent'

import { State } from '../types/GameComponents'
import { ClientGameActionMessage, GameStateUpdateMessage } from '../types/GameMessage'
import { GameMode, StateObject } from '../types/GameMode'
import { getGame, getGameEntityFromName, getRole, setRole, getUuid } from './functions'
/**
 * @author HydraFire <github.com/HydraFire>
 */

export const initState = (game: Game, gameSchema: GameMode): void => {
  gameSchema.gameObjectRoles.forEach((role) => (game.gameObjects[role] = []))
  gameSchema.gamePlayerRoles.forEach((role) => (game.gamePlayers[role] = []))
}

export const saveInitStateCopy = (entity: Entity): void => {
  const game = getMutableComponent(entity, Game)
  game.initState = JSON.stringify(game.state)
}

export const reInitState = (game: Game): void => {
  game.state = JSON.parse(game.initState)
  applyState(game)
  //console.warn('reInitState', applyStateToClient);
}

export const sendState = (game: Game, playerComp: GamePlayer): void => {
  if (!isClient && game.isGlobal) {
    const message: GameStateUpdateMessage = { game: game.name, ownerId: playerComp.uuid, state: game.state }
    //  console.warn('sendState', message);
    Network.instance.worldState.gameState.push(message)
  }
}

export const sendSpawnGameObjects = (game: Game, uuid): void => {
  if (!isClient && game.isGlobal) {
    Object.keys(Network.instance.networkObjects).forEach((networkId) => {
      // in this if we filter and send only spawnded objects
      if (
        hasComponent(Network.instance.networkObjects[networkId].component.entity, SpawnedObject) &&
        getComponent(Network.instance.networkObjects[networkId].component.entity, GameObject).uuid === uuid
      ) {
        Network.instance.worldState.createObjects.push({
          prefabType: Network.instance.networkObjects[networkId].prefabType,
          networkId: Number(networkId),
          ownerId: Network.instance.networkObjects[networkId].ownerId,
          uniqueId: Network.instance.networkObjects[networkId].uniqueId,
          parameters: Network.instance.networkObjects[networkId].parameters // prefabParameters if from project scene, this is ''
        })
      }
    })
  }
}

export const requireState = (game: Game, playerComp: GamePlayer): void => {
  if (isClient && game.isGlobal && playerComp.uuid === Network.instance.userId) {
    const message: ClientGameActionMessage = {
      type: ClientActionToServer[0],
      game: game.name,
      ownerId: playerComp.uuid,
      uuid: ''
    }
    Network.instance.clientGameAction.push(message)
  }
}

export const requireSpawnObjects = (game: Game, uuid): void => {
  if (isClient && game.isGlobal) {
    const message: ClientGameActionMessage = { type: ClientActionToServer[1], game: game.name, ownerId: '', uuid: uuid }
    Network.instance.clientGameAction.push(message)
  }
}

export const applyStateToClient = (stateMessage: GameStateUpdateMessage): void => {
  const entity = getGameEntityFromName(stateMessage.game)
  const game = getMutableComponent(entity, Game)
  game.state = stateMessage.state
  console.warn('applyStateToClient', game.state)
  console.warn('Game Objects Entity', game.gameObjects)
  applyState(game)
}

export const applyState = (game: Game): void => {
  const gameSchema = Engine.gameModes[game.gameMode]

  // clean all states
  Object.keys(game.gamePlayers)
    .concat(Object.keys(game.gameObjects))
    .forEach((role: string) => {
      ;(game.gameObjects[role] || game.gamePlayers[role]).forEach((entity: Entity) => {
        const uuid = getUuid(entity)
        /*
      gameSchema.registerActionTagComponents.forEach(component => {
        hasComponent(entity, component ) ? removeComponent(entity, component):'';
      });
*/
        gameSchema.registerStateTagComponents.forEach((component) => {
          hasComponent(entity, component) ? removeComponent(entity, component) : ''
        })
        // add all states
        //  console.warn('// add all states');
        //  console.warn(uuid);
      })
    })

  // Search if server state have spawned objects but client just joined and don't;
  game.state.forEach((v: StateObject) => {
    const localUuids = Object.keys(game.gamePlayers)
      .concat(Object.keys(game.gameObjects))
      .reduce((acc, role: string) => {
        return acc.concat((game.gameObjects[role] || game.gamePlayers[role]).map((entity: Entity) => getUuid(entity)))
      }, [])

    if (localUuids.every((uuid) => uuid != v.uuid)) {
      // spawn
      if (v.components.some((s) => s === 'SpawnedObject')) {
        console.log('require to spawn object', v)
        requireSpawnObjects(game, v.uuid)
      } else {
        console.warn('////////////////////////////////////////////////////////////////')
        console.warn('  WE HAVE A PROBLEM')
        console.warn('////////////////////////////////////////////////////////////////')
      }
    }
  })

  // Adding StateComponent from state to entity
  Object.keys(game.gamePlayers)
    .concat(Object.keys(game.gameObjects))
    .forEach((role: string) => {
      ;(game.gameObjects[role] || game.gamePlayers[role]).forEach((entity: Entity) => {
        const uuid = getUuid(entity)

        const stateObject = game.state.find((v: StateObject) => v.uuid === uuid)

        if (stateObject != undefined) {
          stateObject.components.forEach((componentName: string) => {
            if (State[componentName]) addComponent(entity, State[componentName])
            else console.warn("Couldn't find component", componentName)
          })
        } else {
          // console.log('Local object dont have state, v.uuid != uuid')
          // console.log(role, uuid)
        }
      })
    })
  // console.warn('applyState', game.state)
}

export const correctState = (): void => {
  //TODO:
}

export const removeEntityFromState = (objectOrPlayerComponent, game): void => {
  const index = game.state.findIndex((v) => v.uuid === objectOrPlayerComponent.uuid)
  if (index != -1) {
    game.state.splice(index, 1)
  } else {
    console.warn('cant remove from state, dont have it already', objectOrPlayerComponent.uuid)
  }
}

export const clearRemovedEntitysFromGame = (game): void => {
  Object.keys(game.gamePlayers).forEach((role) => {
    game.gamePlayers[role] = game.gamePlayers[role].filter((entity) => entity.queries.length != 0)
  })
  Object.keys(game.gameObjects).forEach((role) => {
    game.gameObjects[role] = game.gameObjects[role].filter((entity) => entity.queries.length != 0)
  })
}

export const addStateComponent = (entity: Entity, component: ComponentConstructor<Component<any>>): void => {
  if (hasComponent(entity, component)) return
  
  const uuid = getUuid(entity)
  const role = getRole(entity)
  const game = getGame(entity)
  /*
  if (role != 'GolfBall') {
    console.warn(role,' add ', component.name)
  } else {
    console.log(role,' add ', component.name)
  }
  */


  if (uuid === undefined || role === undefined || game === undefined) {
    console.warn('addStateComponent cant add State, looks like Object or Player leave game')
    return
  }

  addComponent(entity, component)

  let objectState = game.state.find((v) => v.uuid === uuid)

  if (objectState === undefined) {
    objectState = { uuid: uuid, role: role, components: [], storage: [] }
    game.state.push(objectState)
  }

  const index = objectState.components.findIndex((name) => name === component.name)
  if (index === -1) {
    objectState.components.push(component.name)
  } else {
    console.warn('we have this gameState already, why?', component.name)
  }
}

export const removeStateComponent = (entity: Entity, component: ComponentConstructor<Component<any>>): void => {
  if (!hasComponent(entity, component)) return
  const uuid = getUuid(entity)
  const game = getGame(entity)
  /*
  const role = getRole(entity)
  if (role != 'GolfBall') {
   console.warn(role,' remove ', component.name)
  } else {
    console.log(role,' remove ', component.name)
  }
  */
  removeComponent(entity, component)

  const objectState = game.state.find((v) => v.uuid === uuid)
  const index = objectState.components.findIndex((name) => name === component.name)
  if (index === -1) {
    console.warn('dont exist in gameState already, why?', component.name)
  } else {
    objectState.components.splice(index, 1)
  }
}

export const changeRole = (entity: Entity, newGameRole: string): void => {
  const uuid = getUuid(entity)
  const game = getGame(entity)

  let objectState = game.state.find((v) => v.uuid === uuid)

  if (objectState === undefined) {
    objectState = { uuid: uuid, role: '', components: [], storage: [] }
    game.state.push(objectState)
  }

  console.log('change role', newGameRole)

  objectState.role = newGameRole
  objectState.components = []
  objectState.storage = []

  setRole(entity, newGameRole)

  Object.keys(game.gamePlayers).forEach((role) => {
    const index = game.gamePlayers[role].findIndex((entityF) => uuid === getUuid(entityF))
    if (index != -1) {
      game.gamePlayers[role].splice(index, 1)
    }
  })

  game.gamePlayers[newGameRole].push(entity)
}
