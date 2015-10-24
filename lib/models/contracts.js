module.exports = function (db, cb) {
    db.define('contracts', {
        id: {type: 'serial', key: true},
        goods_id: {type: 'integer', defaultValue: 0},
        dest_id: {type: 'integer', defaultValue: 0},
        count: {type: 'integer', defaultValue: 0},
        type: {type: 'integer', defaultValue: 0},
        done: {type: 'boolean', defaultValue: 0}
    });

    return cb();
};