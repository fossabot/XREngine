// Initializes the `gameserver-subdomain-provision` service on path `/gameserver-subdomain-provision`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { GameserverSubdomainProvision } from './gameserver-subdomain-provision.class';
import createModel from '../../models/gameserver-subdomain-provision.model';
import hooks from './gameserver-subdomain-provision.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'gameserver-subdomain-provision': GameserverSubdomainProvision & ServiceAddons<any>;
  }
}

export default (app: Application): any => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/gameserver-subdomain-provision', new GameserverSubdomainProvision(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('gameserver-subdomain-provision');

  service.hooks(hooks);
};
