import { CharacterInputSchema } from './character/CharacterInputSchema';
import { DefaultGameMode } from './game/templates/DefaultGameMode';
import { DefaultNetworkSchema } from './networking/templates/DefaultNetworkSchema';
import { GamesSchema, GameType } from  './game/templates/GamesSchema';
import { InputSchema } from './input/interfaces/InputSchema';
import { NetworkSchema } from './networking/interfaces/NetworkSchema';
import { GameMode } from './game/types/GameMode';
import { PhysXConfig } from 'three-physx';

export type InitializeOptions = {
  input?: {
    schema: InputSchema,
  },
  networking?: {
    schema: NetworkSchema,
    app?: any;
  },
  supportedGameModes?: {
    [key: string]: GameMode
  },
  renderer?: {
    canvas?: HTMLCanvasElement
  },
  gameMode?: GameMode,
  publicPath?: string,
  useOfflineMode?: boolean,
  useCanvas?: boolean,
  postProcessing?: boolean,
  physicsWorldConfig?: PhysXConfig
};

/**
 * 
 * @author Shaw
 * If you just want to start up multiplayer worlds, use this.
 * Otherwise you should copy this into your own into your initializeEngine call.
 */

export const DefaultInitializationOptions: InitializeOptions = {
  input: {
    schema: CharacterInputSchema,
  },
  networking: {
    schema: DefaultNetworkSchema
  },
  supportedGameModes: GamesSchema,
  gameMode: DefaultGameMode,
  publicPath: '',
  useOfflineMode: false,
  useCanvas: true,
  postProcessing: true,
  physicsWorldConfig: undefined
};