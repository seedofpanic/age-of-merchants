'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.createTable('dialogs', {
      'id': {
        type: Sequelize.BIGINT,
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      'createdAt': {
        type: Sequelize.DATE
      },
      'updatedAt': {
        type: Sequelize.DATE
      }
    }).then(function () {
      queryInterface.createTable('messages', {
        'id': {
          type: Sequelize.BIGINT,
          unsigned: true,
          notNull: true,
          primaryKey: true,
          autoIncrement: true
        },
        'dialog_id': {
          type: Sequelize.BIGINT,
          unsigned: true,
          notNull: true,
          references: {
            model: "dialogs",
            key: "id"
          }
        },
        'user_id': {
          type: Sequelize.BIGINT,
          unsigned: true,
          notNull: true,
          references: {
            model: "users",
            key: "id"
          }
        },
        'msg': {
          type: Sequelize.TEXT
        },
        'viewed': {
          type: Sequelize.BOOLEAN
        },
        'createdAt': {
          type: Sequelize.DATE
        },
        'updatedAt': {
          type: Sequelize.DATE
        }
      }).then(function () {
        queryInterface.createTable('dialogs_users', {
          'id': {
            type: Sequelize.BIGINT,
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true
          },
          'dialog_id': {
            type: Sequelize.BIGINT,
            unsigned: true,
            notNull: true,
            references: {
              model: "dialogs",
              key: "id"
            }
          },
          'user_id': {
            type: Sequelize.BIGINT,
            unsigned: true,
            notNull: true,
            references: {
              model: "users",
              key: "id"
            }
          },
          'new': {
            type: Sequelize.INTEGER,
            unsigned: true,
            notNull: true
          },
          'createdAt': {
            type: Sequelize.DATE
          },
          'updatedAt': {
            type: Sequelize.DATE
          }
        }).then(function () {
          done();
        });
      });
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.dropTable('dialogs_users').then(function () {
      queryInterface.dropTable('messages').then(function () {
        queryInterface.dropTable('dialogs').then(function () {
          done();
        });
      });
    });
  }
};
