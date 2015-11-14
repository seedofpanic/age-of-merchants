'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('buildings', 'worker_s', {
      type: Sequelize.DECIMAL(10,2),
      unsigned: true,
      notNull: true,
      defaultValue: 0
    }).then(function () {
      queryInterface.addColumn('fields', 'avg_salary', {
        type: Sequelize.DECIMAL(10, 2),
        unsigned: true,
        notNull: true,
        defaultValue: 0
      }).then(function () {
        done();
      });
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('buildings', 'worker_s').then(function () {
      queryInterface.removeColumn('fields', 'avg_salary').then(function () {
        done();
      });
    });
  }

};
