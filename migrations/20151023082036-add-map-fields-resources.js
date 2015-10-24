'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('map_fields_resources', {
      'map_fields_id': {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        length: 10
      },
      'forest_c': {
        type: 'int',
        unsigned: false,
        notNull: true,
        length: 6
      },
      'forest_q': {
        type: 'decimal',
        unsigned: false,
        notNull: true,
        length: '10,2'
      },
      'forest_a': {
        type: 'int',
        unsigned: false,
        notNull: true,
        length: 6
      },
      'animals_c': {
        type: 'int',
        unsigned: false,
        notNull: true,
        length: 6
      },
      'animals_q': {
        type: 'decimal',
        unsigned: false,
        notNull: true,
        length: '10,2'
      },
      'animals_a': {
        type: 'int',
        unsigned: false,
        notNull: true,
        length: 6
      },
      'soil_c': {
        type: 'int',
        unsigned: false,
        notNull: true,
        length: 6
      },
      'soil_q': {
        type: 'decimal',
        unsigned: false,
        notNull: true,
        length: '10,2'
      },
      'soil_a': {
        type: 'decimal',
        unsigned: false,
        notNull: true,
        length: '10,2'
      }
    });
  return null;
};

exports.down = function(db) {
  db.dropTable('map_fields_resources', {ifExists: true});
  return null;
};
