import { Component } from "../../ecs/classes/Component";
import { ComponentConstructor } from '../../ecs/interfaces/ComponentInterfaces';
import { Behavior } from "../../common/interfaces/Behavior";
import { Checker } from "../../game/types/Checker";
import { Entity } from "../../ecs/classes/Entity";
/**
 * @author HydraFire <github.com/HydraFire>
 */

export interface StateObject {
  components: string[]
  role: string
  uuid: string
  storage: StorageInterface[]
}

export interface StorageInterface {
  component: string
  variables: string
}

export interface InitStorageInterface {
  component: ComponentConstructor<Component<any>>
  variables: string[]
}

export interface GameMode {
  name: string
  priority: number
  onGameLoading?: (gameEntity: Entity) => void
  onGameStart?: (gameEntity: Entity) => void
  registerActionTagComponents: ComponentConstructor<Component<any>>[]
  registerStateTagComponents: ComponentConstructor<Component<any>>[]
  initGameState: {
    [key: string]: {
      components?: ComponentConstructor<Component<any>>[]
      storage?: InitStorageInterface[]
      behaviors?: any
    };
  };
  gamePlayerRoles: GameRolesInterface
  gameObjectRoles: GameRolesInterface
}

export interface RoleBehaviorWithTarget {
  sortMethod?: any,
  targetsRole: {
    [key: string]: {
      watchers?: ComponentConstructor<Component<any>>[][],
      checkers?: Array<{
        function: Checker,
        args?: any
      }>
      args?: any
    }
  }
}

export type RoleBehaviorTarget = (entity: Entity) => Entity;

export interface RoleBehaviors {
  [key: string]: Array<{
    behavior: Behavior,
    args?: any | ((entity: Entity) => void),
    watchers?: ComponentConstructor<Component<any>>[][],
    checkers?: Array<{
      function: Checker,
      args?: any
    }>,
    takeEffectOn?: RoleBehaviorWithTarget | RoleBehaviorTarget;
  }>;
}

export interface GameRolesInterface {
    [key: string]: RoleBehaviors
}
