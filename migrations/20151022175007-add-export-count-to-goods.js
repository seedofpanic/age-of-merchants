'use strict';

exports.up = function(db, dataType) {
  db.addColumn('products', 'export_count', {
    type: dataType.BIGINT,
    unsigned: true,
    notNull: true
  });
  return null;
};

exports.down = function(db) {
  db.removeColumn('products', 'export_count');
  return null;
};
