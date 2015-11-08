'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('buildings', 'mode', {
      type: Sequelize.INTEGER,
      unsigned: false,
      notNull: true
    });
    queryInterface.addColumn('buildings', 'out_type', {
      type: Sequelize.INTEGER,
      unsigned: true,
      notNull: true
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('buildings', 'mode');
    queryInterface.removeColumn('buildings', 'out_type');
  }
};
