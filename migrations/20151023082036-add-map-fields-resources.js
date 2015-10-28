'use strict';

exports.up = function(db, dataType) {
  db.createTable('fields_resources', {
      'field_id': {
        type: dataType.BIGINT,
        unsigned: true,
        notNull: true,
        primaryKey: true,
          references: {
              model: "fields",
              key: "id"
          }
      },
      'forest_c': {
        type: dataType.BIGINT,
        unsigned: false,
        notNull: true
      },
      'forest_q': {
        type: dataType.DECIMAL(10,2),
        unsigned: false,
        notNull: true
      },
      'forest_a': {
        type: dataType.BIGINT,
        unsigned: false,
        notNull: true
      },
      'animals_c': {
        type: dataType.BIGINT,
        unsigned: false,
        notNull: true
      },
      'animals_q': {
        type: dataType.DECIMAL(10,2),
        unsigned: false,
        notNull: true
      },
      'animals_a': {
        type: dataType.BIGINT,
        unsigned: false,
        notNull: true
      },
      'soil_c': {
        type: dataType.BIGINT,
        unsigned: false,
        notNull: true
      },
      'soil_q': {
        type: dataType.DECIMAL(10,2),
        unsigned: false,
        notNull: true
      },
      'soil_a': {
        type: dataType.BIGINT,
        unsigned: false,
        notNull: true
      },
      'createdAt': {
          type: dataType.DATE
      },
      'updatedAt': {
          type: dataType.DATE
      }
    });
  return null;
};

exports.down = function(db) {
  db.dropTable('fields_resources');
  return null;
};
