'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('products', 'is_army', {
      type: Sequelize.BOOLEAN,
      notNull: true,
      defaultValue: false
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('products', 'is_army');
  }
};
