'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('products', 'is_army', {
      type: Sequelize.BOOLEAN,
      notNull: true,
      defaultValue: false
    }).then(function () {
      done()
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('products', 'is_army').then(function () {
      done()
    });
  }
};
