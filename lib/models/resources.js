module.exports = function (db, cb) {
    db.models.fields.extendsTo('resources', {
        'forest_c': {type: 'integer', defaultValue: 0},
        'forest_q': {type: 'number', defaultValue: 0},
        'forest_a': {type: 'integer', defaultValue: 0},
        'animals_c': {type: 'integer', defaultValue: 0},
        'animals_q': {type: 'number', defaultValue: 0},
        'animals_a': {type: 'integer', defaultValue: 0},
        'soil_c': {type: 'integer', defaultValue: 0},
        'soil_q': {type: 'number', defaultValue: 0},
        'soil_a': {type: 'integer', defaultValue: 0}
    });
    var resources = db.define('map_fields_resources', {
        'map_fields_id': {type: 'serial', key: true},
        'forest_c': {type: 'integer', defaultValue: 0},
        'forest_q': {type: 'number', defaultValue: 0},
        'forest_a': {type: 'integer', defaultValue: 0},
        'animals_c': {type: 'integer', defaultValue: 0},
        'animals_q': {type: 'number', defaultValue: 0},
        'animals_a': {type: 'integer', defaultValue: 0},
        'soil_c': {type: 'integer', defaultValue: 0},
        'soil_q': {type: 'number', defaultValue: 0},
        'soil_a': {type: 'integer', defaultValue: 0}
    });
    resources.types = {1: 'forest', 2: 'animals', 3: 'soil'};

    return cb();
};