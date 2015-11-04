'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('troops_moves', {
      'id': {
        type: Sequelize.BIGINT,
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      field_id: {
        type: Sequelize.BIGINT,
        unsigned: true,
        references: {
          model: "fields",
          key: "id"
        }
      },
      troop_id: {
        type: Sequelize.BIGINT,
        unsigned: true,
        references: {
          model: "troops",
          key: "id"
        }
      },
      'createdAt': {
        type: Sequelize.DATE
      },
      'updatedAt': {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('troops_moves')
  }
};
