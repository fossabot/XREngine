// declare module 'bitecs' {
export type Type = 'i8' | 'ui8' | 'ui8c' | 'i16' | 'ui16' | 'i32' | 'ui32' | 'f32' | 'f64'

export type ListType = readonly [Type, number]

export const Types: {
  i8: 'i8'
  ui8: 'ui8'
  ui8c: 'ui8c'
  i16: 'i16'
  ui16: 'ui16'
  i32: 'i32'
  ui32: 'ui32'
  f32: 'f32'
  f64: 'f64'
}

export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

export type ArrayByType = {
  [Types.i8]: Int8Array
  [Types.ui8]: Uint8Array
  [Types.ui8c]: Uint8ClampedArray
  [Types.i16]: Int16Array
  [Types.ui16]: Uint16Array
  [Types.i32]: Int32Array
  [Types.ui32]: Uint32Array
  [Types.f32]: Float32Array
  [Types.f64]: Float64Array
}

export enum DESERIALIZE_MODE {
  REPLACE,
  APPEND,
  MAP
}

export type ComponentType<T extends ISchema> = {
  [key in keyof T]: T[key] extends Type
    ? ArrayByType[T[key]]
    : T[key] extends [infer RT, number]
    ? RT extends Type
      ? Array<ArrayByType[RT]>
      : unknown
    : T[key] extends ISchema
    ? ComponentType<T[key]>
    : unknown
}

export interface IWorld {
  [key: string]: any
}

export interface ISchema {
  [key: string]: Type | ListType | ISchema
}

export interface IComponentProp {
  [key: string]: TypedArray | Array<TypedArray>
}

export interface IComponent {
  [key: string]: TypedArray | IComponentProp
}

export type Component = IComponent | ComponentType<ISchema>

export type QueryModifier = (c: (IComponent | IComponentProp)[]) => (world: IWorld) => IComponent | QueryModifier

export type Query = (world: IWorld, clearDiff?: Boolean) => number[]

export type System = (world: IWorld, ...args: any[]) => IWorld

export type Serializer = (target: IWorld | number[]) => ArrayBuffer
export type Deserializer = (world: IWorld, packet: ArrayBuffer, mode?: DESERIALIZE_MODE) => void

export function setDefaultSize(size: number): void
export function createWorld(): IWorld
export function resetWorld(world: IWorld): IWorld
export function deleteWorld(world: IWorld): void
export function bit_addEntity(world: IWorld): number
export function bit_removeEntity(world: IWorld, eid: number): void

export function bit_registerComponent(world: IWorld, component: Component): void
export function bit_registerComponents(world: IWorld, components: Component[]): void
export function bit_defineComponent<T extends ISchema>(schema?: T): ComponentType<T>
export function bit_addComponent(world: IWorld, component: Component, eid: number): void
export function bit_removeComponent(world: IWorld, component: Component, eid: number): void
export function bit_hasComponent(world: IWorld, component: Component, eid: number): boolean
export function bit_getEntityComponents(world: IWorld, eid: number): Component[]

export function defineQuery(components: (Component | QueryModifier)[]): Query
export function Changed(c: Component): Component | QueryModifier
export function Not(c: Component): Component | QueryModifier
export function enterQuery(query: Query): Query
export function exitQuery(query: Query): Query
export function resetChangedQuery(world: IWorld, query: Query): Query
export function removeQuery(world: IWorld, query: Query): Query
export function commitRemovals(world: IWorld): void

export function defineSystem(update: (world: IWorld, ...args: any[]) => IWorld): System

export function defineSerializer(
  target: IWorld | Component[] | IComponentProp[] | QueryModifier,
  maxBytes?: number
): Serializer
export function defineDeserializer(target: IWorld | Component[] | IComponentProp[] | QueryModifier): Deserializer

export function pipe(...fns: ((...args: any[]) => any)[]): (...input: any[]) => any

export const parentArray: Symbol
// }
