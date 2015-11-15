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
            },
            check: function (id, user_id) {
                return this.find({where: {id: id}, include: {model: db.models.troops, required: true, include: {model: db.models.profiles, required: true, where: {user_id: user_id}}}});
            }
        }
    });

};