import * as authentication from '@feathersjs/authentication';
import { disallow } from 'feathers-hooks-common';

import addThumbnailFileId from '@xrengine/server-core/src/hooks/add-thumbnail-file-id';
import addUriToFile from '@xrengine/server-core/src/hooks/add-uri-to-file';
import attachOwnerIdInSavingContact from '@xrengine/server-core/src/hooks/set-loggedin-user-in-body';
import createOwnedFile from '@xrengine/server-core/src/hooks/create-owned-file';
import logRequest from '@xrengine/server-core/src/hooks/log-request';
import makeS3FilesPublic from '@xrengine/server-core/src/hooks/make-s3-files-public';
import reformatUploadResult from '@xrengine/server-core/src/hooks/reformat-upload-result';
import removePreviousThumbnail from '@xrengine/server-core/src/hooks/remove-previous-thumbnail';
import setResponseStatus from '@xrengine/server-core/src/hooks/set-response-status-code';

// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [logRequest()],
    find: [disallow()],
    get: [],
    create: [authenticate('jwt'), attachOwnerIdInSavingContact('userId'), addUriToFile(), makeS3FilesPublic()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [reformatUploadResult(), addThumbnailFileId(), removePreviousThumbnail(), createOwnedFile(), setResponseStatus(200)],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [logRequest()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
