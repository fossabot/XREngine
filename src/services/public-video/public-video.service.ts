import { ServiceAddons } from '@feathersjs/feathers'
import { Application } from '../../declarations'
import { PublicVideo } from './public-video.class'
import hooks from './public-video.hooks'
import staticResourceModel from '../../models/static-resource.model'

declare module '../../declarations' {
  interface ServiceTypes {
    'public-video': PublicVideo & ServiceAddons<any>
  }
}

export default (app: Application): void => {
  const options = {
    name: 'public-video',
    Model: staticResourceModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  app.use('/public-video', new PublicVideo(options, app))

  const service = app.service('public-video')

  service.hooks(hooks)
}
