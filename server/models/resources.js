module.exports = function (db, DataTypes) {
    var types = {0: 'gold', 1: 'forest', 2: 'animals', 3: 'soil', 4: 'metal'};
    var names = {};
    Object.keys(types).forEach(function (id) {
       names[types[id]] = id;
    });
    return db.define('fields_resources', {
        'field_id': {type: DataTypes.BIGINT, primaryKey: true},
        'type': {type: DataTypes.INTEGER, primaryKey: true},
        'c': DataTypes.BIGINT,
        'q': DataTypes.DECIMAL(10, 2),
        'a': DataTypes.BIGINT
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.fields, {foreignKey: 'field_id'});
            },
            types: types,
            names: names
        },
        timestamps: false
    });
};