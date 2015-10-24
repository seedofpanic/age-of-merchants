module.exports = function (db, cb) {
    db.models.fields = db.define('map_fields', {
        id: {type: 'serial', key: true},
        region_id: {type: 'integer', defaultValue: 0},
        x: {type: 'integer', defaultValue: 0},
        y: {type: 'integer', defaultValue: 0}
    },{autoFetch: true});

    db.define('map_fields', {
        id: {type: 'serial', key: true},
        region_id: {type: 'integer', defaultValue: 0},
        x: {type: 'integer', defaultValue: 0},
        y: {type: 'integer', defaultValue: 0}
    },{autoFetch: true});

    return cb();
};