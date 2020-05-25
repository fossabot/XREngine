import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { BadRequest } from '@feathersjs/errors'
import app from './../../app'

interface Data {}

interface ServiceOptions {}

export class SubscriptionConfirm implements ServiceMethods<Data> {
  app: Application
  options: ServiceOptions

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return []
  }

  async get (id: Id, params?: Params): Promise<Data> {
    const userId = (params as any).query.customer_id
    const subscriptionResult = await app.service('subscription').find({
      where: {
        id: id,
        userId: userId,
        status: 0
      }
    })
    console.log(subscriptionResult)
    if ((subscriptionResult as any).total > 0) {
      const subscription = (subscriptionResult as any).data[0]
      console.log(subscription)
      console.log('Getting subscription-type')
      const subscriptionType = await app.service('subscription-type').get((subscription).plan)
      console.log(subscriptionType)
      await app.service('subscription').patch(id, {
        status: 1,
        totalSeats: subscriptionType.seats,
        filledSeats: 0,
        unusedSeats: subscriptionType.seats,
        pendingSeats: 0
      })

      console.log('PATCHED SUBSCRIPTION')
      await app.service('seat').create({
        subscriptionId: (subscription).id
      }, {
        self: true,
        userId: userId
      })
      return await Promise.resolve({})
    } else {
      throw new BadRequest('Invalid subscription information')
    }
  }

  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return await Promise.all(data.map(current => this.create(current, params)))
    }

    return data
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
