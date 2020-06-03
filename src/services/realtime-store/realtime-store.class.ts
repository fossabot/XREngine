import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { UserInputError } from 'apollo-server'

interface Data {}

interface ServiceOptions {}

export class RealtimeStore implements ServiceMethods<Data> {
  app: Application
  options: ServiceOptions
  store: any

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data> | UserInputError> {
    const substore = this.store.get((params as any).type)

    if (substore == null) { return new UserInputError('Invalid type ') }
    return Object.keys(substore).map((name) => { return substore.get(name) })
  }

  async get (id: Id, params?: Params): Promise<Data> {
    const substore = this.store.get((params as any).type)

    if (substore == null) { return new UserInputError('Invalid type ') }
    return substore.get(id)
  }

  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current, params)))
    }

    const substore = this.store.get((data as any).type)
    const object = (data as any).object
    substore.set(object.id, object)

    return object
  }

  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    const substore = this.store.get((data as any).type)

    if (substore == null) { return new UserInputError('Invalid type ') }
    if (id == null || substore.get(id) == null) { return new UserInputError('Invalid User ID ') }
    substore.set(id, Object.assign({}, substore.get(id), (data as any).object))
    return substore.get(id)
  }

  async remove (id: NullableId, params?: Params): Promise<Data> {
    const substore = this.store.get((params as any).type)
    if (substore == null) { return new UserInputError('Invalid type ') }
    if (id != null) { substore.delete(id) }

    return { id }
  }
}
