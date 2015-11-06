'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('troops', {
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
      profile_id: {
        type: Sequelize.BIGINT,
        unsigned: true,
        references: {
          model: "profiles",
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
      queryInterface.createTable('soldiers', {
        'id': {
          type: Sequelize.BIGINT,
          unsigned: true,
          notNull: true,
          primaryKey: true,
          autoIncrement: true
        },
        troop_id: {
          type: Sequelize.BIGINT,
          unsigned: true,
          references: {
            model: "troops",
            key: "id"
          }
        },
        product_type: {
          type: Sequelize.INTEGER,
          unsigned: true
        },
        count: {
          type: Sequelize.BIGINT,
          unsigned: true
        },
        quality: {
          type: Sequelize.DECIMAL(10,2),
          unsigned: true
        },
        'createdAt': {
          type: Sequelize.DATE
        },
        'updatedAt': {
          type: Sequelize.DATE
        }
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('soldiers')
    queryInterface.dropTable('troops')
  }
};
