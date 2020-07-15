// Initializes the `accept-invite` service on path `/accept-invite`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AcceptInvite } from './accept-invite.class';
import hooks from './accept-invite.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'accept-invite': AcceptInvite & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/accept-invite', new AcceptInvite(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('accept-invite');

  service.hooks(hooks);
}
