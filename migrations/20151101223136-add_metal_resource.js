'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('fields_resources', 'metal_c', {
      type: Sequelize.BIGINT,
      unsigned: false,
      notNull: true
    });
    queryInterface.addColumn('fields_resources', 'metal_q', {
      type: Sequelize.DECIMAL(10,2),
      unsigned: false,
      notNull: true
    });
    queryInterface.addColumn('fields_resources', 'metal_a', {
      type: Sequelize.BIGINT,
      unsigned: false,
      notNull: true
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('fields_resources', 'metal_c');
    queryInterface.removeColumn('fields_resources', 'metal_q');
    queryInterface.removeColumn('fields_resources', 'metal_a');
  }
};
