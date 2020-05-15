import { Sequelize, DataTypes } from 'sequelize'
import { Application } from '../declarations'
// @ts-ignore
import GenerateRandomAnimalName from 'random-animal-name-generator'

export default (app: Application): any => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const User = sequelizeClient.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: GenerateRandomAnimalName().toUpperCase(),
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount (options: any) {
        options.raw = true
      }
    }
  });

  (User as any).associate = (models: any) => {
    (User as any).belongsTo(models.user_role, { foreignKey: 'userRole' });
    (User as any).belongsTo(models.instance); // user can only be in one room at a time
    (User as any).hasOne(models.user_settings);
    (User as any).belongsTo(models.party, { through: 'party_user' }); // user can only be part of one party at a time
    (User as any).hasMany(models.collection);
    (User as any).hasMany(models.entity);
    (User as any).belongsToMany(models.user, { as: 'relatedUser', through: models.user_relationship });
    (User as any).belongsToMany(models.group, { through: models.group_user }); // user can join multiple orgs
    (User as any).belongsToMany(models.group_user_rank, { through: models.group_user }); // user can join multiple orgs
    (User as any).hasMany(models.identity_provider);
    (User as any).hasMany(models.static_resource);
    (User as any).hasMany(models.asset, { foreignKey: 'account_id' });
    (User as any).hasMany(models.owned_file, { foreignKey: 'account_id' })
    // (User as any).hasMany(models.conversation, { foreignKey: 'sender_id' })
  }

  return User
}
