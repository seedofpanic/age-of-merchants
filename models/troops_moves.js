module.exports = function (db, DataTypes) {
    return db.define("troops", {
        'id': {
            type: DataTypes.BIGINT,
            unsigned: true,
            notNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        field_id: {
            type: DataTypes.BIGINT,
            unsigned: true,
            references: {
                model: "fields",
                key: "id"
            }
        },
        profile_id: {
            type: DataTypes.BIGINT,
            unsigned: true,
            references: {
                model: "profiles",
                key: "id"
            }
        }
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.profiles, {foreignKey: 'profile_id'});
                this.belongsTo(db.models.fields, {foreignKey: 'field_id'});
            }
        }
    });

};