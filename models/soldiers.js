module.exports = function (db, DataTypes) {
    return db.define("soldiers", {
        troop_id: {
            type: DataTypes.BIGINT,
            unsigned: true,
            references: {
                model: "troops",
                key: "id"
            }
        },
        product_type: {
            type: DataTypes.INTEGER,
            unsigned: true
        },
        count: {
            type: DataTypes.BIGINT,
            unsigned: true
        },
        quality: {
            type: DataTypes.DECIMAL(10,2),
            unsigned: true
        }
    }, {
        classMethods: {
            stats: {
                6: {
                    power: [1,3],
                    life: 5
                }
            },
            associate: function () {
                this.belongsTo(db.models.troops, {foreignKey: 'troop_id'});
            },
            check: function (id, user_id) {
                return this.find({where: {id: id}, include: {model: db.models.troops, required: true, include: {model: db.models.profiles, required: true, where: {user_id: user_id}}}});
            }
        },
        instanceMethods: {
            power: 0,
            life: 0
        }
    });

};