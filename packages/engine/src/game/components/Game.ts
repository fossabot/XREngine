import { Component } from '../../ecs/classes/Component'
import { Entity } from '../../ecs/classes/Entity'
import { Types } from '../../ecs/types/Types'
import { StateObject } from '../types/GameMode'
/**
 * @author HydraFire <github.com/HydraFire>
 */
export class Game extends Component<Game> {
  gameMode: string // GameMode|GameType, its string key to DefaultGamesSchema to get GameSchema of your game
  isGlobal: boolean // switch Server and Client work or Only in Your Client (All games have this two work modes by architect solution)
  priority: number // when player stand in two game areas in one time, he add to one of them, most prioritized
  minPlayers: number // if players will be less, game didnt start (in fact the game started allways, but it will be fails all checks, and pass all behaviors)
  maxPlayers: number // if players in location will be more, they will not added to the game
  gameArea: {
    min: { x: number, y: number, z: number}, // players adding to game what its position in game area (connected and spawn in game area)
    max: { x: number, y: number, z: number} // and remove from game when int position someone else or undefined (disconnected and game will remove player without any messages)
  }

  gamePlayers: {
    [key: string]: Entity[]
  }

  gameObjects: {
    [key: string]: Entity[]
  }

  /*
    gameObjectPrefabs: {
        [key: string]: GameObjectPrefab[]
    }
    */
  initState: string // copy from state befor first player added (needs for re initGame if its needed for players too restart game and score);
  state: StateObject[] // now will be send to player when he adding to game, in future will be correct players latesy bugs
}

Game._schema = {
  name: { type: Types.String, default: null },
  isGlobal: { type: Types.Boolean, default: false },
  gameArea: { type: Types.Ref, default: null },
  gamePlayers: { type: Types.JSON, default: {} },
  gameObjects: { type: Types.JSON, default: {} },
  minPlayers: { type: Types.Number, default: null },
  maxPlayers: { type: Types.Number, default: null },
  gameMode: { type: Types.String, default: null },
  initState: { type: Types.String, default: null },
  state: { type: Types.Array, default: [] }
}
