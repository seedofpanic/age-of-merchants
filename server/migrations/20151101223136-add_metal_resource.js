'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, done) {
    queryInterface.addColumn('fields_resources', 'metal_c', {
      type: Sequelize.BIGINT,
      unsigned: false,
      notNull: true
    }).then(function () {
      queryInterface.addColumn('fields_resources', 'metal_q', {
        type: Sequelize.DECIMAL(10,2),
        unsigned: false,
        notNull: true
      }).then(function () {
        queryInterface.addColumn('fields_resources', 'metal_a', {
          type: Sequelize.BIGINT,
          unsigned: false,
          notNull: true
        }).then(function (){
          done();
        });
      });
    });
  },

  down: function (queryInterface, Sequelize, done) {
    queryInterface.removeColumn('fields_resources', 'metal_c').then(function () {
      queryInterface.removeColumn('fields_resources', 'metal_q').then(function () {
        queryInterface.removeColumn('fields_resources', 'metal_a').then(function () {
          done();
        });
      });
    });
  }
};
