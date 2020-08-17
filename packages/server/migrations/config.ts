import { db } from '../db-config'
const env = process.env.NODE_ENV || 'development'

module.exports = {
  [env]: {
    ...db,
    migrationStorageTableName: '_migrations'
  }
}
