/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-import-module-exports */
import { Model } from 'sequelize';

module.exports = (
  sequelize: any,
  DataTypes: { UUID: any; ENUM: any; BOOLEAN: any; STRING: any },
) => {
  class conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model: any) {
      conversation.belongsTo(model.user, {
        as: 'sentFrom',
        foreignKey: 'sender',
      });
      conversation.belongsTo(model.user, {
        as: 'sentTo',
        foreignKey: 'receiver',
      });
    }
  }
  conversation.init(
    {
      sender: DataTypes.UUID,
      receiver: DataTypes.UUID,
      status: {
        type: DataTypes.ENUM(
          'accepted',
          'pending',
          'rejected',
          'blocked',
          'unblocked',
          'unfriend',
        ),
        defaultValue: 'pending',
      },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'conversation',
    },
  );
  return conversation;
};
