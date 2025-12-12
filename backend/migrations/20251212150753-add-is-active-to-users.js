'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true, // Default user dianggap aktif
      allowNull: false
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'is_active');
  }
};