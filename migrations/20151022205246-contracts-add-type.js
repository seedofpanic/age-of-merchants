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
  db.addColumn('contracts', 'type', {
    type: 'smallint',
    unsigned: true,
    notNull: true,
    length: 1
  });
  db.addColumn('contracts', 'done', {
    type: 'smallint',
    unsigned: true,
    notNull: true,
    length: 1
  });
  db.addColumn('contracts', 'price', {
    type: 'decimal',
    unsigned: true,
    notNull: true,
    length: '10,2'
  });
  return null;
};

exports.down = function(db) {
  db.removeColumn('contracts', 'type');
  db.removeColumn('contracts', 'done');
  db.removeColumn('contracts', 'price');
  return null;
};
