/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-import-module-exports */
import { Model } from 'sequelize';

module.exports = (
  sequelize: any,
  DataTypes: { STRING: any; INTEGER: any; BOOLEAN: any; DATE: any },
) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model: any) {
      user.hasMany(model.conversation, {
        as: 'sentFrom',
        foreignKey: 'sender',
      });
      user.hasMany(model.conversation, {
        as: 'sentTo',
        foreignKey: 'receiver',
      });
      user.hasMany(model.message, {
        as: 'sender',
        foreignKey: 'from',
      });
      user.hasMany(model.message, {
        as: 'receiver',
        foreignKey: 'to',
      });
    }
  }
  user.init(
    {
      fullName: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      otp: { type: DataTypes.INTEGER },
      otpExp: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: 'user',
    },
  );
  return user;
};
