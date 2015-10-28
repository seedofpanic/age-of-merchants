'use strict';

exports.up = function(db, dataType) {
  db.addColumn('contracts', 'type', {
    type: dataType.INTEGER,
    unsigned: true,
    notNull: true
  });
  db.addColumn('contracts', 'done', {
    type: dataType.BOOLEAN,
    unsigned: true,
    notNull: true
  });
  db.addColumn('contracts', 'price', {
    type: dataType.DECIMAL(10,2),
    unsigned: true,
    notNull: true
  });
  return null;
};

exports.down = function(db) {
  db.removeColumn('contracts', 'type');
  db.removeColumn('contracts', 'done');
  db.removeColumn('contracts', 'price');
  return null;
};
