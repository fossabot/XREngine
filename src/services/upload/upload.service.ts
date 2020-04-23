import express from 'express'
import { ServiceAddons } from '@feathersjs/feathers'
import multer from 'multer'
import StorageProvider from '../../storage/storageprovider'
import blobService from 'feathers-blob'

import { Application } from '../../declarations'
import { Upload } from './upload.class'
import hooks from './upload.hooks'

const multipartMiddleware = multer()

declare module '../../declarations' {
  interface ServiceTypes {
    'upload': Upload & ServiceAddons<any>
  }
}

export default (app: Application): void => {
  const provider = new StorageProvider()

  app.use('/upload',
    multipartMiddleware.fields([{ name: 'file' }, { name: 'thumbnail' }]),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req?.feathers) {
        req.feathers.file = (req as any).files.file ? (req as any).files.file[0] : null
        req.feathers.body = (req as any).body
        req.feathers.mime_type = req.feathers.file.mimetype
        req.feathers.storageProvider = provider
        req.feathers.thumbnail = (req as any).files.thumbnail ? (req as any).files.thumbnail[0] : null
        next()
      }
    },
    blobService({ Model: provider.getStorage() })
  )

  const service = app.service('upload')

  service.hooks(hooks)
}
