import {
  bit_addComponent,
  bit_removeComponent,
  bit_hasComponent,
  bit_removeEntity,
  bit_defineComponent,
  ComponentType as _ComponentType,
  ISchema,
  Type,
  bit_addEntity,
  bit_getEntityComponents,
  defineQuery
} from '../../ecs/bitecs'

import { Entity } from '../classes/Entity'
import { World } from '../classes/World'

// TODO: benchmark map vs array for componentMap
export const createMappedComponent = <T extends {}, S extends ISchema = {}>(schema?: S, defaultValues = {}) => {
  const component = bit_defineComponent(schema)
  const componentMap = new Map<number, T & SoAProxy<S>>()
  // const componentMap = []

  // if (defaultValues) {
  //   Object.defineProperty(component, '_default', {
  //     value: defaultValues
  //   })
  // }

  if (schema) {
    Object.defineProperty(component, '_schema', {
      value: schema
    })
  }

  Object.defineProperty(component, '_map', {
    value: componentMap
  })

  Object.defineProperty(component, 'get', {
    value: function (eid: number) {
      // return componentMap[eid]
      return componentMap.get(eid)
    }
  })

  Object.defineProperty(component, 'set', {
    value: function (eid: number, value: any) {
      if (schema) {
        Object.defineProperties(
          value,
          Object.keys(schema).reduce((a, k) => {
            a[k] = {
              get() {
                return component[k][eid]
              },
              set(val) {
                component[k][eid] = val
              }
            }
            return a
          }, {})
        )
      }
      // componentMap[eid] = value
      return componentMap.set(eid, value)
    }
  })

  Object.defineProperty(component, 'delete', {
    value: function (eid: number) {
      // componentMap[eid] = undefined
      return componentMap.delete(eid)
    }
  })

  return component as typeof component & {
    get: typeof componentMap.get
    set: typeof componentMap.set
    delete: typeof componentMap.delete
  }
}

export type SoAProxy<S extends ISchema> = {
  [key in keyof S]: S[key] extends Type
    ? number
    : S[key] extends [infer RT, number]
    ? RT extends Type
      ? Array<number>
      : unknown
    : S[key] extends ISchema
    ? SoAProxy<S[key]>
    : unknown
}

export type MappedComponent<T, S extends ISchema> = _ComponentType<S> & {
  get: (entity: number) => T & SoAProxy<S>
  set: (entity: number, value: T) => void
  delete: (entity: number) => void
}

export const createEntity = (world = World.defaultWorld.ecsWorld): Entity => {
  const entity = bit_addEntity(world)
  world.world.entities.push(entity)
  return entity
}

export const removeEntity = (entity: Entity, world = World.defaultWorld.ecsWorld) => {
  world.world.entities.splice(world.world.entities.indexOf(entity), 1)
  bit_removeEntity(world, entity)
  // TODO: remove mapped component data
}

export type ComponentConstructor<T, S extends ISchema> = MappedComponent<T, S>
export type ComponentType<C extends MappedComponent<any, any>> = ReturnType<C['get']>

export const getComponent = <T extends any, S extends ISchema>(
  entity: Entity,
  component: MappedComponent<T, S>,
  getRemoved = false,
  world = World.defaultWorld.ecsWorld
): T & SoAProxy<S> => {
  if (typeof entity === 'undefined') {
    console.warn('[getComponent]: entity is undefined')
    return
  }
  if (getRemoved) return world._removedComponents.get(entity) ?? component.get(entity)
  return component.get(entity)
}

export const addComponent = <T extends any, S extends ISchema>(
  entity: Entity,
  component: MappedComponent<T, S>,
  args: T,
  world = World.defaultWorld.ecsWorld
) => {
  if (typeof entity === 'undefined') {
    console.warn('[addComponent]: entity is undefined')
    return
  }
  // console.log('addComponent', component.name, entity)
  bit_addComponent(world, component, entity)
  // console.log('hasComponent', component.name, entity, bit_hasComponent(world, component, entity))
  if (component._schema) {
    for (const [key] of Object.entries(component._schema)) {
      component[key][entity] = args[key]
    }
  }
  component.set(entity, args) //, Object.assign({}, args, component._default))
  return component.get(entity)
}

export const hasComponent = <T extends any, S extends ISchema>(
  entity: Entity,
  component: MappedComponent<T, S>,
  world = World.defaultWorld.ecsWorld
) => {
  if (typeof entity === 'undefined') {
    console.warn('[hasComponent]: entity is undefined')
    return
  }
  return typeof component.get(entity) !== 'undefined'
  // return bit_hasComponent(world, component, entity)
}

export const removeComponent = <T extends any, S extends ISchema>(
  entity: Entity,
  component: MappedComponent<T, S>,
  world = World.defaultWorld.ecsWorld
) => {
  if (typeof entity === 'undefined') {
    console.warn('[removeComponent]: entity is undefined')
    return
  }
  // console.log('removeComponent', entity, component.name)
  const componentRef = component.get(entity)
  world._removedComponents.set(entity, componentRef)
  component.delete(entity)
  bit_removeComponent(world, component, entity)
  return componentRef
}

export const getAllComponentsOfType = <T extends any, S extends ISchema>(
  component: MappedComponent<T, S>,
  world = World.defaultWorld.ecsWorld
): T[] => {
  const query = defineQuery([component])
  const entities = query(world)
  return entities.map((e) => {
    return getComponent(e, component)
  })
}

export const getAllEntitiesWithComponent = <T extends any, S extends ISchema>(
  component: MappedComponent<T, S>,
  world = World.defaultWorld.ecsWorld
): Entity[] => {
  const query = defineQuery([component])
  return query(world)
}

export const removeAllComponents = (entity: Entity, world = World.defaultWorld.ecsWorld) => {
  for (const component of bit_getEntityComponents(world, entity)) {
    bit_removeComponent(world, component, entity)
    // TODO: remove mapped component data
  }
}

export const removeAllEntities = (world = World.defaultWorld.ecsWorld) => {
  // TODO
  // getEntityComponents
}
