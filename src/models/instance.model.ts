import { Sequelize, DataTypes } from 'sequelize'
import { Application } from '../declarations'
// import Location from './location.model'

export default (app: Application): any => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const instance = sequelizeClient.define('instance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true
    },
    currentUsers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    hooks: {
      beforeCount (options: any) {
        options.raw = true
      }
    }
  });

  (instance as any).associate = (models: any) => {
    (instance as any).belongsTo(models.location);
    (instance as any).hasMany(models.user)
  }
  return instance
}
