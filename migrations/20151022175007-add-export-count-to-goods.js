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
  db.addColumn('goods', 'export_count', {
    type: 'int',
    unsigned: true,
    notNull: true,
    length: 10
  });
  return null;
};

exports.down = function(db) {
  db.removeColumn('goods', 'export_count');
  return null;
};
