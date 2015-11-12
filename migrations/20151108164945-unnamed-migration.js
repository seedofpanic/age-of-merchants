'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('buildings', 'mode', {
      type: Sequelize.INTEGER,
      unsigned: false,
      notNull: true
    }).then(function () {
      queryInterface.addColumn('buildings', 'out_type', {
        type: Sequelize.INTEGER,
        unsigned: true,
        notNull: true
      }).then(function () {
        done()
      });
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('buildings', 'mode').then(function () {
      queryInterface.removeColumn('buildings', 'out_type').then(function () {
        done()
      });
    });
  }
};
