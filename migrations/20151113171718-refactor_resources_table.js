'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.dropTable('fields_resources').then(function () {
      queryInterface.createTable('fields_resources', {
        'field_id': {
          type: Sequelize.BIGINT,
          unsigned: true,
          notNull: true,
          primaryKey: true,
          references: {
            model: "fields",
            key: "id"
          }
        },
        'type': {
          type: Sequelize.INTEGER,
          unsigned: true,
          notNull: true,
          primaryKey: true
        },
        'c': {
          type: Sequelize.BIGINT,
          unsigned: false,
          notNull: true
        },
        'q': {
          type: Sequelize.DECIMAL(10,2),
          unsigned: false,
          notNull: true
        },
        'a': {
          type: Sequelize.BIGINT,
          unsigned: false,
          notNull: true
        }
      }).then(function () {
        done();
      });
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.dropTable('resources').then(function () {
      console.log('No rollback for this migration!');
      done();
    });
  }

};
