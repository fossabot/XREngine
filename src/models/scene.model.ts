// TODO:
import { Sequelize, DataTypes } from 'sequelize'
import { Application } from '../declarations'

export default (app: Application): any => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const scene = sequelizeClient.define('scene', {
    scene_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false
    },
    scene_sid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // This is the foreign key of user table
    account_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model_owned_file_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    screenshot_owned_file_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      // TODO: Need to define later, not sure about its type now
      type: DataTypes.STRING,
      allowNull: false
    },
    attribution: {
      type: DataTypes.STRING,
      allowNull: true
    },
    allow_remixing: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    allow_promotion: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    scene_owned_file_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // TODO: In reticulum, it is json type, but sql does not support json so need to think about it!
    attributions: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    imported_from_host: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imported_from_port: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    imported_from_sid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parent_scene_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parent_scene_listing_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount (options: any) {
        options.raw = true
      }
    }
  });

  (scene as any).associate = (models: any) => {
    // (scene as any).belongsTo(models.user); // or group
    // (scene as any).belongsToMany(models.object, { through: models.scene_object })
    (scene as any).hasOne(models.project, { foreignKey: 'scene_id' });
    (scene as any).belongsTo(models.scene, { foreignKey: 'parent_scene_id', targetKey: 'scene_id' });
    (scene as any).belongsTo(models.scene_listing, { foreignKey: 'parent_scene_listing_id', targetKey: 'scene_listing_id', allowNull: true });

    (scene as any).belongsTo(models.user, { foreignKey: 'account_id', targetKey: 'userId' });
    (scene as any).belongsTo(models.owned_file, { foreignKey: 'model_owned_file_id', targetKey: 'owned_file_id' });
    (scene as any).belongsTo(models.owned_file, { foreignKey: 'screenshot_owned_id', targetKey: 'owned_file_id' });
    (scene as any).belongsTo(models.owned_file, { foreignKey: 'scene_owned_file_id', targetKey: 'owned_file_id' })
  }

  return scene
}
