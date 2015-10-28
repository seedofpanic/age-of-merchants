module.exports = function (db, DataTypes) {

    return db.define('fields', {
        region_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "regions",
                key: "id"
            }
        },
        x: DataTypes.INTEGER,
        y: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.regions, {foreignKey: 'region_id'});
                this.hasOne(db.models.fields_resources, {foreignKey: 'field_id', as: 'res'});
            }
        }
    });

};