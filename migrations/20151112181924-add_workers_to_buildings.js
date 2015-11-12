'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('buildings', 'workers_c', {
      type: Sequelize.INTEGER,
      unsigned: false,
      notNull: true,
      defaultValue: 0
    }).then(function () {
      queryInterface.addColumn('buildings', 'workers_q', {
        type: Sequelize.DECIMAL(10, 2),
        unsigned: false,
        notNull: true,
        defaultValue: 0
      }).then(function () {
        done();
      })
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('buildings', 'workers_c').then(function () {
      queryInterface.removeColumn('buildings', 'workers_q').then(function () {
        done();
      })
    })
  }
};
