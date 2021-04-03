import { hooks } from '@feathersjs/authentication';
import { iff, disallow } from 'feathers-hooks-common';
// import convertVideo from '@xr3ngine/server-core/src/hooks/convert-video';
import addAttribution from '@xr3ngine/server-core/src/hooks/add-attribution';
import restrictUserRole from '@xr3ngine/server-core/src/hooks/restrict-user-role';
import addUserToBody from '@xr3ngine/server-core/src/hooks/set-loggedin-user-in-body';
import config from '../../appconfig';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = hooks;

export default {
  before: {
    all: [
      iff(
        config.server.mode !== 'media' && config.server.mode !== 'local',
        disallow('external')
      ),
      authenticate('jwt'),
      restrictUserRole('admin')
    ],
    find: [disallow()],
    get: [disallow()],
    create: [addUserToBody('userId')],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [addAttribution/*, convertVideo*/],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
