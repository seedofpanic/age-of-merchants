module.exports = function (db, cb) {
    db.define('map_regions', {
        id: {type: 'serial', key: true},
        name: {type: 'text'},
        x: {type: 'integer', defaultValue: 0},
        y: {type: 'integer', defaultValue: 0}
    });

    return cb();
};