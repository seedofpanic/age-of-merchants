'use strict';

exports.up = function(db, dataType, done) {
  db.addColumn('products', 'export_count', {
    type: dataType.BIGINT,
    unsigned: true,
    notNull: true
  }).then(function () {
    done();
  });
  return null;
};

exports.down = function(db, dataType, done) {
  db.removeColumn('products', 'export_count').then(function () {
    done();
  });
  return null;
};
