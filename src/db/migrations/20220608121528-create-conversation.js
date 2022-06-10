/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      sender: {
        type: Sequelize.UUID,
      },
      receiver: {
        type: Sequelize.UUID,
      },
      status: {
        type: Sequelize.ENUM(
          'accepted',
          'pending',
          'rejected',
          'blocked',
          'unblocked',
          'unfriend',
        ),
        defaultValue: 'pending',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversations');
  },
};
