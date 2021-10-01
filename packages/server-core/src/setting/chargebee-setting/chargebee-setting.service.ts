import { ServiceAddons } from '@feathersjs/feathers'
import hooks from './chargebee-setting.hooks'
import { Application } from '.../../../declarations'
import { ChargebeeSetting } from './chargebee-setting.class'
import createModel from './chargebee-setting.model'

declare module '../../../declarations' {
  interface SerViceTypes {
    Chargebee: ChargebeeSetting & ServiceAddons<any>
  }
}

export default (app: Application): void => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  const event = new ChargebeeSetting(options, app)
  app.use('/chargebee-setting', event)
  const service = app.service('chargebee-setting')
  service.hooks(hooks as any)
}
