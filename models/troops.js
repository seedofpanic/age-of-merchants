module.exports = function (db, DataTypes) {
    return db.define("troops", {
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
                this.hasOne(db.models.troops_moves, {foreignKey: 'troop_id', as: 'move'});
                this.hasMany(db.models.troops_attacks, {foreignKey: 'troop_id', as: 'attacks'});
                this.hasMany(db.models.troops_attacks, {foreignKey: 'target_id', as: 'assaults'});
            }
        },
        instanceMethods: {
            dead: false
        }
    });

};