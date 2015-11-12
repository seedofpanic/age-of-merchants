'use strict';

exports.up = function(db, dataType, done) {
  db.addColumn('contracts', 'type', {
    type: dataType.INTEGER,
    unsigned: true,
    notNull: true
  }).then(function () {
    db.addColumn('contracts', 'done', {
      type: dataType.BOOLEAN,
      unsigned: true,
      notNull: true
    }).then(function () {
      db.addColumn('contracts', 'price', {
        type: dataType.DECIMAL(10,2),
        unsigned: true,
        notNull: true
      }).then(function () {
        done();
      });
    });
  });
  return null;
};

exports.down = function(db, dataType, done) {
  db.removeColumn('contracts', 'type').then(function () {
    db.removeColumn('contracts', 'done').then(function () {
      db.removeColumn('contracts', 'price').then(function () {
        done();
      });
    });
  });
  return null;
};
