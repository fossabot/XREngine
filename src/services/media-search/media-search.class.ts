import SketchFabMedia from './sketch-fab.class'
import GooglePolyMedia from './google-poly.class'
import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'

interface Data {}

interface ServiceOptions {}

export class MediaSearch implements ServiceMethods<Data> {
  app: Application
  options: ServiceOptions

  private readonly pageSize = 24

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    const source = params?.query?.source
    let result

    // TODO: Add work from black list item

    if (params?.query) {
      params.query = { ...params?.query, pageSize: this.pageSize }
    }
    // TODO: Add more sources
    switch (source) {
      case 'sketchfab': {
        const sketchFabMediaInstance = new SketchFabMedia()
        result = await sketchFabMediaInstance.searchSketchFabMedia(params?.query)
        break
      }
      case 'poly': {
        const googlePolyMediaInsance = new GooglePolyMedia()
        result = await googlePolyMediaInsance.searchGooglePolyMedia(params?.query)
        break
      }
    }
    return result
  }

  async get (id: Id, params?: Params): Promise<Data> {
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data: Data, params?: Params): Promise<Data> {
    return await Promise.resolve({})
  }

  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  async remove (id: NullableId, params?: Params): Promise<Data> {
    return { id }
  }
}
