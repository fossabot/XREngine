// Initializes the `login` service on path `/login`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Login } from './login.class';
import hooks from './login.hooks';
import config from '../../config';
import logger from '../../app/logger';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'login': Login & ServiceAddons<any>;
  }
}

function redirect (req, res, next): Promise<any> {
  try {
    if (res.data.error) {
      return res.redirect(`${(config.client.url)}/?error=${(res.data.error as string)}`);
    }
    return res.redirect(`${(config.client.url)}/auth/magiclink?type=login&token=${(res.data.token as string)}`);
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

export default (app: Application): any => {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/login', new Login(options, app), redirect);

  // Get our initialized service so that we can register hooks
  const service = app.service('login');

  service.hooks(hooks);
};
