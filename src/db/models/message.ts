/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-import-module-exports */
import {
  Model,
} from 'sequelize';

module.exports = (sequelize: any, DataTypes: { UUID: any; STRING: any; BOOLEAN: any; }) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      message.belongsTo(models.user, {
        as: 'sender',
        foreignKey: 'from',
      });
      message.belongsTo(models.user, {
        as: 'receiver',
        foreignKey: 'to',
      });
    }
  }
  message.init({
    to: DataTypes.UUID,
    from: DataTypes.UUID,
    message: DataTypes.STRING,
    conversationId: DataTypes.UUID,
    isActive: DataTypes.BOOLEAN,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    sequelize,
    modelName: 'message',
  });
  return message;
};
