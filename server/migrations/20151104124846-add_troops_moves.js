'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
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
    }).then(function () {
      done()
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.dropTable('troops_moves').then(function () {
      done()
    });
  }
};
