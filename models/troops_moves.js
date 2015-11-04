module.exports = function (db, DataTypes) {
    return db.define("troops_moves", {
        field_id: {
            type: DataTypes.BIGINT,
            unsigned: true,
            references: {
                model: "fields",
                key: "id"
            }
        },
        troop_id: {
            type: DataTypes.BIGINT,
            unsigned: true,
            references: {
                model: "troops",
                key: "id"
            }
        }
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.troops, {foreignKey: 'troop_id'});
                this.belongsTo(db.models.fields, {foreignKey: 'field_id'});
            }
        }
    });

};