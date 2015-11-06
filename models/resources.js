module.exports = function (db, DataTypes) {
    return db.define('fields_resources', {
        'field_id': {type: DataTypes.BIGINT ,primaryKey: true},
        'forest_c': DataTypes.BIGINT,
        'forest_q': DataTypes.DECIMAL(10, 2),
        'forest_a': DataTypes.BIGINT,
        'animals_c': DataTypes.BIGINT,
        'animals_q': DataTypes.DECIMAL(10, 2),
        'animals_a': DataTypes.BIGINT,
        'soil_c': DataTypes.BIGINT,
        'soil_q': DataTypes.DECIMAL(10, 2),
        'soil_a': DataTypes.BIGINT,
        'metal_c': DataTypes.BIGINT,
        'metal_q': DataTypes.DECIMAL(10, 2),
        'metal_a': DataTypes.BIGINT
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.fields, {foreignKey: 'field_id'});
            },
            types: {1: 'forest', 2: 'animals', 3: 'soil', 4:'metal'}
        }
    });
};